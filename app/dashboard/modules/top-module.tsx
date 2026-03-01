import { BarChart3, Disc3, ExternalLink, Users } from "lucide-react";
import { TIME_RANGE_CONFIG, type TimeRange } from "@/lib/spotify-schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ModuleErrorState, ModuleLoadingState, SpotifyArtwork, subtlePanelClass, surfaceCardClass } from "@/app/dashboard/module-ui";
import type { ModuleState, TopData } from "@/app/dashboard/types";

function ArtistRow({ artist }: { artist: TopData["artists"][number] }) {
  return (
    <a className={`${subtlePanelClass} flex items-center gap-3 p-4 transition hover:border-white/15 hover:bg-white/[0.05]`} href={artist.spotifyUrl} rel="noreferrer" target="_blank">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-sm text-white/72">{artist.rank}</div>
      <SpotifyArtwork alt={artist.name} className="h-14 w-14 shrink-0" fallback={artist.name.slice(0, 2)} height={56} sizes="56px" src={artist.imageUrl} width={56} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{artist.name}</p>
        <p className="mt-1 truncate text-sm text-white/56">{artist.genres.slice(0, 2).join(" / ") || "Sem genero dominante"}</p>
      </div>
      <div className="hidden text-right text-xs text-white/46 md:block">
        <p>{artist.popularity}/100</p>
        <p className="mt-1">popularidade</p>
      </div>
    </a>
  );
}

function TrackRow({ track }: { track: TopData["tracks"][number] }) {
  return (
    <a className={`${subtlePanelClass} flex items-center gap-3 p-4 transition hover:border-white/15 hover:bg-white/[0.05]`} href={track.spotifyUrl} rel="noreferrer" target="_blank">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-sm text-white/72">{track.rank}</div>
      <SpotifyArtwork alt={track.name} className="h-14 w-14 shrink-0" fallback={track.name.slice(0, 2)} height={56} sizes="56px" src={track.imageUrl} width={56} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-white">{track.name}</p>
        <p className="mt-1 truncate text-sm text-white/56">{track.artistNames}</p>
      </div>
      <div className="hidden text-right text-xs text-white/46 md:block">
        <p>{track.popularity}/100</p>
        <p className="mt-1">popularidade</p>
      </div>
    </a>
  );
}

export function TopModule({
  state,
  selectedRange,
  onRangeChange,
  onRetry,
}: {
  state: ModuleState<TopData>;
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
  onRetry: () => void;
}) {
  if (state.status === "loading" && !state.data) {
    return <ModuleLoadingState title="Top" />;
  }

  if (state.status === "error") {
    return <ModuleErrorState message={state.error ?? "Nao foi possivel carregar seus tops."} onRetry={onRetry} />;
  }

  return (
    <div className="space-y-4">
      <Card className={`${surfaceCardClass} overflow-hidden`}>
        <CardHeader className="border-b border-white/8 pb-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge className="rounded-full border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-emerald-100" variant="outline">
                  Modulo 3
                </Badge>
                <Badge className="rounded-full border-white/10 bg-white/[0.03] px-3 py-1 text-white/70" variant="outline">
                  cache por range no cliente
                </Badge>
              </div>
              <CardTitle className="mt-4 font-display text-3xl tracking-[-0.04em] text-white">Top artistas e faixas sem inflar o primeiro carregamento</CardTitle>
              <CardDescription className="mt-2 max-w-3xl text-base leading-7 text-white/60">
                O modulo so busca dados quando voce abre essa area. Depois disso, cada recorte fica guardado em memoria para alternar rapido entre curto, medio e longo prazo.
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(TIME_RANGE_CONFIG) as TimeRange[]).map((range) => (
                <Button
                  className={selectedRange === range ? "rounded-full bg-white text-slate-950 hover:bg-white/90" : "rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.07]"}
                  key={range}
                  onClick={() => onRangeChange(range)}
                  variant={selectedRange === range ? "default" : "outline"}
                >
                  {TIME_RANGE_CONFIG[range].label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 pt-6 md:grid-cols-3">
          <div className={`${subtlePanelClass} p-4`}>
            <p className="text-xs uppercase tracking-[0.24em] text-white/42">Janela ativa</p>
            <p className="mt-3 text-lg font-medium text-white">{TIME_RANGE_CONFIG[selectedRange].label}</p>
            <p className="mt-2 text-sm text-white/56">{TIME_RANGE_CONFIG[selectedRange].description}</p>
          </div>
          <div className={`${subtlePanelClass} p-4`}>
            <p className="text-xs uppercase tracking-[0.24em] text-white/42">Artista dominante</p>
            <p className="mt-3 text-lg font-medium text-white">{state.data?.artists[0]?.name ?? "Carregando"}</p>
            <p className="mt-2 text-sm text-white/56">Primeira posicao atual desse modulo.</p>
          </div>
          <div className={`${subtlePanelClass} p-4`}>
            <p className="text-xs uppercase tracking-[0.24em] text-white/42">Faixa do topo</p>
            <p className="mt-3 text-lg font-medium text-white">{state.data?.tracks[0]?.name ?? "Carregando"}</p>
            <p className="mt-2 text-sm text-white/56">Seu replay mais forte nesse periodo.</p>
          </div>
        </CardContent>
      </Card>

      {state.data ? (
        <div className="grid gap-4 xl:grid-cols-2">
          <Card className={`${surfaceCardClass} min-h-[620px] overflow-hidden`}>
            <CardHeader className="border-b border-white/8 pb-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="font-display text-2xl text-white">Top artistas</CardTitle>
                  <CardDescription className="text-white/58">Leitura direta dos nomes que mais pesam no recorte atual.</CardDescription>
                </div>
                <Badge className="rounded-full border-white/10 bg-white/[0.03] px-3 py-1 text-white/66" variant="outline">
                  <Users className="size-3.5" />
                  {state.data.artists.length}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="panel-scroll max-h-[720px] space-y-3 overflow-y-auto pt-6">
              {state.data.artists.map((artist) => (
                <ArtistRow artist={artist} key={artist.id} />
              ))}
            </CardContent>
          </Card>

          <Card className={`${surfaceCardClass} min-h-[620px] overflow-hidden`}>
            <CardHeader className="border-b border-white/8 pb-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="font-display text-2xl text-white">Top faixas</CardTitle>
                  <CardDescription className="text-white/58">Tracks que merecem virar playlists, recomendacoes e DNA sonoro.</CardDescription>
                </div>
                <Button asChild className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]" variant="outline">
                  <a href={state.data.tracks[0]?.spotifyUrl ?? "https://open.spotify.com/"} rel="noreferrer" target="_blank">
                    Abrir destaque
                    <ExternalLink className="size-4" />
                  </a>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="panel-scroll max-h-[720px] space-y-3 overflow-y-auto pt-6">
              {state.data.tracks.map((track) => (
                <TrackRow key={track.id} track={track} />
              ))}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className={`${subtlePanelClass} flex min-h-[260px] items-center justify-center gap-3 p-6 text-sm text-white/56`}>
          <BarChart3 className="size-4 text-emerald-300" />
          Escolha um recorte para carregar artistas e faixas.
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card className={surfaceCardClass}>
          <CardContent className="flex h-full items-center gap-3 px-5 py-5 text-sm text-white/62">
            <Users className="size-4 text-emerald-300" />
            Os tops alimentam os modulos de playlist, recomendacao e descoberta.
          </CardContent>
        </Card>
        <Card className={surfaceCardClass}>
          <CardContent className="flex h-full items-center gap-3 px-5 py-5 text-sm text-white/62">
            <Disc3 className="size-4 text-cyan-300" />
            O limite esta em 50 no endpoint, mas o hub usa menos itens para manter leitura rapida.
          </CardContent>
        </Card>
        <Card className={surfaceCardClass}>
          <CardContent className="flex h-full items-center gap-3 px-5 py-5 text-sm text-white/62">
            <BarChart3 className="size-4 text-violet-300" />
            Cada range ja fica em cache no cliente depois da primeira abertura.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
