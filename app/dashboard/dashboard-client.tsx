"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  ChevronDown,
  Clock3,
  Disc3,
  ExternalLink,
  Globe2,
  LayoutGrid,
  LogOut,
  Music2,
  Sparkles,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DashboardData } from "./types";

type DashboardClientProps = {
  data: DashboardData;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.04,
    },
  },
};

const smoothEase = [0.22, 1, 0.36, 1] as const;

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.42,
      ease: smoothEase,
    },
  },
};

const surfaceCardClass =
  "rounded-xl border-white/10 bg-[#0d1420]/88 shadow-[0_14px_34px_rgba(2,6,23,0.24)] backdrop-blur-sm";

const contentCardClass = `${surfaceCardClass} gap-0 overflow-hidden py-0`;
const subtlePanelClass = "rounded-lg border border-white/8 bg-white/[0.03]";

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
        className={`flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-sm font-semibold uppercase tracking-[0.24em] text-white/55 ${className ?? ""}`}
      >
        {fallback}
      </div>
    );
  }

  return (
    <Image
      alt={alt}
      className={`rounded-lg object-cover ${className ?? ""}`}
      height={height}
      sizes={sizes}
      src={src}
      width={width}
    />
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  hint,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <Card className={`${surfaceCardClass} min-h-[148px]`}>
      <CardContent className="space-y-4 px-5 py-5">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-[0.24em] text-white/42">{label}</span>
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-emerald-300">
            <Icon className="size-4" />
          </div>
        </div>
        <div>
          <p className="font-display text-3xl tracking-[-0.04em] text-white">{value}</p>
          <p className="mt-2 text-sm leading-6 text-white/56">{hint}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function ArtistRow({ artist }: { artist: DashboardData["artists"][number] }) {
  return (
    <a
      className={`${subtlePanelClass} flex items-center gap-4 p-4 transition hover:border-emerald-300/30 hover:bg-white/[0.05]`}
      href={artist.spotifyUrl}
      rel="noreferrer"
      target="_blank"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-sm text-white/72">
        {artist.rank.toString().padStart(2, "0")}
      </div>
      <SpotifyArtwork
        alt={artist.name}
        className="h-14 w-14 shrink-0"
        fallback={artist.name.slice(0, 2)}
        height={56}
        sizes="56px"
        src={artist.imageUrl}
        width={56}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{artist.name}</p>
        <p className="mt-1 truncate text-sm text-white/54">
          {artist.genres.slice(0, 2).join(" / ") || "Sem genero dominante"}
        </p>
      </div>
      <div className="hidden text-right text-xs text-white/44 md:block">
        <span className="block text-sm text-white/70">{formatNumber(artist.genres.length)}</span>
        generos
      </div>
    </a>
  );
}

function TrackRow({ track }: { track: DashboardData["tracks"][number] }) {
  return (
    <a
      className={`${subtlePanelClass} flex items-center gap-4 p-4 transition hover:border-cyan-300/30 hover:bg-white/[0.05]`}
      href={track.spotifyUrl}
      rel="noreferrer"
      target="_blank"
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-sm text-white/72">
        {track.rank.toString().padStart(2, "0")}
      </div>
      <SpotifyArtwork
        alt={track.name}
        className="h-14 w-14 shrink-0"
        fallback={track.name.slice(0, 2)}
        height={56}
        sizes="56px"
        src={track.imageUrl}
        width={56}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{track.name}</p>
        <p className="mt-1 truncate text-sm text-white/54">{track.artistNames}</p>
      </div>
      <div className="hidden text-right text-xs text-white/44 md:block">
        <span className="block text-sm text-white/70">{formatDuration(track.durationMs)}</span>
        duracao
      </div>
    </a>
  );
}

export default function DashboardClient({ data }: DashboardClientProps) {
  const dominantGenreCount = Math.max(...data.favoriteGenres.map((genre) => genre.count), 1);

  const openSpotifyProfile = () => {
    window.open(data.profile.spotifyUrl, "_blank", "noopener,noreferrer");
  };

  const logout = () => {
    window.location.assign("/api/auth/logout");
  };

  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <motion.div
        animate="visible"
        className="mx-auto flex max-w-7xl flex-col gap-4"
        initial="hidden"
        variants={containerVariants}
      >
        <div className="grid gap-4 xl:grid-cols-12">
          <motion.section className="xl:col-span-8" variants={itemVariants}>
            <Card className={`${surfaceCardClass} h-full`}>
              <CardHeader className="space-y-5">
                <div className="flex flex-wrap gap-2">
                  <Badge className="rounded-md border-white/10 bg-white/[0.03] text-white/70" variant="outline">
                    Seu Spotify
                  </Badge>
                  <Badge className="rounded-md border-white/10 bg-white/[0.03] text-white/70" variant="outline">
                    Ultimos 30 dias
                  </Badge>
                  <Badge className="rounded-md border-white/10 bg-white/[0.03] text-white/70" variant="outline">
                    {data.favoriteGenres.length} generos mapeados
                  </Badge>
                </div>
                <div className="space-y-3">
                  <CardTitle className="font-display text-4xl tracking-[-0.04em] text-white sm:text-5xl">
                    Seu momento musical, organizado em uma grade mais clara.
                  </CardTitle>
                  <CardDescription className="max-w-3xl text-base leading-8 text-white/64">
                    {data.highlights.topArtist
                      ? `${data.profile.name}, ${data.highlights.topArtist.name} lidera sua fase atual.`
                      : `${data.profile.name}, seus habitos de escuta ja estao prontos para explorar.`} Aqui voce acompanha artistas, faixas e sinais do seu replay sem depender de indicadores pouco confiaveis.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-3">
                <div className={`${subtlePanelClass} p-4`}>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/42">Genero dominante</p>
                  <p className="mt-3 text-lg font-medium text-white">{data.stats.dominantGenre}</p>
                  <p className="mt-2 text-sm text-white/54">O genero que mais aparece no seu recorte recente.</p>
                </div>
                <div className={`${subtlePanelClass} p-4`}>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/42">Artista em alta</p>
                  <p className="mt-3 text-lg font-medium text-white">
                    {data.highlights.topArtist?.name ?? "Sem destaque"}
                  </p>
                  <p className="mt-2 text-sm text-white/54">O nome com maior presenca entre seus favoritos do momento.</p>
                </div>
                <div className={`${subtlePanelClass} p-4`}>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/42">Faixa do momento</p>
                  <p className="mt-3 truncate text-lg font-medium text-white">
                    {data.highlights.topTrack?.name ?? "Sem destaque"}
                  </p>
                  <p className="mt-2 text-sm text-white/54">
                    Duracao media do ranking: {formatDuration(data.stats.averageTrackDuration)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.section>

          <motion.section className="xl:col-span-4" variants={itemVariants}>
            <Card className={`${surfaceCardClass} h-full`}>
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <SpotifyArtwork
                      alt={data.profile.name}
                      className="h-16 w-16 shrink-0"
                      fallback={data.profile.name.slice(0, 2)}
                      height={64}
                      sizes="64px"
                      src={data.profile.avatarUrl}
                      width={64}
                    />
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-white/42">Conta conectada</p>
                      <CardTitle className="mt-2 font-display text-2xl text-white">{data.profile.name}</CardTitle>
                      <CardDescription className="mt-1 text-sm text-white/56">
                        {formatNumber(data.profile.followers)} seguidores
                      </CardDescription>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="rounded-lg border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
                        size="icon-sm"
                        variant="outline"
                      >
                        <ChevronDown className="size-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="rounded-lg border-white/10 bg-[#101724] text-white"
                    >
                      <DropdownMenuItem className="rounded-md" onSelect={openSpotifyProfile}>
                        <ExternalLink className="size-4" />
                        Abrir perfil no Spotify
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/8" />
                      <DropdownMenuItem className="rounded-md text-red-300 focus:text-red-200" onSelect={logout}>
                        <LogOut className="size-4" />
                        Desconectar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className={`${subtlePanelClass} grid grid-cols-2 gap-3 p-4`}>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-white/42">Plano</p>
                    <p className="mt-2 text-sm font-medium text-white">{capitalize(data.profile.plan)}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-white/42">Mercado</p>
                    <p className="mt-2 text-sm font-medium text-white">{data.profile.country}</p>
                  </div>
                </div>
                <div className={`${subtlePanelClass} flex items-center gap-3 p-4`}>
                  <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-emerald-300">
                    <Globe2 className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Perfil sincronizado</p>
                    <p className="mt-1 text-sm text-white/56">Os dados exibidos refletem sua conta conectada agora.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1 rounded-lg bg-emerald-400 text-slate-950 hover:bg-emerald-300"
                    onClick={openSpotifyProfile}
                  >
                    Abrir perfil
                  </Button>
                  <Button
                    className="rounded-lg border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]"
                    onClick={logout}
                    variant="outline"
                  >
                    Sair
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </div>

        <motion.section variants={itemVariants}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <MetricCard
              hint="Quantidade de artistas retornados no seu ranking principal."
              icon={Users}
              label="Artistas no ranking"
              value={formatNumber(data.artists.length)}
            />
            <MetricCard
              hint="Quantidade de faixas retornadas no seu recorte recente."
              icon={Music2}
              label="Faixas no ranking"
              value={formatNumber(data.tracks.length)}
            />
            <MetricCard
              hint="Total de generos identificados a partir dos artistas mais ouvidos."
              icon={Sparkles}
              label="Generos mapeados"
              value={formatNumber(data.stats.genreCount)}
            />
            <MetricCard
              hint="Tempo medio das faixas retornadas no seu ranking."
              icon={Clock3}
              label="Duracao media"
              value={formatDuration(data.stats.averageTrackDuration)}
            />
          </div>
        </motion.section>

        <div className="grid gap-4 xl:grid-cols-12">
          <motion.section className="xl:col-span-7" variants={itemVariants}>
            <Card className={`${contentCardClass} h-[480px] md:h-[540px]`}>
              <Tabs className="flex h-full flex-col" defaultValue="artists">
                <CardHeader className="border-b border-white/8 px-5 py-5">
                  <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <div>
                      <CardTitle className="font-display text-2xl text-white">Ranking principal</CardTitle>
                      <CardDescription className="mt-1 text-white/58">
                        Alterne entre artistas e faixas mantendo a mesma area de leitura.
                      </CardDescription>
                    </div>
                    <TabsList className="rounded-lg border border-white/8 bg-white/[0.03] p-1">
                      <TabsTrigger
                        className="rounded-md px-4 data-[state=active]:bg-white/[0.08] data-[state=active]:text-white"
                        value="artists"
                      >
                        <Users className="size-4" />
                        Artistas
                      </TabsTrigger>
                      <TabsTrigger
                        className="rounded-md px-4 data-[state=active]:bg-white/[0.08] data-[state=active]:text-white"
                        value="tracks"
                      >
                        <Music2 className="size-4" />
                        Faixas
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-hidden px-0 py-0">
                  <TabsContent className="mt-0 h-full" value="artists">
                    <div className="panel-scroll h-full space-y-3 overflow-y-auto px-5 py-4">
                      {data.artists.map((artist) => (
                        <ArtistRow artist={artist} key={artist.id} />
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent className="mt-0 h-full" value="tracks">
                    <div className="panel-scroll h-full space-y-3 overflow-y-auto px-5 py-4">
                      {data.tracks.map((track) => (
                        <TrackRow key={track.id} track={track} />
                      ))}
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </Card>
          </motion.section>

          <motion.section className="xl:col-span-5" variants={itemVariants}>
            <Card className={`${contentCardClass} h-[480px] md:h-[540px]`}>
              <CardHeader className="border-b border-white/8 px-5 py-5">
                <CardTitle className="font-display text-2xl text-white">Generos em destaque</CardTitle>
                <CardDescription className="text-white/58">
                  Uma leitura compacta dos generos que mais aparecem na sua escuta recente.
                </CardDescription>
              </CardHeader>
              <CardContent className="panel-scroll flex-1 space-y-3 overflow-y-auto px-5 py-4">
                {data.favoriteGenres.map((genre) => (
                  <div className={`${subtlePanelClass} space-y-3 p-4`} key={genre.name}>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-white">{genre.name}</p>
                      <Badge className="rounded-md border-white/10 bg-white/[0.03] text-white/62" variant="outline">
                        {genre.count}
                      </Badge>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.05]">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400"
                        style={{
                          width: `${Math.max((genre.count / dominantGenreCount) * 100, 18)}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}

                <div className={`${subtlePanelClass} p-4`}>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/42">Leitura da fase atual</p>
                  <p className="mt-3 text-sm leading-7 text-white/58">
                    Seu recorte recente combina variedade e repeticao. Os generos acima mostram onde sua escuta esta mais concentrada neste momento.
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </div>

        <div className="grid gap-4 xl:grid-cols-12">
          <motion.section className="xl:col-span-7" variants={itemVariants}>
            <Card className={`${contentCardClass} h-[360px]`}>
              <CardHeader className="border-b border-white/8 px-5 py-5">
                <CardTitle className="font-display text-2xl text-white">Faixa do momento</CardTitle>
                <CardDescription className="text-white/58">
                  A musica que mais representa sua fase atual no Spotify.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex h-full flex-col gap-5 px-5 py-5 md:flex-row">
                {data.highlights.topTrack ? (
                  <>
                    <SpotifyArtwork
                      alt={data.highlights.topTrack.name}
                      className="h-44 w-full shrink-0 md:h-full md:w-56"
                      fallback={data.highlights.topTrack.name.slice(0, 2)}
                      height={320}
                      sizes="(max-width: 768px) 100vw, 224px"
                      src={data.highlights.topTrack.imageUrl}
                      width={320}
                    />
                    <div className="flex min-w-0 flex-1 flex-col justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-white/42">Em destaque agora</p>
                        <h3 className="mt-3 font-display text-3xl tracking-[-0.04em] text-white">
                          {data.highlights.topTrack.name}
                        </h3>
                        <p className="mt-2 text-sm text-white/58">{data.highlights.topTrack.artistName}</p>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className={`${subtlePanelClass} p-4`}>
                          <p className="text-xs uppercase tracking-[0.22em] text-white/42">Album</p>
                          <p className="mt-2 text-lg font-medium text-white">{data.highlights.topTrack.album}</p>
                        </div>
                        <div className={`${subtlePanelClass} p-4`}>
                          <p className="text-xs uppercase tracking-[0.22em] text-white/42">Duracao</p>
                          <p className="mt-2 text-lg font-medium text-white">
                            {formatDuration(data.highlights.topTrack.durationMs)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-white/58">
                    Ainda nao ha dados suficientes para destacar uma faixa.
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.section>

          <motion.section className="xl:col-span-5" variants={itemVariants}>
            <Card className={`${contentCardClass} h-[360px]`}>
              <CardHeader className="border-b border-white/8 px-5 py-5">
                <CardTitle className="font-display text-2xl text-white">Resumo da fase</CardTitle>
                <CardDescription className="text-white/58">
                  Um recorte rapido para entender o que mais pesa na sua escuta recente.
                </CardDescription>
              </CardHeader>
              <CardContent className="panel-scroll flex-1 space-y-3 overflow-y-auto px-5 py-4">
                <div className={`${subtlePanelClass} flex items-start gap-3 p-4`}>
                  <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-cyan-300">
                    <Users className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Artista com mais presenca</p>
                    <p className="mt-1 text-sm text-white/56">
                      {data.highlights.topArtist?.name ?? "Sem destaque no momento"}
                    </p>
                  </div>
                </div>
                <div className={`${subtlePanelClass} flex items-start gap-3 p-4`}>
                  <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-emerald-300">
                    <Sparkles className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Genero mais recorrente</p>
                    <p className="mt-1 text-sm text-white/56">{data.stats.dominantGenre}</p>
                  </div>
                </div>
                <div className={`${subtlePanelClass} flex items-start gap-3 p-4`}>
                  <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-orange-300">
                    <Disc3 className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Faixa mais representativa</p>
                    <p className="mt-1 text-sm text-white/56">
                      {data.highlights.topTrack?.name ?? "Sem destaque no momento"}
                    </p>
                  </div>
                </div>
                <div className={`${subtlePanelClass} flex items-start gap-3 p-4`}>
                  <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-violet-300">
                    <LayoutGrid className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Leitura geral</p>
                    <p className="mt-1 text-sm leading-7 text-white/56">
                      Seu painel mostra um equilibrio entre repeticao e variedade, com foco nos artistas, nas faixas e nos generos que mais aparecem no seu replay.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.section>
        </div>
      </motion.div>
    </main>
  );
}
