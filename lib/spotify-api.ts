export type SpotifyImage = {
  url?: string | null;
};

export type SpotifyUser = {
  country?: string | null;
  display_name?: string | null;
  email?: string | null;
  external_urls?: {
    spotify?: string | null;
  } | null;
  followers?: {
    total?: number | null;
  } | null;
  images?: SpotifyImage[] | null;
  product?: string | null;
};

export type SpotifyArtist = {
  external_urls?: {
    spotify?: string | null;
  } | null;
  followers?: {
    total?: number | null;
  } | null;
  genres?: string[] | null;
  id?: string | null;
  images?: SpotifyImage[] | null;
  name?: string | null;
  popularity?: number | null;
};

export type SpotifyTrack = {
  album?: {
    images?: SpotifyImage[] | null;
    name?: string | null;
  } | null;
  artists?: Array<{
    name?: string | null;
  }> | null;
  external_urls?: {
    spotify?: string | null;
  } | null;
  duration_ms?: number | null;
  id?: string | null;
  name?: string | null;
  popularity?: number | null;
  preview_url?: string | null;
};

export type SpotifyListResponse<T> = {
  items?: T[] | null;
};

export class SpotifyAuthError extends Error {
  constructor() {
    super("spotify_auth_error");
  }
}

export class SpotifyRequestError extends Error {
  constructor(
    readonly endpoint: string,
    readonly status: number,
    readonly details: string,
  ) {
    super(`${endpoint} -> ${status} ${details}`);
  }
}

export function asList<T>(value: T[] | null | undefined) {
  return Array.isArray(value) ? value : [];
}

export function asString(value: string | null | undefined, fallback: string) {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

export function asNumber(value: number | null | undefined, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function asStringArray(value: string[] | null | undefined) {
  return asList(value).filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

export function asImageUrl(images: SpotifyImage[] | null | undefined) {
  const firstValidImage = asList(images).find(
    (image) => typeof image?.url === "string" && image.url.trim().length > 0,
  );

  return firstValidImage?.url ?? null;
}

export function asSpotifyUrl(externalUrls: { spotify?: string | null } | null | undefined) {
  return asString(externalUrls?.spotify, "https://open.spotify.com/");
}

export async function spotifyFetch<T>(endpoint: string, token: string, options?: { allowEmpty?: boolean }): Promise<T | null> {
  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (response.status === 401) {
    throw new SpotifyAuthError();
  }

  if (options?.allowEmpty && response.status === 204) {
    return null;
  }

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new SpotifyRequestError(endpoint, response.status, details);
  }

  return response.json() as Promise<T>;
}

export function normalizeProfile(me: SpotifyUser) {
  return {
    name: asString(me.display_name, "Visitante"),
    email: typeof me.email === "string" && me.email.trim().length > 0 ? me.email : null,
    avatarUrl: asImageUrl(me.images),
    followers: asNumber(me.followers?.total),
    country: asString(me.country, "BR"),
    plan: asString(me.product, "free"),
    spotifyUrl: asSpotifyUrl(me.external_urls),
  };
}

export function normalizeArtists(response: SpotifyListResponse<SpotifyArtist>) {
  return asList(response.items).map((artist, index) => ({
    id: asString(artist.id, `artist-${index + 1}`),
    rank: index + 1,
    name: asString(artist.name, "Artista sem nome"),
    imageUrl: asImageUrl(artist.images),
    genres: asStringArray(artist.genres),
    followers: asNumber(artist.followers?.total),
    popularity: asNumber(artist.popularity),
    spotifyUrl: asSpotifyUrl(artist.external_urls),
  }));
}

export function normalizeTracks(response: SpotifyListResponse<SpotifyTrack>) {
  return asList(response.items).map((track, index) => ({
    id: asString(track.id, `track-${index + 1}`),
    rank: index + 1,
    name: asString(track.name, "Faixa sem nome"),
    artistNames:
      asList(track.artists)
        .map((artist) => asString(artist.name, ""))
        .filter(Boolean)
        .join(", ") || "Artista nao informado",
    imageUrl: asImageUrl(track.album?.images),
    album: asString(track.album?.name, "Album nao informado"),
    popularity: asNumber(track.popularity),
    durationMs: asNumber(track.duration_ms),
    spotifyUrl: asSpotifyUrl(track.external_urls),
  }));
}
