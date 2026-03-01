import type { DashboardArtist, DashboardData, DashboardTrack, TimeRange } from "@/lib/spotify-schema";

export type ModuleKey = "overview" | "now" | "top" | "dna" | "playlists" | "recommendations" | "discovery";

export type ModuleStateStatus = "idle" | "loading" | "ready" | "error";

export type ModuleState<T> = {
  status: ModuleStateStatus;
  data: T | null;
  error: string | null;
};

export type OverviewData = {
  fetchedAt: string;
  profile: DashboardData["profile"];
  devices: Array<{
    id: string;
    name: string;
    type: string;
    isActive: boolean;
    isRestricted: boolean;
    supportsVolume: boolean;
    volumePercent: number;
  }>;
  player: {
    hasActiveSession: boolean;
    deviceName: string | null;
    isPlaying: boolean;
    repeatState: string;
    shuffleState: boolean;
    progressMs: number | null;
  };
};

export type ModuleTrack = Omit<DashboardTrack, "rank"> & {
  previewUrl: string | null;
};

export type NowData = {
  fetchedAt: string;
  current: {
    track: ModuleTrack | null;
    isPlaying: boolean;
    progressMs: number | null;
    repeatState: string;
    shuffleState: boolean;
    deviceName: string | null;
    volumePercent: number | null;
    playingType: string;
  } | null;
  player: {
    isPlaying: boolean;
    deviceName: string | null;
    volumePercent: number | null;
    repeatState: string;
    shuffleState: boolean;
    progressMs: number | null;
  };
  recent: Array<{
    playedAt: string | null;
    track: ModuleTrack;
  }>;
};

export type TopData = {
  fetchedAt: string;
  range: TimeRange;
  limit: number;
  artists: DashboardArtist[];
  tracks: DashboardTrack[];
};
