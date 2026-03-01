import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, BarChart3, Disc3, Sparkles, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { readShareToken } from "@/lib/spotify-server";

const surfaceCardClass =
  "rounded-xl border-white/10 bg-[#0d1420]/88 shadow-[0_14px_34px_rgba(2,6,23,0.24)] backdrop-blur-sm";

const subtlePanelClass = "rounded-lg border border-white/8 bg-white/[0.03]";

function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

function formatShare(value: number) {
  return `${value}%`;
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

type SharePageProps = {
  params: Promise<{
    token: string;
  }>;
};

export default async function SharePage({ params }: SharePageProps) {
  const { token } = await params;
  const snapshot = readShareToken(token);

  if (!snapshot) {
    notFound();
  }

  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4">
        <div className="grid gap-4 xl:grid-cols-12">
          <section className="xl:col-span-8">
            <Card className={`${surfaceCardClass} h-full`}>
              <CardHeader className="space-y-5">
                <div className="flex flex-wrap gap-2">
                  <Badge className="rounded-md border-white/10 bg-white/[0.03] text-white/70" variant="outline">
                    Snapshot compartilhado
                  </Badge>
                  <Badge className="rounded-md border-white/10 bg-white/[0.03] text-white/70" variant="outline">
                    {snapshot.rangeLabel}
                  </Badge>
                  <Badge className="rounded-md border-white/10 bg-white/[0.03] text-white/70" variant="outline">
                    {snapshot.favoriteGenres.length} generos em foco
                  </Badge>
                </div>
                <div className="space-y-3">
                  <CardTitle className="font-display text-4xl tracking-[-0.04em] text-white sm:text-5xl">
                    {snapshot.identityCard.title}
                  </CardTitle>
                  <CardDescription className="max-w-3xl text-base leading-8 text-white/64">
                    {snapshot.identityCard.summary}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-3">
                <div className={`${subtlePanelClass} p-4`}>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/42">Artista dominante</p>
                  <p className="mt-3 text-lg font-medium text-white">{snapshot.stats.dominantArtist}</p>
                  <p className="mt-2 text-sm text-white/54">
                    {formatShare(snapshot.stats.dominantArtistShare)} do peso combinado entre periodos.
                  </p>
                </div>
                <div className={`${subtlePanelClass} p-4`}>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/42">Variedade</p>
                  <p className="mt-3 text-lg font-medium text-white">{formatShare(snapshot.stats.varietyScore)}</p>
                  <p className="mt-2 text-sm text-white/54">Quanto mais alto, mais distribuida esta a escuta.</p>
                </div>
                <div className={`${subtlePanelClass} p-4`}>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/42">Genero dominante</p>
                  <p className="mt-3 text-lg font-medium text-white">{snapshot.stats.dominantGenre}</p>
                  <p className="mt-2 text-sm text-white/54">
                    Concentracao atual de {formatShare(snapshot.stats.concentrationScore)}.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="xl:col-span-4">
            <Card className={`${surfaceCardClass} h-full`}>
              <CardHeader className="pb-4">
                <div className="flex items-start gap-4">
                  <SpotifyArtwork
                    alt={snapshot.profile.name}
                    className="h-16 w-16 shrink-0"
                    fallback={snapshot.profile.name.slice(0, 2)}
                    height={64}
                    sizes="64px"
                    src={snapshot.profile.avatarUrl}
                    width={64}
                  />
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-white/42">Perfil Spotify</p>
                    <CardTitle className="mt-2 font-display text-2xl text-white">{snapshot.profile.name}</CardTitle>
                    <CardDescription className="mt-1 text-sm text-white/56">
                      {snapshot.profile.country} • {snapshot.profile.plan}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className={`${subtlePanelClass} p-4`}>
                  <p className="text-xs uppercase tracking-[0.22em] text-white/42">Badges do cartao</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {snapshot.identityCard.badges.map((badge) => (
                      <Badge className="rounded-md border-white/10 bg-white/[0.03] text-white/66" key={badge} variant="outline">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button asChild className="rounded-lg bg-emerald-400 text-slate-950 hover:bg-emerald-300">
                  <a href={snapshot.profile.spotifyUrl} rel="noreferrer" target="_blank">
                    Abrir perfil no Spotify
                    <ArrowUpRight className="size-4" />
                  </a>
                </Button>
                <Button asChild className="rounded-lg border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.06]" variant="outline">
                  <Link href="/">Conectar outra conta</Link>
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className={surfaceCardClass}>
            <CardContent className="space-y-4 px-5 py-5">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.24em] text-white/42">Popularidade media</span>
                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-emerald-300">
                  <BarChart3 className="size-4" />
                </div>
              </div>
              <p className="font-display text-3xl tracking-[-0.04em] text-white">
                {snapshot.stats.averageTrackPopularity}/100
              </p>
            </CardContent>
          </Card>
          <Card className={surfaceCardClass}>
            <CardContent className="space-y-4 px-5 py-5">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.24em] text-white/42">Artistas em foco</span>
                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-cyan-300">
                  <Users className="size-4" />
                </div>
              </div>
              <p className="font-display text-3xl tracking-[-0.04em] text-white">
                {formatNumber(snapshot.topArtists.length)}
              </p>
            </CardContent>
          </Card>
          <Card className={surfaceCardClass}>
            <CardContent className="space-y-4 px-5 py-5">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.24em] text-white/42">Faixas em foco</span>
                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-orange-300">
                  <Disc3 className="size-4" />
                </div>
              </div>
              <p className="font-display text-3xl tracking-[-0.04em] text-white">
                {formatNumber(snapshot.topTracks.length)}
              </p>
            </CardContent>
          </Card>
          <Card className={surfaceCardClass}>
            <CardContent className="space-y-4 px-5 py-5">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.24em] text-white/42">Clusters de genero</span>
                <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-violet-300">
                  <Sparkles className="size-4" />
                </div>
              </div>
              <p className="font-display text-3xl tracking-[-0.04em] text-white">
                {formatNumber(snapshot.genreClusters.length)}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 xl:grid-cols-12">
          <section className="xl:col-span-6">
            <Card className={`${surfaceCardClass} h-full`}>
              <CardHeader>
                <CardTitle className="font-display text-2xl text-white">Top artistas</CardTitle>
                <CardDescription className="text-white/58">
                  Os nomes que lideram este snapshot compartilhado.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {snapshot.topArtists.map((artist) => (
                  <a
                    className={`${subtlePanelClass} flex items-center gap-4 p-4 transition hover:border-emerald-300/30 hover:bg-white/[0.05]`}
                    href={artist.spotifyUrl}
                    key={artist.id}
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
                  </a>
                ))}
              </CardContent>
            </Card>
          </section>

          <section className="xl:col-span-6">
            <Card className={`${surfaceCardClass} h-full`}>
              <CardHeader>
                <CardTitle className="font-display text-2xl text-white">Top faixas</CardTitle>
                <CardDescription className="text-white/58">
                  As musicas que mais representam o periodo selecionado.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {snapshot.topTracks.map((track) => (
                  <a
                    className={`${subtlePanelClass} flex items-center gap-4 p-4 transition hover:border-cyan-300/30 hover:bg-white/[0.05]`}
                    href={track.spotifyUrl}
                    key={track.id}
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
                  </a>
                ))}
              </CardContent>
            </Card>
          </section>
        </div>

        <div className="grid gap-4 xl:grid-cols-12">
          <section className="xl:col-span-7">
            <Card className={`${surfaceCardClass} h-full`}>
              <CardHeader>
                <CardTitle className="font-display text-2xl text-white">Tendencias do snapshot</CardTitle>
                <CardDescription className="text-white/58">{snapshot.trends.summary}</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-3">
                <div className={`${subtlePanelClass} p-4`}>
                  <p className="text-xs uppercase tracking-[0.22em] text-white/42">Artistas</p>
                  <div className="mt-3 space-y-2">
                    {snapshot.trends.artists.map((trend) => (
                      <div className="text-sm text-white/70" key={trend.id}>
                        <span className="font-medium text-white">{trend.name}</span> • #{trend.currentRank}
                      </div>
                    ))}
                  </div>
                </div>
                <div className={`${subtlePanelClass} p-4`}>
                  <p className="text-xs uppercase tracking-[0.22em] text-white/42">Faixas</p>
                  <div className="mt-3 space-y-2">
                    {snapshot.trends.tracks.map((trend) => (
                      <div className="text-sm text-white/70" key={trend.id}>
                        <span className="font-medium text-white">{trend.name}</span> • #{trend.currentRank}
                      </div>
                    ))}
                  </div>
                </div>
                <div className={`${subtlePanelClass} p-4`}>
                  <p className="text-xs uppercase tracking-[0.22em] text-white/42">Generos</p>
                  <div className="mt-3 space-y-2">
                    {snapshot.trends.genres.map((genre) => (
                      <div className="text-sm text-white/70" key={genre.name}>
                        <span className="font-medium text-white">{genre.name}</span> • {genre.currentCount}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="xl:col-span-5">
            <Card className={`${surfaceCardClass} h-full`}>
              <CardHeader>
                <CardTitle className="font-display text-2xl text-white">Mapa de generos</CardTitle>
                <CardDescription className="text-white/58">
                  Clusters montados a partir dos artistas mais fortes do periodo.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {snapshot.genreClusters.map((cluster) => (
                  <div className={`${subtlePanelClass} space-y-3 p-4`} key={cluster.name}>
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-white">{cluster.name}</p>
                      <Badge className="rounded-md border-white/10 bg-white/[0.03] text-white/62" variant="outline">
                        {formatShare(cluster.share)}
                      </Badge>
                    </div>
                    <p className="text-sm leading-6 text-white/56">{cluster.artists.join(" • ")}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </main>
  );
}
