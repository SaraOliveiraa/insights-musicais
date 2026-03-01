import { NextRequest, NextResponse } from "next/server";
import { parseTimeRange } from "@/lib/spotify-insights";
import {
  normalizeArtists,
  normalizeTracks,
  spotifyFetch,
  SpotifyAuthError,
  SpotifyRequestError,
  type SpotifyArtist,
  type SpotifyListResponse,
  type SpotifyTrack,
} from "@/lib/spotify-api";

function parseLimit(value: string | null) {
  const numericValue = Number(value ?? "20");

  if (!Number.isInteger(numericValue) || numericValue < 1 || numericValue > 50) {
    return null;
  }

  return numericValue;
}

function buildResponseHeaders() {
  return {
    "Cache-Control": "private, max-age=180, stale-while-revalidate=600",
  };
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("sp_access_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(req.url);
  const range = parseTimeRange(url.searchParams.get("range"));
  const limit = parseLimit(url.searchParams.get("limit"));

  if (limit === null) {
    return NextResponse.json({ error: "Invalid limit" }, { status: 400 });
  }

  try {
    const [artistsResponse, tracksResponse] = await Promise.all([
      spotifyFetch<SpotifyListResponse<SpotifyArtist>>(`/me/top/artists?time_range=${range}&limit=${limit}`, token),
      spotifyFetch<SpotifyListResponse<SpotifyTrack>>(`/me/top/tracks?time_range=${range}&limit=${limit}`, token),
    ]);

    return NextResponse.json(
      {
        fetchedAt: new Date().toISOString(),
        range,
        limit,
        artists: normalizeArtists(artistsResponse ?? {}),
        tracks: normalizeTracks(tracksResponse ?? {}),
      },
      {
        status: 200,
        headers: buildResponseHeaders(),
      },
    );
  } catch (error) {
    if (error instanceof SpotifyAuthError) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (error instanceof SpotifyRequestError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }

    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
