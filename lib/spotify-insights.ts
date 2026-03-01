import {
  TIME_RANGE_CONFIG,
  TIME_RANGES,
  type DashboardArtist,
  type DashboardData,
  type DashboardTrack,
  type GenreMetric,
  type GenreTrend,
  type ShareSnapshot,
  type TimeRange,
} from "@/lib/spotify-schema";

type DashboardProfile = DashboardData["profile"];

type DashboardPeriodsInput = Record<
  TimeRange,
  {
    artists: DashboardArtist[];
    tracks: DashboardTrack[];
  }
>;

function round(value: number) {
  return Math.round(value);
}

function safeAverage(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return round(values.reduce((total, value) => total + value, 0) / values.length);
}

function calculateNormalizedEntropy(counts: number[]) {
  const total = counts.reduce((sum, count) => sum + count, 0);

  if (counts.length <= 1 || total === 0) {
    return 0;
  }

  const entropy = counts.reduce((sum, count) => {
    const probability = count / total;
    return sum - probability * Math.log(probability);
  }, 0);

  const maxEntropy = Math.log(counts.length);

  if (maxEntropy === 0) {
    return 0;
  }

  return round((entropy / maxEntropy) * 100);
}

function buildGenreMetrics(artists: DashboardArtist[]) {
  const genreMap = new Map<string, { count: number; artists: Set<string> }>();

  for (const artist of artists) {
    for (const genre of artist.genres) {
      const current = genreMap.get(genre) ?? { count: 0, artists: new Set<string>() };
      current.count += 1;
      current.artists.add(artist.name);
      genreMap.set(genre, current);
    }
  }

  const totalMentions = [...genreMap.values()].reduce((sum, item) => sum + item.count, 0);

  const metrics = [...genreMap.entries()]
    .sort((left, right) => right[1].count - left[1].count || left[0].localeCompare(right[0]))
    .map<GenreMetric>(([name, value]) => ({
      name,
      count: value.count,
      share: totalMentions > 0 ? round((value.count / totalMentions) * 100) : 0,
      artists: [...value.artists].slice(0, 4),
    }));

  return {
    metrics,
    totalMentions,
  };
}

function getReferenceRange(selectedRange: TimeRange): TimeRange {
  if (selectedRange === "short_term") {
    return "medium_term";
  }

  if (selectedRange === "medium_term") {
    return "long_term";
  }

  return "medium_term";
}

function getTrendDirection(delta: number, previousRank: number | null) {
  if (previousRank === null) {
    return "new" as const;
  }

  if (delta > 0) {
    return "up" as const;
  }

  if (delta < 0) {
    return "down" as const;
  }

  return "steady" as const;
}

function buildRankTrends(
  currentItems: DashboardArtist[] | DashboardTrack[],
  previousItems: DashboardArtist[] | DashboardTrack[],
  contextResolver: (item: DashboardArtist | DashboardTrack) => string,
) {
  const previousRanks = new Map(previousItems.map((item) => [item.id, item.rank]));

  return currentItems
    .map((item) => {
      const previousRank = previousRanks.get(item.id) ?? null;
      const delta = previousRank === null ? 0 : previousRank - item.rank;

      return {
        id: item.id,
        name: item.name,
        imageUrl: item.imageUrl,
        context: contextResolver(item),
        currentRank: item.rank,
        previousRank,
        delta,
        direction: getTrendDirection(delta, previousRank),
        spotifyUrl: item.spotifyUrl,
      };
    })
    .sort((left, right) => {
      const directionScore = (value: { direction: string; delta: number }) => {
        if (value.direction === "new") return 3;
        if (value.direction === "up") return 2;
        if (value.direction === "steady") return 1;
        return 0;
      };

      return (
        directionScore(right) - directionScore(left) ||
        Math.abs(right.delta) - Math.abs(left.delta) ||
        left.currentRank - right.currentRank
      );
    })
    .slice(0, 5);
}

function buildGenreTrends(currentGenres: GenreMetric[], previousGenres: GenreMetric[]) {
  const previousMap = new Map(previousGenres.map((genre) => [genre.name, genre]));
  const mergedNames = new Set([...currentGenres.map((genre) => genre.name), ...previousGenres.map((genre) => genre.name)]);

  return [...mergedNames]
    .map<GenreTrend>((name) => {
      const current = currentGenres.find((genre) => genre.name === name);
      const previous = previousMap.get(name);
      const delta = (current?.count ?? 0) - (previous?.count ?? 0);

      return {
        name,
        currentCount: current?.count ?? 0,
        previousCount: previous?.count ?? 0,
        delta,
        direction:
          previous === undefined ? "new" : delta > 0 ? "up" : delta < 0 ? "down" : "steady",
        share: current?.share ?? 0,
        artists: current?.artists ?? previous?.artists ?? [],
      };
    })
    .sort((left, right) => Math.abs(right.delta) - Math.abs(left.delta) || right.currentCount - left.currentCount)
    .slice(0, 5);
}

function buildPeriodSummary(artists: DashboardArtist[], tracks: DashboardTrack[]) {
  const { metrics } = buildGenreMetrics(artists);

  return {
    dominantArtist: artists[0]?.name ?? "Sem destaque",
    dominantGenre: metrics[0]?.name ?? "ecletico",
    averageTrackDuration: safeAverage(tracks.map((track) => track.durationMs)),
    averageTrackPopularity: safeAverage(tracks.map((track) => track.popularity)),
    averageArtistPopularity: safeAverage(artists.map((artist) => artist.popularity)),
  };
}

function buildAggregateArtistShare(periods: DashboardPeriodsInput) {
  const scores = new Map<string, { score: number; name: string }>();
  const weights = [1.2, 1, 0.85] as const;

  TIME_RANGES.forEach((range, rangeIndex) => {
    periods[range].artists.forEach((artist, index) => {
      const current = scores.get(artist.id) ?? { score: 0, name: artist.name };
      current.score += (1 / (index + 1)) * weights[rangeIndex];
      scores.set(artist.id, current);
    });
  });

  const rankedScores = [...scores.values()].sort((left, right) => right.score - left.score);
  const totalScore = rankedScores.reduce((sum, item) => sum + item.score, 0);
  const dominant = rankedScores[0];

  return {
    dominantArtist: dominant?.name ?? "Sem destaque",
    dominantArtistShare: dominant && totalScore > 0 ? round((dominant.score / totalScore) * 100) : 0,
  };
}

function buildIdentityCard(
  profile: DashboardProfile,
  selectedRange: TimeRange,
  dominantGenre: string,
  varietyScore: number,
  concentrationScore: number,
  dominantArtist: string,
  averageTrackPopularity: number,
) {
  const rangeLabel = TIME_RANGE_CONFIG[selectedRange].label;
  const listeningStyle = varietyScore >= 70 ? "versatil" : varietyScore >= 45 ? "equilibrada" : "focada";
  const concentrationLabel =
    concentrationScore >= 35 ? "alta concentracao" : concentrationScore >= 20 ? "concentracao moderada" : "escuta aberta";

  return {
    title: `${dominantGenre} no centro da sua identidade musical`,
    summary: `${profile.name} mostra uma escuta ${listeningStyle} em ${rangeLabel.toLowerCase()}, com ${concentrationLabel} em ${dominantGenre} e ${dominantArtist} como nome mais dominante na comparacao entre periodos. A popularidade media das faixas ficou em ${averageTrackPopularity}/100.`,
    badges: [rangeLabel, `${varietyScore}% variedade`, `${averageTrackPopularity}/100 pop media`],
  };
}

export function isTimeRange(value: string): value is TimeRange {
  return TIME_RANGES.includes(value as TimeRange);
}

export function parseTimeRange(value: string | null | undefined): TimeRange {
  if (typeof value === "string" && isTimeRange(value)) {
    return value;
  }

  return "short_term";
}

export function buildDashboardData(
  profile: DashboardProfile,
  periods: DashboardPeriodsInput,
  selectedRange: TimeRange,
): DashboardData {
  const selectedPeriod = periods[selectedRange];
  const referenceRange = getReferenceRange(selectedRange);
  const referencePeriod = periods[referenceRange];

  const { metrics: favoriteGenres, totalMentions } = buildGenreMetrics(selectedPeriod.artists);
  const referenceGenreMetrics = buildGenreMetrics(referencePeriod.artists).metrics;
  const dominantGenre = favoriteGenres[0]?.name ?? "ecletico";
  const averageTrackDuration = safeAverage(selectedPeriod.tracks.map((track) => track.durationMs));
  const averageTrackPopularity = safeAverage(selectedPeriod.tracks.map((track) => track.popularity));
  const averageArtistPopularity = safeAverage(selectedPeriod.artists.map((artist) => artist.popularity));
  const varietyScore = calculateNormalizedEntropy(favoriteGenres.map((genre) => genre.count));
  const concentrationScore = totalMentions > 0 ? round(((favoriteGenres[0]?.count ?? 0) / totalMentions) * 100) : 0;
  const aggregateArtistData = buildAggregateArtistShare(periods);

  const periodsWithSummary = TIME_RANGES.reduce<DashboardData["periods"]>((accumulator, range) => {
    accumulator[range] = {
      key: range,
      label: TIME_RANGE_CONFIG[range].label,
      description: TIME_RANGE_CONFIG[range].description,
      artists: periods[range].artists,
      tracks: periods[range].tracks,
      summary: buildPeriodSummary(periods[range].artists, periods[range].tracks),
    };
    return accumulator;
  }, {} as DashboardData["periods"]);

  const genreClusters = favoriteGenres.slice(0, 6).map((genre) => ({
    name: genre.name,
    artistCount: genre.artists.length,
    share: genre.share,
    artists: genre.artists,
  }));

  const trends = {
    referenceRange,
    referenceLabel: TIME_RANGE_CONFIG[referenceRange].label,
    summary: `Comparacao entre ${TIME_RANGE_CONFIG[selectedRange].label.toLowerCase()} e ${TIME_RANGE_CONFIG[referenceRange].label.toLowerCase()} para indicar o que subiu, caiu ou entrou agora no seu radar.`,
    artists: buildRankTrends(selectedPeriod.artists, referencePeriod.artists, (item) =>
      "genres" in item ? item.genres.slice(0, 2).join(" / ") || "Sem genero dominante" : "",
    ),
    tracks: buildRankTrends(selectedPeriod.tracks, referencePeriod.tracks, (item) =>
      "artistNames" in item ? item.artistNames : "",
    ),
    genres: buildGenreTrends(favoriteGenres, referenceGenreMetrics),
  };

  return {
    generatedAt: new Date().toISOString(),
    selectedRange,
    ranges: TIME_RANGES.map((range) => ({
      key: range,
      label: TIME_RANGE_CONFIG[range].label,
      description: TIME_RANGE_CONFIG[range].description,
      href: `/dashboard?range=${range}`,
      isActive: range === selectedRange,
    })),
    profile,
    identityCard: buildIdentityCard(
      profile,
      selectedRange,
      dominantGenre,
      varietyScore,
      concentrationScore,
      aggregateArtistData.dominantArtist,
      averageTrackPopularity,
    ),
    stats: {
      dominantArtist: aggregateArtistData.dominantArtist,
      dominantArtistShare: aggregateArtistData.dominantArtistShare,
      dominantGenre,
      genreCount: favoriteGenres.length,
      averageTrackDuration,
      averageTrackPopularity,
      averageArtistPopularity,
      varietyScore,
      concentrationScore,
    },
    highlights: {
      topArtist: selectedPeriod.artists[0]
        ? {
            name: selectedPeriod.artists[0].name,
            imageUrl: selectedPeriod.artists[0].imageUrl,
            followers: selectedPeriod.artists[0].followers,
            genres: selectedPeriod.artists[0].genres,
            popularity: selectedPeriod.artists[0].popularity,
            spotifyUrl: selectedPeriod.artists[0].spotifyUrl,
          }
        : null,
      topTrack: selectedPeriod.tracks[0]
        ? {
            name: selectedPeriod.tracks[0].name,
            imageUrl: selectedPeriod.tracks[0].imageUrl,
            artistName: selectedPeriod.tracks[0].artistNames,
            album: selectedPeriod.tracks[0].album,
            popularity: selectedPeriod.tracks[0].popularity,
            durationMs: selectedPeriod.tracks[0].durationMs,
            spotifyUrl: selectedPeriod.tracks[0].spotifyUrl,
          }
        : null,
    },
    favoriteGenres: favoriteGenres.slice(0, 8),
    genreClusters,
    trends,
    periods: periodsWithSummary,
    artists: selectedPeriod.artists,
    tracks: selectedPeriod.tracks,
    report: {
      apiUrl: `/api/report?range=${selectedRange}`,
      shareUrl: null,
      canShare: false,
    },
  };
}

export function toShareSnapshot(data: DashboardData): ShareSnapshot {
  return {
    version: 1,
    generatedAt: data.generatedAt,
    selectedRange: data.selectedRange,
    rangeLabel: TIME_RANGE_CONFIG[data.selectedRange].label,
    profile: {
      name: data.profile.name,
      avatarUrl: data.profile.avatarUrl,
      country: data.profile.country,
      plan: data.profile.plan,
      spotifyUrl: data.profile.spotifyUrl,
    },
    identityCard: data.identityCard,
    stats: {
      dominantArtist: data.stats.dominantArtist,
      dominantArtistShare: data.stats.dominantArtistShare,
      dominantGenre: data.stats.dominantGenre,
      averageTrackPopularity: data.stats.averageTrackPopularity,
      varietyScore: data.stats.varietyScore,
      concentrationScore: data.stats.concentrationScore,
    },
    highlights: data.highlights,
    favoriteGenres: data.favoriteGenres.slice(0, 6),
    genreClusters: data.genreClusters.slice(0, 6),
    trends: {
      ...data.trends,
      artists: data.trends.artists.slice(0, 3),
      tracks: data.trends.tracks.slice(0, 3),
      genres: data.trends.genres.slice(0, 3),
    },
    topArtists: data.artists.slice(0, 3),
    topTracks: data.tracks.slice(0, 3),
  };
}
