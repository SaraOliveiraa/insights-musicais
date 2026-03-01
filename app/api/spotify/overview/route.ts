import { NextRequest, NextResponse } from "next/server";
import {
  asList,
  asNumber,
  asString,
  normalizeProfile,
  spotifyFetch,
  SpotifyAuthError,
  SpotifyRequestError,
  type SpotifyUser,
} from "@/lib/spotify-api";

type SpotifyDevice = {
  id?: string | null;
  is_active?: boolean | null;
  is_restricted?: boolean | null;
  name?: string | null;
  supports_volume?: boolean | null;
  type?: string | null;
  volume_percent?: number | null;
};

type SpotifyDevicesResponse = {
  devices?: SpotifyDevice[] | null;
};

type SpotifyPlaybackState = {
  device?: SpotifyDevice | null;
  is_playing?: boolean | null;
  progress_ms?: number | null;
  repeat_state?: string | null;
  shuffle_state?: boolean | null;
};

function normalizeDevice(device: SpotifyDevice) {
  return {
    id: asString(device.id, crypto.randomUUID()),
    name: asString(device.name, "Dispositivo indisponivel"),
    type: asString(device.type, "desconhecido"),
    isActive: Boolean(device.is_active),
    isRestricted: Boolean(device.is_restricted),
    supportsVolume: Boolean(device.supports_volume),
    volumePercent: asNumber(device.volume_percent, 0),
  };
}

function buildResponseHeaders() {
  return {
    "Cache-Control": "private, max-age=60, stale-while-revalidate=240",
  };
}

export async function GET(req: NextRequest) {
  const token = req.cookies.get("sp_access_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [me, devicesResponse, playerState] = await Promise.all([
      spotifyFetch<SpotifyUser>("/me", token),
      spotifyFetch<SpotifyDevicesResponse>("/me/player/devices", token, { allowEmpty: true }),
      spotifyFetch<SpotifyPlaybackState>("/me/player", token, { allowEmpty: true }),
    ]);

    if (!me) {
      throw new SpotifyAuthError();
    }

    return NextResponse.json(
      {
        fetchedAt: new Date().toISOString(),
        profile: normalizeProfile(me),
        devices: asList(devicesResponse?.devices).map(normalizeDevice),
        player: {
          hasActiveSession: Boolean(playerState?.device),
          deviceName: playerState?.device ? asString(playerState.device.name, "Dispositivo indisponivel") : null,
          isPlaying: Boolean(playerState?.is_playing),
          repeatState: asString(playerState?.repeat_state, "off"),
          shuffleState: Boolean(playerState?.shuffle_state),
          progressMs: playerState?.progress_ms ?? null,
        },
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
