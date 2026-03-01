export const TIME_RANGE_CONFIG = {
  short_term: {
    label: "Ultimos 30 dias",
    description: "O que esta mais quente na sua escuta recente.",
  },
  medium_term: {
    label: "Ultimos 6 meses",
    description: "O recorte que mostra padroes mais estaveis.",
  },
  long_term: {
    label: "Todo o historico",
    description: "A base mais ampla para comparar tendencias.",
  },
} as const;

export const TIME_RANGES = Object.keys(TIME_RANGE_CONFIG) as Array<keyof typeof TIME_RANGE_CONFIG>;

export type TimeRange = keyof typeof TIME_RANGE_CONFIG;

export type TrendDirection = "up" | "down" | "steady" | "new";

export type DashboardArtist = {
  id: string;
  rank: number;
  name: string;
  imageUrl: string | null;
  genres: string[];
  followers: number;
  popularity: number;
  spotifyUrl: string;
};

export type DashboardTrack = {
  id: string;
  rank: number;
  name: string;
  artistNames: string;
  imageUrl: string | null;
  album: string;
  popularity: number;
  durationMs: number;
  spotifyUrl: string;
};

export type GenreMetric = {
  name: string;
  count: number;
  share: number;
  artists: string[];
};

export type RankTrend = {
  id: string;
  name: string;
  imageUrl: string | null;
  context: string;
  currentRank: number;
  previousRank: number | null;
  delta: number;
  direction: TrendDirection;
  spotifyUrl: string;
};

export type GenreTrend = {
  name: string;
  currentCount: number;
  previousCount: number;
  delta: number;
  direction: TrendDirection;
  share: number;
  artists: string[];
};

export type PeriodSnapshot = {
  key: TimeRange;
  label: string;
  description: string;
  artists: DashboardArtist[];
  tracks: DashboardTrack[];
  summary: {
    dominantArtist: string;
    dominantGenre: string;
    averageTrackDuration: number;
    averageTrackPopularity: number;
    averageArtistPopularity: number;
  };
};

export type DashboardData = {
  generatedAt: string;
  selectedRange: TimeRange;
  ranges: Array<{
    key: TimeRange;
    label: string;
    description: string;
    href: string;
    isActive: boolean;
  }>;
  profile: {
    name: string;
    email: string | null;
    avatarUrl: string | null;
    followers: number;
    country: string;
    plan: string;
    spotifyUrl: string;
  };
  identityCard: {
    title: string;
    summary: string;
    badges: string[];
  };
  stats: {
    dominantArtist: string;
    dominantArtistShare: number;
    dominantGenre: string;
    genreCount: number;
    averageTrackDuration: number;
    averageTrackPopularity: number;
    averageArtistPopularity: number;
    varietyScore: number;
    concentrationScore: number;
  };
  highlights: {
    topArtist: {
      name: string;
      imageUrl: string | null;
      followers: number;
      genres: string[];
      popularity: number;
      spotifyUrl: string;
    } | null;
    topTrack: {
      name: string;
      imageUrl: string | null;
      artistName: string;
      album: string;
      popularity: number;
      durationMs: number;
      spotifyUrl: string;
    } | null;
  };
  favoriteGenres: GenreMetric[];
  genreClusters: Array<{
    name: string;
    artistCount: number;
    share: number;
    artists: string[];
  }>;
  trends: {
    referenceRange: TimeRange;
    referenceLabel: string;
    summary: string;
    artists: RankTrend[];
    tracks: RankTrend[];
    genres: GenreTrend[];
  };
  periods: Record<TimeRange, PeriodSnapshot>;
  artists: DashboardArtist[];
  tracks: DashboardTrack[];
  report: {
    apiUrl: string;
    shareUrl: string | null;
    canShare: boolean;
  };
};

export type ShareSnapshot = {
  version: 1;
  generatedAt: string;
  selectedRange: TimeRange;
  rangeLabel: string;
  profile: Pick<DashboardData["profile"], "name" | "avatarUrl" | "country" | "plan" | "spotifyUrl">;
  identityCard: DashboardData["identityCard"];
  stats: Pick<
    DashboardData["stats"],
    | "dominantArtist"
    | "dominantArtistShare"
    | "dominantGenre"
    | "averageTrackPopularity"
    | "varietyScore"
    | "concentrationScore"
  >;
  highlights: DashboardData["highlights"];
  favoriteGenres: DashboardData["favoriteGenres"];
  genreClusters: DashboardData["genreClusters"];
  trends: DashboardData["trends"];
  topArtists: DashboardArtist[];
  topTracks: DashboardTrack[];
};
