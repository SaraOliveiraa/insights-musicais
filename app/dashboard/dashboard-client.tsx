"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { DashboardData } from "./types";

type DashboardClientProps = {
  data: DashboardData;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08,
    },
  },
};

const smoothEase = [0.22, 1, 0.36, 1] as const;

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: smoothEase,
    },
  },
};

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

function formatDuration(durationMs: number) {
  const totalMinutes = Math.round(durationMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes} min`;
  }

  return `${hours}h ${minutes.toString().padStart(2, "0")}min`;
}

function capitalize(value: string) {
  if (!value) return value;
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function SpotifyArtwork({
  src,
  alt,
  fallback,
  className,
  height = 120,
  sizes,
  width = 120,
}: {
  src: string | null;
  alt: string;
  fallback: string;
  className?: string;
  height?: number;
  sizes?: string;
  width?: number;
}) {
  if (!src) {
    return (
      <div
        className={`flex items-center justify-center rounded-[22px] border border-white/10 bg-white/5 text-sm font-semibold uppercase tracking-[0.3em] text-white/55 ${className ?? ""}`}
      >
        {fallback}
      </div>
    );
  }

  return (
    <Image
      alt={alt}
      className={`rounded-[22px] object-cover ${className ?? ""}`}
      height={height}
      sizes={sizes}
      src={src}
      width={width}
    />
  );
}

function StatCard({
  label,
  value,
  hint,
  accent,
  reducedMotion,
}: {
  label: string;
  value: string;
  hint: string;
  accent: string;
  reducedMotion: boolean;
}) {
  return (
    <motion.article
      className="glass-card group relative overflow-hidden p-5"
      style={{ transformPerspective: 1400 }}
      transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 280, damping: 20 }}
      whileHover={reducedMotion ? undefined : { y: -10, scale: 1.02, rotateX: 3 }}
    >
      <div className={`absolute inset-x-0 top-0 h-1 ${accent}`} />
      <p className="text-xs uppercase tracking-[0.28em] text-white/45">{label}</p>
      <p className="mt-5 font-display text-3xl tracking-[-0.06em] text-white">{value}</p>
      <p className="mt-2 text-sm text-white/58">{hint}</p>
    </motion.article>
  );
}

function RankedArtistCard({
  artist,
  reducedMotion,
}: {
  artist: DashboardData["artists"][number];
  reducedMotion: boolean;
}) {
  return (
    <motion.a
      className="group flex items-center gap-4 rounded-[24px] border border-white/8 bg-white/[0.03] p-4 transition-colors hover:border-emerald-300/30 hover:bg-white/[0.05]"
      href={artist.spotifyUrl}
      rel="noreferrer"
      style={{ transformPerspective: 1400 }}
      target="_blank"
      transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 20 }}
      whileHover={reducedMotion ? undefined : { x: 8, scale: 1.012, rotateX: 2.5 }}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/8 font-display text-sm text-white/75">
        {artist.rank.toString().padStart(2, "0")}
      </div>
      <SpotifyArtwork
        alt={artist.name}
        className="h-16 w-16 shrink-0"
        fallback={artist.name.slice(0, 2)}
        sizes="64px"
        src={artist.imageUrl}
        height={64}
        width={64}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-base font-semibold text-white">{artist.name}</p>
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-white/45">
            {artist.popularity}/100
          </span>
        </div>
        <p className="mt-1 truncate text-sm text-white/55">
          {artist.genres.slice(0, 2).join(" / ") || "Sem genero dominante"}
        </p>
      </div>
      <p className="hidden text-right text-sm text-white/48 sm:block">
        {formatCompactNumber(artist.followers)}
        <span className="block text-[11px] uppercase tracking-[0.24em]">seguidores</span>
      </p>
    </motion.a>
  );
}

function RankedTrackCard({
  track,
  reducedMotion,
}: {
  track: DashboardData["tracks"][number];
  reducedMotion: boolean;
}) {
  return (
    <motion.a
      className="group flex items-center gap-4 rounded-[24px] border border-white/8 bg-white/[0.03] p-4 transition-colors hover:border-orange-200/30 hover:bg-white/[0.05]"
      href={track.spotifyUrl}
      rel="noreferrer"
      style={{ transformPerspective: 1400 }}
      target="_blank"
      transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 20 }}
      whileHover={reducedMotion ? undefined : { x: 8, scale: 1.012, rotateX: 2.5 }}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/8 font-display text-sm text-white/75">
        {track.rank.toString().padStart(2, "0")}
      </div>
      <SpotifyArtwork
        alt={track.name}
        className="h-16 w-16 shrink-0"
        fallback={track.name.slice(0, 2)}
        sizes="64px"
        src={track.imageUrl}
        height={64}
        width={64}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-base font-semibold text-white">{track.name}</p>
        <p className="mt-1 truncate text-sm text-white/55">{track.artistNames}</p>
      </div>
      <div className="hidden text-right text-sm text-white/48 sm:block">
        <span>{formatDuration(track.durationMs)}</span>
        <span className="block text-[11px] uppercase tracking-[0.24em]">{track.popularity}/100</span>
      </div>
    </motion.a>
  );
}

export default function DashboardClient({ data }: DashboardClientProps) {
  const reducedMotion = useReducedMotion() ?? false;
  const heroMessage = data.highlights.topArtist
    ? `${data.profile.name}, ${data.highlights.topArtist.name} lidera sua fase atual.`
    : `${data.profile.name}, seu perfil musical esta pronto para ser explorado.`;

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-5 sm:px-6 lg:px-8">
      <motion.div
        animate="visible"
        className="mx-auto flex w-full max-w-7xl flex-col gap-6 pb-10"
        initial="hidden"
        variants={containerVariants}
      >
        <motion.header
          className="glass-card relative overflow-hidden p-6 sm:p-8"
          style={{ transformPerspective: 1400 }}
          transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 22 }}
          variants={itemVariants}
          whileHover={reducedMotion ? undefined : { y: -8, scale: 1.006, rotateX: 2.5, rotateY: -1.5 }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(124,252,203,0.16),_transparent_32%),radial-gradient(circle_at_left_center,_rgba(251,191,36,0.14),_transparent_26%)]" />
          <div className="relative flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-3">
                <span className="hero-chip">Seu Spotify</span>
                <span className="hero-chip hero-chip--warm">Ultimos 30 dias</span>
              </div>
              <h1 className="mt-6 font-display text-4xl tracking-[-0.08em] text-white sm:text-5xl lg:text-6xl">
                Seu momento musical em uma unica tela.
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
                {heroMessage} Veja os destaques que mais marcaram sua escuta recente e navegue pelos artistas, faixas e generos que definem sua rotina.
              </p>

              <div className="mt-8 flex flex-wrap gap-3 text-sm text-white/70">
                <span className="hero-chip">{capitalize(data.profile.plan)} plan</span>
                <span className="hero-chip">Mercado {data.profile.country}</span>
                <span className="hero-chip">{formatNumber(data.favoriteGenres.length)} generos mapeados</span>
              </div>
            </div>

            <div className="subtle-panel flex flex-col gap-4 rounded-[30px] p-5 sm:min-w-[320px]">
              <div className="flex items-center gap-4">
                <SpotifyArtwork
                  alt={data.profile.name}
                  className="h-20 w-20 shrink-0"
                  fallback={data.profile.name.slice(0, 2)}
                  sizes="80px"
                  src={data.profile.avatarUrl}
                  height={80}
                  width={80}
                />
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-white/45">Perfil conectado</p>
                  <h2 className="mt-2 font-display text-2xl tracking-[-0.06em] text-white">{data.profile.name}</h2>
                  <p className="mt-1 text-sm text-white/58">
                    {formatNumber(data.profile.followers)} seguidores no Spotify
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm text-white/60">
                <div className="subtle-panel rounded-[22px] p-4">
                  <span className="block text-[10px] uppercase tracking-[0.28em] text-white/42">Genero dominante</span>
                  <strong className="mt-2 block text-base font-semibold text-white">{data.stats.dominantGenre}</strong>
                </div>
                <div className="subtle-panel rounded-[22px] p-4">
                  <span className="block text-[10px] uppercase tracking-[0.28em] text-white/42">Duracao media</span>
                  <strong className="mt-2 block text-base font-semibold text-white">
                    {formatDuration(data.stats.averageTrackDuration)}
                  </strong>
                </div>
              </div>

              <a
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-100"
                href="/api/auth/logout"
              >
                Desconectar
              </a>
              <a
                className="text-center text-sm text-white/58 transition hover:text-white"
                href={data.profile.spotifyUrl}
                rel="noreferrer"
                target="_blank"
              >
                Abrir perfil no Spotify
              </a>
            </div>
          </div>
        </motion.header>

        <motion.section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4" variants={itemVariants}>
          <StatCard
            accent="bg-emerald-300/80"
            hint="Media de popularidade das faixas mais ouvidas."
            label="Popularidade das faixas"
            reducedMotion={reducedMotion}
            value={`${data.stats.trackPopularity}/100`}
          />
          <StatCard
            accent="bg-cyan-300/80"
            hint="Quanto seus artistas favoritos performam no catalogo."
            label="Forca dos artistas"
            reducedMotion={reducedMotion}
            value={`${data.stats.artistPopularity}/100`}
          />
          <StatCard
            accent="bg-orange-300/80"
            hint="Soma da audiencia potencial dos seus artistas do momento."
            label="Alcance agregado"
            reducedMotion={reducedMotion}
            value={formatCompactNumber(data.stats.totalArtistReach)}
          />
          <StatCard
            accent="bg-fuchsia-300/80"
            hint="Quantidade de frentes esteticas presentes na sua rotacao."
            label="Variedade de generos"
            reducedMotion={reducedMotion}
            value={formatNumber(data.stats.genreCount)}
          />
        </motion.section>

        <div className="grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
          <motion.section
            className="glass-card p-6 sm:p-7"
            style={{ transformPerspective: 1400 }}
            transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 22 }}
            variants={itemVariants}
            whileHover={reducedMotion ? undefined : { y: -8, scale: 1.008, rotateX: 2.5 }}
          >
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">Top artistas</p>
                <h3 className="mt-3 font-display text-3xl tracking-[-0.06em] text-white">Quem esta guiando sua escuta</h3>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/48">
                {data.artists.length} artistas
              </span>
            </div>

            <div className="mt-6 space-y-3">
              {data.artists.map((artist) => (
                <RankedArtistCard artist={artist} key={artist.id} reducedMotion={reducedMotion} />
              ))}
            </div>
          </motion.section>

          <motion.aside className="space-y-6" variants={itemVariants}>
            <motion.section
              className="glass-card p-6"
              style={{ transformPerspective: 1400 }}
              transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 240, damping: 22 }}
              whileHover={reducedMotion ? undefined : { y: -8, scale: 1.01, rotateX: 2.5 }}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">Visao geral</p>
              <h3 className="mt-3 font-display text-3xl tracking-[-0.06em] text-white">Seu mapa musical</h3>
              <p className="mt-3 text-sm leading-7 text-white/60">
                Aqui voce enxerga os generos que mais aparecem no seu replay recente. Isso ajuda a perceber se sua fase esta mais focada, diversa ou mudando ao longo do tempo.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                {data.favoriteGenres.map((genre) => (
                  <span
                    className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/72"
                    key={genre.name}
                  >
                    {genre.name}
                    <span className="ml-2 text-white/38">{genre.count}</span>
                  </span>
                ))}
              </div>
            </motion.section>

            <motion.section
              className="glass-card overflow-hidden p-6"
              style={{ transformPerspective: 1400 }}
              transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 240, damping: 22 }}
              whileHover={reducedMotion ? undefined : { y: -8, scale: 1.01, rotateX: 2.5 }}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">Artista em destaque</p>
              {data.highlights.topArtist ? (
                <div className="mt-5 space-y-5">
                  <div className="flex items-center gap-4">
                    <SpotifyArtwork
                      alt={data.highlights.topArtist.name}
                      className="h-24 w-24 shrink-0"
                      fallback={data.highlights.topArtist.name.slice(0, 2)}
                      sizes="96px"
                      src={data.highlights.topArtist.imageUrl}
                      height={96}
                      width={96}
                    />
                    <div>
                      <h3 className="font-display text-3xl tracking-[-0.06em] text-white">
                        {data.highlights.topArtist.name}
                      </h3>
                      <p className="mt-2 text-sm text-white/58">
                        {formatCompactNumber(data.highlights.topArtist.followers)} seguidores e forte presenca no seu replay.
                      </p>
                    </div>
                  </div>

                  <div className="subtle-panel rounded-[26px] p-4">
                    <p className="text-xs uppercase tracking-[0.28em] text-white/42">Leituras de genero</p>
                    <p className="mt-3 text-sm leading-7 text-white/62">
                      {data.highlights.topArtist.genres.slice(0, 3).join(" / ") || "Artista transversal com apelo multiplataforma"}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm text-white/58">Ainda nao ha dados suficientes para destacar um artista.</p>
              )}
            </motion.section>
          </motion.aside>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.35fr]">
          <motion.section
            className="glass-card p-6 sm:p-7"
            style={{ transformPerspective: 1400 }}
            transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 22 }}
            variants={itemVariants}
            whileHover={reducedMotion ? undefined : { y: -8, scale: 1.008, rotateX: 2.5 }}
          >
            <p className="text-xs uppercase tracking-[0.3em] text-white/45">Faixa do momento</p>
            <h3 className="mt-3 font-display text-3xl tracking-[-0.06em] text-white">A musica que mais representa sua fase atual</h3>

            {data.highlights.topTrack ? (
              <div className="mt-6">
                <SpotifyArtwork
                  alt={data.highlights.topTrack.name}
                  className="h-full w-full max-h-[320px]"
                  fallback={data.highlights.topTrack.name.slice(0, 2)}
                  sizes="(max-width: 1280px) 100vw, 32vw"
                  src={data.highlights.topTrack.imageUrl}
                  height={640}
                  width={640}
                />

                <div className="mt-5">
                  <h4 className="font-display text-3xl tracking-[-0.06em] text-white">{data.highlights.topTrack.name}</h4>
                  <p className="mt-2 text-sm text-white/60">
                    {data.highlights.topTrack.artistName} / {data.highlights.topTrack.album}
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3 text-sm text-white/60">
                  <div className="subtle-panel rounded-[22px] p-4">
                    <span className="block text-[10px] uppercase tracking-[0.28em] text-white/42">Popularidade</span>
                    <strong className="mt-2 block text-base font-semibold text-white">
                      {data.highlights.topTrack.popularity}/100
                    </strong>
                  </div>
                  <div className="subtle-panel rounded-[22px] p-4">
                    <span className="block text-[10px] uppercase tracking-[0.28em] text-white/42">Duracao</span>
                    <strong className="mt-2 block text-base font-semibold text-white">
                      {formatDuration(data.highlights.topTrack.durationMs)}
                    </strong>
                  </div>
                </div>
              </div>
            ) : (
              <p className="mt-4 text-sm text-white/58">Ainda nao ha dados suficientes para destacar uma faixa.</p>
            )}
          </motion.section>

          <motion.section
            className="glass-card p-6 sm:p-7"
            style={{ transformPerspective: 1400 }}
            transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 22 }}
            variants={itemVariants}
            whileHover={reducedMotion ? undefined : { y: -8, scale: 1.008, rotateX: 2.5 }}
          >
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/45">Top musicas</p>
                <h3 className="mt-3 font-display text-3xl tracking-[-0.06em] text-white">O que mais voltou para o replay</h3>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.22em] text-white/48">
                {data.tracks.length} faixas
              </span>
            </div>

            <div className="mt-6 space-y-3">
              {data.tracks.map((track) => (
                <RankedTrackCard key={track.id} reducedMotion={reducedMotion} track={track} />
              ))}
            </div>
          </motion.section>
        </div>
      </motion.div>
    </main>
  );
}
