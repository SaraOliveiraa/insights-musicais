export type DashboardData = {
  profile: {
    name: string;
    avatarUrl: string | null;
    followers: number;
    country: string;
    plan: string;
    spotifyUrl: string;
  };
  stats: {
    dominantGenre: string;
    genreCount: number;
    averageTrackDuration: number;
  };
  highlights: {
    topArtist: {
      name: string;
      imageUrl: string | null;
      followers: number;
      genres: string[];
    } | null;
    topTrack: {
      name: string;
      imageUrl: string | null;
      artistName: string;
      album: string;
      popularity: number;
      durationMs: number;
    } | null;
  };
  favoriteGenres: Array<{
    name: string;
    count: number;
  }>;
  artists: Array<{
    id: string;
    rank: number;
    name: string;
    imageUrl: string | null;
    genres: string[];
    followers: number;
    popularity: number;
    spotifyUrl: string;
  }>;
  tracks: Array<{
    id: string;
    rank: number;
    name: string;
    artistNames: string;
    imageUrl: string | null;
    album: string;
    popularity: number;
    durationMs: number;
    spotifyUrl: string;
  }>;
};
