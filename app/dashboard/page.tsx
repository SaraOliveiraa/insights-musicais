import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardClient from "./dashboard-client";
import type { DashboardData } from "./types";

type SpotifyImage = {
  url?: string | null;
};

type SpotifyUser = {
  country?: string | null;
  display_name?: string | null;
  external_urls?: {
    spotify?: string | null;
  } | null;
  followers?: {
    total?: number | null;
  } | null;
  images?: SpotifyImage[] | null;
  product?: string | null;
};

type SpotifyArtist = {
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

type SpotifyTrack = {
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
};

type SpotifyListResponse<T> = {
  items?: T[] | null;
};

async function spotifyFetch<T>(endpoint: string, token: string): Promise<T> {
  const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (response.status === 401) {
    redirect("/");
  }

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`${endpoint} -> ${response.status} ${text}`);
  }

  return response.json() as Promise<T>;
}

function asList<T>(value: T[] | null | undefined) {
  return Array.isArray(value) ? value : [];
}

function asString(value: string | null | undefined, fallback: string) {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

function asNumber(value: number | null | undefined, fallback = 0) {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asStringArray(value: string[] | null | undefined) {
  return asList(value).filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function asImageUrl(images: SpotifyImage[] | null | undefined) {
  const firstValidImage = asList(images).find(
    (image) => typeof image?.url === "string" && image.url.trim().length > 0,
  );

  return firstValidImage?.url ?? null;
}

function asSpotifyUrl(externalUrls: { spotify?: string | null } | null | undefined) {
  return asString(externalUrls?.spotify, "https://open.spotify.com/");
}

function buildDashboardData(
  me: SpotifyUser,
  topArtists: SpotifyListResponse<SpotifyArtist>,
  topTracks: SpotifyListResponse<SpotifyTrack>,
): DashboardData {
  const artists = asList(topArtists.items).map((artist, index) => ({
    id: asString(artist.id, `artist-${index + 1}`),
    rank: index + 1,
    name: asString(artist.name, "Artista sem nome"),
    imageUrl: asImageUrl(artist.images),
    genres: asStringArray(artist.genres),
    followers: asNumber(artist.followers?.total),
    popularity: asNumber(artist.popularity),
    spotifyUrl: asSpotifyUrl(artist.external_urls),
  }));

  const tracks = asList(topTracks.items).map((track, index) => ({
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

  const favoriteGenresMap = new Map<string, number>();

  for (const artist of artists) {
    for (const genre of artist.genres) {
      favoriteGenresMap.set(genre, (favoriteGenresMap.get(genre) ?? 0) + 1);
    }
  }

  const favoriteGenres = [...favoriteGenresMap.entries()]
    .sort((left, right) => right[1] - left[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }));

  const trackPopularityAverage =
    tracks.length > 0
      ? Math.round(tracks.reduce((total, track) => total + track.popularity, 0) / tracks.length)
      : 0;

  const artistPopularityAverage =
    artists.length > 0
      ? Math.round(artists.reduce((total, artist) => total + artist.popularity, 0) / artists.length)
      : 0;

  const totalArtistReach = artists.reduce((total, artist) => total + artist.followers, 0);

  const averageTrackDuration =
    tracks.length > 0
      ? Math.round(tracks.reduce((total, track) => total + track.durationMs, 0) / tracks.length)
      : 0;

  return {
    profile: {
      name: asString(me.display_name, "Visitante"),
      avatarUrl: asImageUrl(me.images),
      followers: asNumber(me.followers?.total),
      country: asString(me.country, "BR"),
      plan: asString(me.product, "free"),
      spotifyUrl: asSpotifyUrl(me.external_urls),
    },
    stats: {
      dominantGenre: favoriteGenres[0]?.name ?? "ecletico",
      genreCount: favoriteGenresMap.size,
      trackPopularity: trackPopularityAverage,
      artistPopularity: artistPopularityAverage,
      totalArtistReach,
      averageTrackDuration,
    },
    highlights: {
      topArtist: artists[0]
        ? {
            name: artists[0].name,
            imageUrl: artists[0].imageUrl,
            followers: artists[0].followers,
            genres: artists[0].genres,
          }
        : null,
      topTrack: tracks[0]
        ? {
            name: tracks[0].name,
            imageUrl: tracks[0].imageUrl,
            artistName: tracks[0].artistNames,
            album: tracks[0].album,
            popularity: tracks[0].popularity,
            durationMs: tracks[0].durationMs,
          }
        : null,
    },
    favoriteGenres,
    artists,
    tracks,
  };
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("sp_access_token")?.value;

  if (!token) {
    redirect("/");
  }

  const [me, topArtists, topTracks] = await Promise.all([
    spotifyFetch<SpotifyUser>("/me", token),
    spotifyFetch<SpotifyListResponse<SpotifyArtist>>("/me/top/artists?time_range=short_term&limit=10", token),
    spotifyFetch<SpotifyListResponse<SpotifyTrack>>("/me/top/tracks?time_range=short_term&limit=10", token),
  ]);

  const data = buildDashboardData(me, topArtists, topTracks);

  return <DashboardClient data={data} />;
}
