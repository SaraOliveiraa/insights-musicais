import { Globe2, Headphones, Mail, Radio, ShieldCheck, Smartphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ModuleErrorState, ModuleLoadingState, SpotifyArtwork, capitalize, formatNumber, subtlePanelClass, surfaceCardClass } from "@/app/dashboard/module-ui";
import type { ModuleState, OverviewData } from "@/app/dashboard/types";

export function OverviewModule({ state, onRetry }: { state: ModuleState<OverviewData>; onRetry: () => void }) {
  if (state.status === "loading" && !state.data) {
    return <ModuleLoadingState title="Perfil & Contexto" />;
  }

  if (state.status === "error") {
    return <ModuleErrorState message={state.error ?? "Nao foi possivel carregar o contexto da conta."} onRetry={onRetry} />;
  }

  if (!state.data) {
    return null;
  }

  const { devices, player, profile } = state.data;

  return (
    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <Card className={`${surfaceCardClass} overflow-hidden`}>
        <CardHeader className="border-b border-white/8 pb-6">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="flex items-center gap-4">
              <SpotifyArtwork alt={profile.name} className="h-20 w-20 shrink-0" fallback={profile.name.slice(0, 2)} height={80} sizes="80px" src={profile.avatarUrl} width={80} />
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <Badge className="rounded-full border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-emerald-100" variant="outline">
                    Voce agora
                  </Badge>
                  <Badge className="rounded-full border-white/10 bg-white/[0.03] px-3 py-1 text-white/70" variant="outline">
                    {capitalize(profile.plan)}
                  </Badge>
                  <Badge className="rounded-full border-white/10 bg-white/[0.03] px-3 py-1 text-white/70" variant="outline">
                    {profile.country}
                  </Badge>
                </div>
                <CardTitle className="font-display text-3xl tracking-[-0.04em] text-white">{profile.name}</CardTitle>
                <CardDescription className="max-w-2xl text-base leading-7 text-white/60">
                  O dashboard agora abre com o minimo necessario para contextualizar a conta e preparar os modulos que vem depois.
                </CardDescription>
              </div>
            </div>
            <Button asChild className="rounded-full border-white/10 bg-white/[0.04] text-white hover:bg-white/[0.08]" variant="outline">
              <a href={profile.spotifyUrl} rel="noreferrer" target="_blank">
                Abrir perfil
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 pt-6 md:grid-cols-3">
          <div className={`${subtlePanelClass} p-4`}>
            <p className="text-xs uppercase tracking-[0.24em] text-white/42">Seguidores</p>
            <p className="mt-3 font-display text-3xl tracking-[-0.04em] text-white">{formatNumber(profile.followers)}</p>
            <p className="mt-2 text-sm text-white/54">Base atual da conta conectada.</p>
          </div>
          <div className={`${subtlePanelClass} p-4`}>
            <p className="text-xs uppercase tracking-[0.24em] text-white/42">Status do player</p>
            <p className="mt-3 text-lg font-medium text-white">{player.isPlaying ? "Tocando agora" : player.hasActiveSession ? "Sessao aberta" : "Sem sessao ativa"}</p>
            <p className="mt-2 text-sm text-white/54">{player.deviceName ?? "Abra o Spotify em algum dispositivo para sincronizar o contexto."}</p>
          </div>
          <div className={`${subtlePanelClass} p-4`}>
            <p className="text-xs uppercase tracking-[0.24em] text-white/42">Contato</p>
            <p className="mt-3 break-all text-lg font-medium text-white">{profile.email ?? "Email nao disponivel"}</p>
            <p className="mt-2 text-sm text-white/54">Usado apenas para leitura segura da sua conta.</p>
          </div>
        </CardContent>
      </Card>

      <Card className={`${surfaceCardClass} h-full`}>
        <CardHeader className="border-b border-white/8 pb-6">
          <CardTitle className="font-display text-2xl text-white">Contexto operacional</CardTitle>
          <CardDescription className="text-white/58">Um bloco leve para mostrar onde a conta esta ativa e como o player esta configurado.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 pt-6">
          <div className={`${subtlePanelClass} flex items-start gap-3 p-4`}>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-emerald-300">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Conexao pronta</p>
              <p className="mt-1 text-sm leading-6 text-white/56">Scopes de perfil, top, playback e playlists ja foram preparados para os proximos modulos.</p>
            </div>
          </div>
          <div className={`${subtlePanelClass} grid gap-3 p-4 sm:grid-cols-3`}>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-white/42">Playback</p>
              <p className="mt-2 text-sm font-medium text-white">{player.isPlaying ? "Ativo" : "Parado"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-white/42">Shuffle</p>
              <p className="mt-2 text-sm font-medium text-white">{player.shuffleState ? "Ligado" : "Desligado"}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-white/42">Repeat</p>
              <p className="mt-2 text-sm font-medium text-white">{player.repeatState}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-white">Dispositivos disponiveis</p>
              <Badge className="rounded-full border-white/10 bg-white/[0.03] px-3 py-1 text-white/66" variant="outline">
                {devices.length}
              </Badge>
            </div>
            <div className="grid gap-3">
              {devices.length > 0 ? (
                devices.slice(0, 4).map((device) => (
                  <div className={`${subtlePanelClass} flex items-start gap-3 p-4`} key={device.id}>
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-cyan-300">
                      {device.type.toLowerCase().includes("smartphone") ? <Smartphone className="size-4" /> : device.type.toLowerCase().includes("speaker") ? <Radio className="size-4" /> : <Headphones className="size-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-medium text-white">{device.name}</p>
                        {device.isActive ? (
                          <Badge className="rounded-full border-emerald-300/20 bg-emerald-400/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.22em] text-emerald-100" variant="outline">
                            ativo
                          </Badge>
                        ) : null}
                      </div>
                      <p className="mt-1 text-sm text-white/54">{device.type} {device.supportsVolume ? `- volume ${device.volumePercent}%` : "- sem volume remoto"}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className={`${subtlePanelClass} p-4 text-sm leading-7 text-white/56`}>Nenhum dispositivo retornado agora. Isso costuma aparecer quando o Spotify nao esta aberto em outro device.</div>
              )}
            </div>
          </div>
          <div className={`${subtlePanelClass} flex items-start gap-3 p-4`}>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-violet-300">
              <Globe2 className="size-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Mercado principal</p>
              <p className="mt-1 text-sm leading-6 text-white/56">Pais configurado em {profile.country}, com limites e catalogo alinhados ao que o Spotify entrega para essa conta.</p>
            </div>
          </div>
          <div className={`${subtlePanelClass} flex items-start gap-3 p-4`}>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-orange-300">
              <Mail className="size-4" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Contato vinculado</p>
              <p className="mt-1 break-all text-sm leading-6 text-white/56">{profile.email ?? "Spotify nao retornou email para esta conta."}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
