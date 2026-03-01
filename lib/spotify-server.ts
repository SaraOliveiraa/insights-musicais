import { createHmac, timingSafeEqual } from "node:crypto";
import { buildDashboardData, toShareSnapshot } from "@/lib/spotify-insights";
import type { ShareSnapshot, TimeRange } from "@/lib/spotify-schema";
import {
  normalizeArtists,
  normalizeProfile,
  normalizeTracks,
  spotifyFetch,
  SpotifyAuthError,
  type SpotifyArtist,
  type SpotifyListResponse,
  type SpotifyTrack,
  type SpotifyUser,
} from "@/lib/spotify-api";
import { TIME_RANGES } from "@/lib/spotify-schema";

export { SpotifyAuthError, SpotifyRequestError } from "@/lib/spotify-api";

function getShareSecret() {
  return process.env.REPORT_SHARE_SECRET ?? `${process.env.SPOTIFY_CLIENT_ID ?? "spotify"}:${process.env.NEXT_PUBLIC_APP_URL ?? "local-dev"}`;
}

function createShareToken(snapshot: ShareSnapshot) {
  const payload = Buffer.from(JSON.stringify(snapshot), "utf8").toString("base64url");
  const signature = createHmac("sha256", getShareSecret()).update(payload).digest("base64url");

  return `${payload}.${signature}`;
}

export function readShareToken(token: string): ShareSnapshot | null {
  const [payload, signature] = token.split(".");

  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = createHmac("sha256", getShareSecret()).update(payload).digest();
  const receivedSignature = Buffer.from(signature, "base64url");

  if (expectedSignature.length !== receivedSignature.length) {
    return null;
  }

  if (!timingSafeEqual(expectedSignature, receivedSignature)) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as ShareSnapshot;

    if (parsed.version !== 1) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export async function getDashboardData(token: string, selectedRange: TimeRange) {
  const [me, ...rangeResponses] = await Promise.all([
    spotifyFetch<SpotifyUser>("/me", token),
    ...TIME_RANGES.flatMap((range) => [
      spotifyFetch<SpotifyListResponse<SpotifyArtist>>(`/me/top/artists?time_range=${range}&limit=10`, token),
      spotifyFetch<SpotifyListResponse<SpotifyTrack>>(`/me/top/tracks?time_range=${range}&limit=10`, token),
    ]),
  ]);

  if (!me) {
    throw new SpotifyAuthError();
  }

  const periods = TIME_RANGES.reduce<Record<TimeRange, { artists: ReturnType<typeof normalizeArtists>; tracks: ReturnType<typeof normalizeTracks> }>>(
    (accumulator, range, index) => {
      accumulator[range] = {
        artists: normalizeArtists(rangeResponses[index * 2] ?? {}),
        tracks: normalizeTracks(rangeResponses[index * 2 + 1] ?? {}),
      };

      return accumulator;
    },
    {} as Record<TimeRange, { artists: ReturnType<typeof normalizeArtists>; tracks: ReturnType<typeof normalizeTracks> }>,
  );

  const data = buildDashboardData(normalizeProfile(me), periods, selectedRange);
  const shareUrl = `/share/${createShareToken(toShareSnapshot(data))}`;

  return {
    ...data,
    report: {
      ...data.report,
      shareUrl,
      canShare: true,
    },
  };
}
