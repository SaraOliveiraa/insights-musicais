import { Clock3, ExternalLink, History, Radio, Repeat2, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ModuleErrorState, ModuleLoadingState, SpotifyArtwork, formatDuration, formatRelativeTime, subtlePanelClass, surfaceCardClass } from "@/app/dashboard/module-ui";
import type { ModuleState, NowData } from "@/app/dashboard/types";

export function NowModule({ state, onRetry }: { state: ModuleState<NowData>; onRetry: () => void }) {
  if (state.status === "loading" && !state.data) {
    return <ModuleLoadingState title="Agora" />;
  }

  if (state.status === "error") {
    return <ModuleErrorState message={state.error ?? "Nao foi possivel carregar o playback atual."} onRetry={onRetry} />;
  }

  if (!state.data) {
    return null;
  }

  const { current, player, recent } = state.data;
  const progressPercent = current?.track && current.progressMs !== null && current.track.durationMs > 0 ? Math.min((current.progressMs / current.track.durationMs) * 100, 100) : 0;

  return (
    <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
      <Card className={`${surfaceCardClass} overflow-hidden`}>
        <CardHeader className="border-b border-white/8 pb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge className="rounded-full border-cyan-300/20 bg-cyan-400/10 px-3 py-1 text-cyan-100" variant="outline">
                  Now Playing
                </Badge>
                <Badge className="rounded-full border-white/10 bg-white/[0.03] px-3 py-1 text-white/70" variant="outline">
                  {player.isPlaying ? "Ao vivo" : "Ultimo estado"}
                </Badge>
              </div>
              <CardTitle className="mt-4 font-display text-3xl tracking-[-0.04em] text-white">Estado atual da sua escuta</CardTitle>
              <CardDescription className="mt-2 max-w-2xl text-base leading-7 text-white/60">
                Um modulo leve para dar vida ao produto logo na entrada, com musica atual, contexto do player e historico recente.
              </CardDescription>
            </div>
            {current?.track ? (
              <Button asChild className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]" variant="outline">
                <a href={current.track.spotifyUrl} rel="noreferrer" target="_blank">
                  Ouvir no Spotify
                  <ExternalLink className="size-4" />
                </a>
              </Button>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {current?.track ? (
            <div className="grid gap-5 lg:grid-cols-[240px_1fr]">
              <SpotifyArtwork alt={current.track.name} className="h-64 w-full" fallback={current.track.name.slice(0, 2)} height={256} sizes="(max-width: 1024px) 100vw, 240px" src={current.track.imageUrl} width={256} />
              <div className="flex min-w-0 flex-col justify-between gap-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-white/42">{current.isPlaying ? "Tocando agora" : "Pronto para retomar"}</p>
                  <h3 className="mt-3 font-display text-4xl tracking-[-0.05em] text-white">{current.track.name}</h3>
                  <p className="mt-2 text-base text-white/60">{current.track.artistNames}</p>
                  <p className="mt-4 text-sm leading-7 text-white/56">Album {current.track.album} {current.deviceName ? `- ${current.deviceName}` : "- sem device ativo"}</p>
                </div>
                <div className="space-y-3">
                  <div className="h-2 rounded-full bg-white/[0.06]">
                    <div className="h-2 rounded-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-sky-400" style={{ width: `${Math.max(progressPercent, 4)}%` }} />
                  </div>
                  <div className="flex items-center justify-between text-sm text-white/54">
                    <span>{current.progressMs ? formatDuration(current.progressMs) : "0 min"}</span>
                    <span>{formatDuration(current.track.durationMs)}</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className={`${subtlePanelClass} p-4`}>
                      <p className="text-xs uppercase tracking-[0.22em] text-white/42">Tipo</p>
                      <p className="mt-2 text-sm font-medium text-white">{current.playingType}</p>
                    </div>
                    <div className={`${subtlePanelClass} p-4`}>
                      <p className="text-xs uppercase tracking-[0.22em] text-white/42">Repeat</p>
                      <p className="mt-2 text-sm font-medium text-white">{current.repeatState}</p>
                    </div>
                    <div className={`${subtlePanelClass} p-4`}>
                      <p className="text-xs uppercase tracking-[0.22em] text-white/42">Shuffle</p>
                      <p className="mt-2 text-sm font-medium text-white">{current.shuffleState ? "Ligado" : "Desligado"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className={`${subtlePanelClass} flex min-h-[260px] flex-col items-center justify-center gap-3 p-6 text-center`}>
              <Radio className="size-5 text-cyan-300" />
              <p className="text-sm font-medium text-white">Nada tocando neste momento</p>
              <p className="max-w-md text-sm leading-7 text-white/56">Assim que o Spotify reportar uma sessao ativa, esse bloco vira o ponto mais vivo do dashboard.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4">
        <Card className={`${surfaceCardClass} h-fit`}>
          <CardHeader className="border-b border-white/8 pb-6">
            <CardTitle className="font-display text-2xl text-white">Sinais do player</CardTitle>
            <CardDescription className="text-white/58">Status rapido para entender o estado do playback sem abrir tudo.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 pt-6 sm:grid-cols-2">
            <div className={`${subtlePanelClass} flex items-start gap-3 p-4`}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-emerald-300">
                <Volume2 className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Volume</p>
                <p className="mt-1 text-sm text-white/56">{player.volumePercent !== null ? `${player.volumePercent}%` : "Indisponivel"}</p>
              </div>
            </div>
            <div className={`${subtlePanelClass} flex items-start gap-3 p-4`}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-cyan-300">
                <Repeat2 className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Repeat</p>
                <p className="mt-1 text-sm text-white/56">{player.repeatState}</p>
              </div>
            </div>
            <div className={`${subtlePanelClass} flex items-start gap-3 p-4`}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-violet-300">
                <Clock3 className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Progresso</p>
                <p className="mt-1 text-sm text-white/56">{player.progressMs ? formatDuration(player.progressMs) : "Sem playback ativo"}</p>
              </div>
            </div>
            <div className={`${subtlePanelClass} flex items-start gap-3 p-4`}>
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-orange-300">
                <Radio className="size-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Device</p>
                <p className="mt-1 text-sm text-white/56">{player.deviceName ?? "Nenhum device ativo"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${surfaceCardClass} min-h-[420px] overflow-hidden`}>
          <CardHeader className="border-b border-white/8 pb-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="font-display text-2xl text-white">Ultimas 20</CardTitle>
                <CardDescription className="text-white/58">Linha do tempo leve para contar o que passou pelo player recentemente.</CardDescription>
              </div>
              <Badge className="rounded-full border-white/10 bg-white/[0.03] px-3 py-1 text-white/66" variant="outline">
                <History className="size-3.5" />
                {recent.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="panel-scroll max-h-[480px] space-y-3 overflow-y-auto pt-6">
            {recent.length > 0 ? (
              recent.map((item) => (
                <a className={`${subtlePanelClass} flex items-center gap-3 p-4 transition hover:border-white/15 hover:bg-white/[0.05]`} href={item.track.spotifyUrl} key={`${item.track.id}-${item.playedAt ?? "recent"}`} rel="noreferrer" target="_blank">
                  <SpotifyArtwork alt={item.track.name} className="h-14 w-14 shrink-0" fallback={item.track.name.slice(0, 2)} height={56} sizes="56px" src={item.track.imageUrl} width={56} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{item.track.name}</p>
                    <p className="mt-1 truncate text-sm text-white/56">{item.track.artistNames}</p>
                  </div>
                  <div className="shrink-0 text-right text-xs text-white/46">
                    <p>{formatRelativeTime(item.playedAt)}</p>
                    <p className="mt-1">{formatDuration(item.track.durationMs)}</p>
                  </div>
                </a>
              ))
            ) : (
              <div className={`${subtlePanelClass} p-4 text-sm leading-7 text-white/56`}>O Spotify ainda nao retornou historico recente para essa conta.</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
