import { NextRequest, NextResponse } from "next/server";
import {
  asImageUrl,
  asList,
  asNumber,
  asSpotifyUrl,
  asString,
  spotifyFetch,
  SpotifyAuthError,
  SpotifyRequestError,
  type SpotifyTrack,
} from "@/lib/spotify-api";

type SpotifyDevice = {
  name?: string | null;
  volume_percent?: number | null;
};

type SpotifyPlaybackState = {
  currently_playing_type?: string | null;
  device?: SpotifyDevice | null;
  is_playing?: boolean | null;
  item?: SpotifyTrack | null;
  progress_ms?: number | null;
  repeat_state?: string | null;
  shuffle_state?: boolean | null;
};

type SpotifyRecentlyPlayedResponse = {
  items?: Array<{
    played_at?: string | null;
    track?: SpotifyTrack | null;
  }> | null;
};

function normalizeTrack(track: SpotifyTrack | null | undefined) {
  if (!track) {
    return null;
  }

  return {
    id: asString(track.id, crypto.randomUUID()),
    name: asString(track.name, "Faixa sem nome"),
    artistNames:
      asList(track.artists)
        .map((artist) => asString(artist.name, ""))
        .filter(Boolean)
        .join(", ") || "Artista nao informado",
    imageUrl: asImageUrl(track.album?.images),
    album: asString(track.album?.name, "Album nao informado"),
    durationMs: asNumber(track.duration_ms, 0),
    popularity: asNumber(track.popularity, 0),
    spotifyUrl: asSpotifyUrl(track.external_urls),
    previewUrl: typeof track.preview_url === "string" && track.preview_url.trim().length > 0 ? track.preview_url : null,
  };
}

function buildResponseHeaders() {
  return {
    "Cache-Control": "private, max-age=30, stale-while-revalidate=120",
  };
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("sp_access_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [currentState, playerState, recentResponse] = await Promise.all([
      spotifyFetch<SpotifyPlaybackState>("/me/player/currently-playing", token, { allowEmpty: true }),
      spotifyFetch<SpotifyPlaybackState>("/me/player", token, { allowEmpty: true }),
      spotifyFetch<SpotifyRecentlyPlayedResponse>("/me/player/recently-played?limit=20", token),
    ]);

    const activeState = currentState ?? playerState;

    return NextResponse.json(
      {
        fetchedAt: new Date().toISOString(),
        current: activeState?.item
          ? {
              track: normalizeTrack(activeState.item),
              isPlaying: Boolean(activeState.is_playing),
              progressMs: activeState?.progress_ms ?? null,
              repeatState: asString(activeState?.repeat_state, "off"),
              shuffleState: Boolean(activeState?.shuffle_state),
              deviceName: activeState?.device ? asString(activeState.device.name, "Dispositivo indisponivel") : null,
              volumePercent: activeState?.device ? asNumber(activeState.device.volume_percent, 0) : null,
              playingType: asString(activeState?.currently_playing_type, "track"),
            }
          : null,
        player: {
          isPlaying: Boolean(playerState?.is_playing),
          deviceName: playerState?.device ? asString(playerState.device.name, "Dispositivo indisponivel") : null,
          volumePercent: playerState?.device ? asNumber(playerState.device.volume_percent, 0) : null,
          repeatState: asString(playerState?.repeat_state, "off"),
          shuffleState: Boolean(playerState?.shuffle_state),
          progressMs: playerState?.progress_ms ?? null,
        },
        recent: asList(recentResponse?.items)
          .map((item) => ({
            playedAt: typeof item.played_at === "string" ? item.played_at : null,
            track: normalizeTrack(item.track),
          }))
          .filter((item): item is { playedAt: string | null; track: NonNullable<ReturnType<typeof normalizeTrack>> } => item.track !== null),
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
