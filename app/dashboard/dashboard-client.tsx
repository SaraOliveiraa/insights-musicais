"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  AudioWaveform,
  BarChart3,
  Compass,
  LayoutPanelLeft,
  ListMusic,
  LoaderCircle,
  LogOut,
  Radio,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { subtlePanelClass, surfaceCardClass } from "@/app/dashboard/module-ui";
import { NowModule } from "@/app/dashboard/modules/now-module";
import { OverviewModule } from "@/app/dashboard/modules/overview-module";
import { TopModule } from "@/app/dashboard/modules/top-module";
import type { ModuleKey, ModuleState, NowData, OverviewData, TopData } from "@/app/dashboard/types";
import type { TimeRange } from "@/lib/spotify-schema";

type DashboardClientProps = {
  initialRange: TimeRange;
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
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

function createModuleState<T>(): ModuleState<T> {
  return {
    status: "idle",
    data: null,
    error: null,
  };
}

const MODULE_CARDS: Array<{
  key: ModuleKey;
  title: string;
  description: string;
  status: "live" | "roadmap";
  icon: LucideIcon;
}> = [
  {
    key: "overview",
    title: "Perfil & Contexto",
    description: "Conta, pais, plano, devices e status do player logo de cara.",
    status: "live",
    icon: LayoutPanelLeft,
  },
  {
    key: "now",
    title: "Agora",
    description: "Now playing, estado do player e ultimas 20 reproducoes.",
    status: "live",
    icon: Radio,
  },
  {
    key: "top",
    title: "Top",
    description: "Top artists e top tracks com cache por periodo.",
    status: "live",
    icon: BarChart3,
  },
  {
    key: "dna",
    title: "DNA Sonoro",
    description: "Audio features em lote e analysis sob demanda.",
    status: "roadmap",
    icon: AudioWaveform,
  },
  {
    key: "playlists",
    title: "Playlists",
    description: "Curadoria, criacao automatica e embed pronto para ouvir.",
    status: "roadmap",
    icon: ListMusic,
  },
  {
    key: "recommendations",
    title: "Recomendacoes",
    description: "Seeds com top + recent para sugerir novas faixas.",
    status: "roadmap",
    icon: Sparkles,
  },
  {
    key: "discovery",
    title: "Descoberta",
    description: "Busca, detalhe de artista, top tracks e albuns.",
    status: "roadmap",
    icon: Compass,
  },
];

const ROADMAP_COPY: Record<
  Exclude<ModuleKey, "overview" | "now" | "top">,
  {
    badge: string;
    title: string;
    description: string;
    endpoints: string[];
    outputs: string[];
  }
> = {
  dna: {
    badge: "Modulo 4",
    title: "DNA sonoro para dar profundidade real ao produto",
    description:
      "Esse bloco entra depois do top. Primeiro puxa audio features em lote para montar radar e barras; analise detalhada so quando o usuario clicar em uma musica.",
    endpoints: ["GET /v1/audio-features?ids={ids}", "GET /v1/audio-analysis/{id}"],
    outputs: ["Radar de energy, valence, danceability e acousticness", "Analise detalhada por musica, sob demanda"],
  },
  playlists: {
    badge: "Modulo 5",
    title: "Curadoria que transforma insight em acao",
    description:
      "Playlists fazem o projeto parecer produto: ler tops, gerar uma selecao, publicar no Spotify e abrir embed na mesma tela.",
    endpoints: [
      "GET /v1/me/playlists?limit=20",
      "POST /v1/users/{user_id}/playlists",
      "POST /v1/playlists/{playlist_id}/tracks",
    ],
    outputs: ["Gerar playlist Top 20 do mes", "Ouvir a playlist no embed do Spotify"],
  },
  recommendations: {
    badge: "Modulo 6",
    title: "Recomendacoes com seeds que fazem sentido para o usuario",
    description:
      "A melhor base aqui eh o que ja existe no produto: top artists, top tracks e recently played. Isso mantem o modulo leve e mais pessoal.",
    endpoints: [
      "GET /v1/recommendations?seed_artists=...&seed_tracks=...&seed_genres=...",
      "GET /v1/recommendations/available-genre-seeds",
    ],
    outputs: ["Lista de recomendacoes pronta para salvar", "Geracao de playlist a partir das recomendacoes"],
  },
  discovery: {
    badge: "Modulo 7",
    title: "Descoberta para abrir uma segunda camada de uso",
    description:
      "Esse modulo vira a aba de exploracao: busca, artista, top tracks do artista e albuns, sem pesar o fluxo principal.",
    endpoints: [
      "GET /v1/search?q={q}&type=track,artist,album&limit=10",
      "GET /v1/artists/{id}",
      "GET /v1/artists/{id}/top-tracks?market=BR",
      "GET /v1/artists/{id}/albums?include_groups=album,single&market=BR&limit=20",
    ],
    outputs: ["Busca com leitura rapida e links para abrir no Spotify", "Perfil expandido de artista dentro do produto"],
  },
};

function ModuleCard({
  active,
  preview,
  description,
  icon: Icon,
  onClick,
  status,
  title,
}: {
  active: boolean;
  preview: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  status: "live" | "roadmap";
  title: string;
}) {
  return (
    <button
      className={`${surfaceCardClass} group text-left transition ${active ? "border-emerald-300/35 bg-[#0c1724]/96" : "hover:border-white/16 hover:bg-[#0b1420]/92"}`}
      onClick={onClick}
      type="button"
    >
      <div className="flex h-full flex-col gap-5 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className={`rounded-2xl border border-white/10 bg-white/[0.04] p-3 ${active ? "text-emerald-200" : "text-white/72"}`}>
            <Icon className="size-5" />
          </div>
          <Badge
            className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.22em] ${
              status === "live"
                ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-100"
                : "border-white/10 bg-white/[0.03] text-white/62"
            }`}
            variant="outline"
          >
            {status === "live" ? "ao vivo" : "roadmap"}
          </Badge>
        </div>
        <div className="space-y-2">
          <h3 className="font-display text-2xl tracking-[-0.04em] text-white">{title}</h3>
          <p className="text-sm leading-7 text-white/58">{description}</p>
        </div>
        <div className={`${subtlePanelClass} mt-auto p-4`}>
          <p className="text-xs uppercase tracking-[0.22em] text-white/42">Leitura rapida</p>
          <p className="mt-2 text-sm font-medium text-white">{preview}</p>
        </div>
      </div>
    </button>
  );
}

function RoadmapModule({ moduleKey }: { moduleKey: Exclude<ModuleKey, "overview" | "now" | "top"> }) {
  const copy = ROADMAP_COPY[moduleKey];

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <Card className={`${surfaceCardClass} overflow-hidden`}>
        <CardHeader className="border-b border-white/8 pb-6">
          <div className="flex flex-wrap gap-2">
            <Badge className="rounded-full border-white/10 bg-white/[0.03] px-3 py-1 text-white/70" variant="outline">
              {copy.badge}
            </Badge>
            <Badge className="rounded-full border-white/10 bg-white/[0.03] px-3 py-1 text-white/70" variant="outline">
              proxima entrega
            </Badge>
          </div>
          <CardTitle className="font-display text-3xl tracking-[-0.04em] text-white">{copy.title}</CardTitle>
          <CardDescription className="max-w-3xl text-base leading-7 text-white/60">{copy.description}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 pt-6">
          {copy.outputs.map((output) => (
            <div className={`${subtlePanelClass} p-4`} key={output}>
              <p className="text-sm font-medium text-white">{output}</p>
              <p className="mt-2 text-sm leading-6 text-white/56">
                Estrutura pensada para entrar como modulo isolado, sem pesar o overview do produto.
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

     
    </div>
  );
}

export default function DashboardClient({ initialRange }: DashboardClientProps) {
  const router = useRouter();
  const [activeModule, setActiveModule] = useState<ModuleKey>("overview");
  const [selectedRange, setSelectedRange] = useState<TimeRange>(initialRange);
  const [overviewState, setOverviewState] = useState<ModuleState<OverviewData>>(createModuleState());
  const [nowState, setNowState] = useState<ModuleState<NowData>>(createModuleState());
  const [topStates, setTopStates] = useState<Record<TimeRange, ModuleState<TopData>>>({
    short_term: createModuleState<TopData>(),
    medium_term: createModuleState<TopData>(),
    long_term: createModuleState<TopData>(),
  });

  const fetchModuleJson = useCallback(async <T,>(url: string) => {
    const response = await fetch(url, {
      cache: "no-store",
      credentials: "include",
    });

    if (response.status === 401) {
      window.location.assign("/");
      throw new Error("Sua sessao expirou. Conecte o Spotify novamente.");
    }

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as { error?: string } | null;
      throw new Error(body?.error ?? "Nao foi possivel carregar este modulo.");
    }

    return (await response.json()) as T;
  }, []);

  const loadOverview = useCallback(
    async (force = false) => {
      if (!force && (overviewState.status === "loading" || overviewState.status === "ready")) {
        return;
      }

      setOverviewState((current) => ({
        ...current,
        status: "loading",
        error: null,
      }));

      try {
        const data = await fetchModuleJson<OverviewData>("/api/spotify/overview");
        setOverviewState({
          status: "ready",
          data,
          error: null,
        });
      } catch (error) {
        setOverviewState((current) => ({
          ...current,
          status: "error",
          error: error instanceof Error ? error.message : "Falha ao carregar perfil e contexto.",
        }));
      }
    },
    [fetchModuleJson, overviewState.status],
  );

  const loadNow = useCallback(
    async (force = false) => {
      if (!force && (nowState.status === "loading" || nowState.status === "ready")) {
        return;
      }

      setNowState((current) => ({
        ...current,
        status: "loading",
        error: null,
      }));

      try {
        const data = await fetchModuleJson<NowData>("/api/spotify/now");
        setNowState({
          status: "ready",
          data,
          error: null,
        });
      } catch (error) {
        setNowState((current) => ({
          ...current,
          status: "error",
          error: error instanceof Error ? error.message : "Falha ao carregar o playback atual.",
        }));
      }
    },
    [fetchModuleJson, nowState.status],
  );

  const loadTop = useCallback(
    async (range: TimeRange, force = false) => {
      const currentState = topStates[range];

      if (!force && (currentState.status === "loading" || currentState.status === "ready")) {
        return;
      }

      setTopStates((current) => ({
        ...current,
        [range]: {
          ...current[range],
          status: "loading",
          error: null,
        },
      }));

      try {
        const data = await fetchModuleJson<TopData>(`/api/spotify/top?range=${range}&limit=12`);
        setTopStates((current) => ({
          ...current,
          [range]: {
            status: "ready",
            data,
            error: null,
          },
        }));
      } catch (error) {
        setTopStates((current) => ({
          ...current,
          [range]: {
            ...current[range],
            status: "error",
            error: error instanceof Error ? error.message : "Falha ao carregar os tops.",
          },
        }));
      }
    },
    [fetchModuleJson, topStates],
  );

  useEffect(() => {
    void loadOverview();
    void loadNow();
  }, [loadNow, loadOverview]);

  useEffect(() => {
    if (activeModule === "top") {
      void loadTop(selectedRange);
    }
  }, [activeModule, loadTop, selectedRange]);

  const handleRangeChange = (range: TimeRange) => {
    setSelectedRange(range);
    setActiveModule("top");
    router.replace(`/dashboard?range=${range}`, { scroll: false });
    void loadTop(range);
  };

  const logout = () => {
    window.location.assign("/api/auth/logout");
  };

  const cardPreviews = useMemo<Record<ModuleKey, string>>(
    () => ({
      overview: overviewState.data
        ? `${overviewState.data.profile.name} - ${overviewState.data.devices.length} devices visiveis`
        : overviewState.status === "loading"
          ? "carregando conta e devices..."
          : "perfil, pais, plano e devices em um bloco leve",
      now: nowState.data?.current?.track
        ? `${nowState.data.current.track.name} tocando agora`
        : nowState.status === "loading"
          ? "sincronizando now playing..."
          : "agora tocando + ultimas 20 reproducoes",
      top: topStates[selectedRange].data?.artists[0]
        ? `${topStates[selectedRange].data?.artists[0].name} lidera em ${selectedRange}`
        : topStates[selectedRange].status === "loading"
          ? "buscando tops sob demanda..."
          : "abre quando o usuario quiser explorar ranking",
      dna: "features em lote e analise pesada so ao clicar",
      playlists: "geracao de playlist e embed no mesmo fluxo",
      recommendations: "seeds usando top + recent para sugestoes melhores",
      discovery: "busca e detalhe de artista sem pesar o overview",
    }),
    [nowState, overviewState, selectedRange, topStates],
  );

  const activeTopState = topStates[selectedRange];

  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <motion.div animate="visible" className="mx-auto flex max-w-7xl flex-col gap-4" initial="hidden" variants={containerVariants}>
        <motion.section variants={itemVariants}>
          <Card className={`${surfaceCardClass} overflow-hidden`}>
            <CardHeader className="border-b border-white/8 pb-6">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <Badge className="rounded-full border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-emerald-100" variant="outline">
                      dashboard modular
                    </Badge>
                    <Badge className="rounded-full border-white/10 bg-white/[0.03] px-3 py-1 text-white/70" variant="outline">
                      overview + now no primeiro carregamento
                    </Badge>
                    <Badge className="rounded-full border-white/10 bg-white/[0.03] px-3 py-1 text-white/70" variant="outline">
                      top sob demanda
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <CardTitle className="font-display text-4xl leading-tight tracking-[-0.05em] text-white sm:text-5xl">
                      Seu Spotify agora abre como produto: leve no inicio, profundo quando voce quiser.
                    </CardTitle>
                    <CardDescription className="max-w-3xl text-base leading-8 text-white/62">
                      O hub virou uma camada de navegação. Em vez de despejar tudo numa tela so, a entrada mostra poucos cards claros e cada modulo busca dados apenas quando faz sentido.
                    </CardDescription>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-3 xl:min-w-[360px]">
                  <div className={`${subtlePanelClass} p-4`}>
                    <p className="text-xs uppercase tracking-[0.22em] text-white/42">Modulos ao vivo</p>
                    <p className="mt-3 font-display text-3xl tracking-[-0.04em] text-white">3</p>
                    <p className="mt-2 text-sm text-white/56">Perfil, Agora e Top.</p>
                  </div>
                  <div className={`${subtlePanelClass} p-4`}>
                    <p className="text-xs uppercase tracking-[0.22em] text-white/42">Roadmap pronto</p>
                    <p className="mt-3 font-display text-3xl tracking-[-0.04em] text-white">4</p>
                    <p className="mt-2 text-sm text-white/56">DNA, playlists, recomendacoes e descoberta.</p>
                  </div>
                  <div className={`${subtlePanelClass} p-4`}>
                    <p className="text-xs uppercase tracking-[0.22em] text-white/42">Auth</p>
                    <p className="mt-3 text-lg font-medium text-white">Scopes ampliados</p>
                    <p className="mt-2 text-sm text-white/56">Playback e playlists ja preparados.</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 pt-6 sm:flex-row">
              <Button className="rounded-full bg-white text-slate-950 hover:bg-white/90" onClick={() => setActiveModule("overview")}>
                Abrir overview
              </Button>
              <Button className="rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.07]" onClick={() => setActiveModule("top")} variant="outline">
                Explorar tops
              </Button>
              <Button className="rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.07]" onClick={() => {
                void loadOverview(true);
                void loadNow(true);
                if (activeModule === "top") {
                  void loadTop(selectedRange, true);
                }
              }} variant="outline">
                <RefreshCw className="size-4" />
                Atualizar
              </Button>
              <Button className="rounded-full border-white/10 bg-white/[0.03] text-white hover:bg-white/[0.07]" onClick={logout} variant="outline">
                <LogOut className="size-4" />
                Desconectar
              </Button>
            </CardContent>
          </Card>
        </motion.section>

        <motion.section variants={itemVariants}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {MODULE_CARDS.map((module) => (
              <ModuleCard
                active={activeModule === module.key}
                description={module.description}
                icon={module.icon}
                key={module.key}
                onClick={() => {
                  setActiveModule(module.key);
                  if (module.key === "top") {
                    void loadTop(selectedRange);
                  }
                }}
                preview={cardPreviews[module.key]}
                status={module.status}
                title={module.title}
              />
            ))}
          </div>
        </motion.section>

        <motion.section variants={itemVariants}>
          {activeModule === "overview" ? <OverviewModule onRetry={() => void loadOverview(true)} state={overviewState} /> : null}
          {activeModule === "now" ? <NowModule onRetry={() => void loadNow(true)} state={nowState} /> : null}
          {activeModule === "top" ? (
            <TopModule
              onRangeChange={handleRangeChange}
              onRetry={() => void loadTop(selectedRange, true)}
              selectedRange={selectedRange}
              state={activeTopState}
            />
          ) : null}
          {activeModule === "dna" || activeModule === "playlists" || activeModule === "recommendations" || activeModule === "discovery" ? (
            <RoadmapModule moduleKey={activeModule} />
          ) : null}
        </motion.section>

        <motion.section variants={itemVariants}>
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              "Overview e Now entram primeiro para a experiencia ficar viva sem pesar o carregamento.",
              "Top virou modulo independente e so busca quando o usuario abre a area.",
              "Os proximos blocos ja tem contrato de API definido para evoluir sem reescrever o hub.",
            ].map((text, index) => (
              <Card className={surfaceCardClass} key={text}>
                <CardContent className="flex items-center gap-3 px-5 py-5 text-sm leading-6 text-white/62">
                  {index === 0 ? (
                    <LayoutPanelLeft className="size-4 text-emerald-300" />
                  ) : index === 1 ? (
                    activeTopState.status === "loading" ? <LoaderCircle className="size-4 animate-spin text-cyan-300" /> : <BarChart3 className="size-4 text-cyan-300" />
                  ) : (
                    <Sparkles className="size-4 text-violet-300" />
                  )}
                  {text}
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>
      </motion.div>
    </main>
  );
}
