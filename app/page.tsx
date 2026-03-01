"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  AudioWaveform,
  Compass,
  LayoutPanelLeft,
  ListMusic,
  LockKeyhole,
  Radio,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
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
      duration: 0.45,
      ease: smoothEase,
    },
  },
};

const surfaceCardClass = "rounded-[28px] border-white/10 bg-[#08111d]/88 shadow-[0_24px_80px_rgba(2,8,23,0.35)] backdrop-blur-md";
const subtlePanelClass = "rounded-2xl border border-white/8 bg-white/[0.035]";

const modules = [
  {
    title: "Perfil & Contexto",
    description: "Conta conectada, pais, plano, devices e status do player em um bloco leve.",
    icon: LayoutPanelLeft,
    status: "Ao vivo",
  },
  {
    title: "Agora",
    description: "Now playing e ultimas 20 reproducoes para dar vida ao app logo na entrada.",
    icon: Radio,
    status: "Ao vivo",
  },
  {
    title: "Top",
    description: "Top artists e top tracks com cache por periodo e carregamento sob demanda.",
    icon: Sparkles,
    status: "Ao vivo",
  },
  {
    title: "DNA Sonoro",
    description: "Audio features e analise sob demanda para aprofundar o comportamento musical.",
    icon: AudioWaveform,
    status: "Roadmap",
  },
  {
    title: "Playlists",
    description: "Geracao automatica de playlists para transformar insight em acao.",
    icon: ListMusic,
    status: "Roadmap",
  },
  {
    title: "Descoberta",
    description: "Busca, detalhe de artista e exploracao sem pesar o overview principal.",
    icon: Compass,
    status: "Roadmap",
  },
];

const steps = [
  {
    step: "01",
    title: "Conecte o Spotify",
    description: "OAuth com escopos claros para perfil, playback, tops e playlists.",
  },
  {
    step: "02",
    title: "Entre no hub modular",
    description: "O dashboard abre leve e deixa os modulos profundos para o momento certo.",
  },
  {
    step: "03",
    title: "Ative os blocos que importam",
    description: "Overview, agora, top e futuras automacoes entram sob demanda.",
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <motion.div animate="visible" className="mx-auto flex max-w-7xl flex-col gap-4" initial="hidden" variants={containerVariants}>
        <motion.section variants={itemVariants}>
          <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
            <Card className={`${surfaceCardClass} overflow-hidden`}>
              <CardHeader className="space-y-5 border-b border-white/8 pb-6">
                <div className="flex flex-wrap gap-2">
                  <Badge className="rounded-full border-emerald-300/20 bg-emerald-400/10 px-3 py-1 text-emerald-100" variant="outline">
                    Insights Musicais
                  </Badge>
                  <Badge className="rounded-full border-white/10 bg-white/[0.03] px-3 py-1 text-white/70" variant="outline">
                    produto modular para Spotify
                  </Badge>
                </div>
                <div className="space-y-4">
                  <CardTitle className="font-display text-4xl leading-tight tracking-[-0.05em] text-white sm:text-6xl">
                    Seu Spotify em uma plataforma que abre leve e aprofunda so quando voce quiser.
                  </CardTitle>
                  <CardDescription className="max-w-3xl text-base leading-8 text-white/62">
                    Em vez de uma tela unica carregada de cards, o produto entra com contexto, now playing e um hub de modulos. Depois disso, tops, DNA, playlists e descoberta aparecem sob demanda.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild className="h-11 rounded-full bg-white px-6 text-slate-950 hover:bg-white/90">
                    <Link href="/api/auth/login">
                      Conectar com Spotify
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button asChild className="h-11 rounded-full border-white/10 bg-white/[0.03] px-6 text-white hover:bg-white/[0.07]" variant="outline">
                    <Link href="/dashboard">Ver hub modular</Link>
                  </Button>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  {[
                    "Entrada leve com contexto e now playing",
                    "Modulos profundos ativados so quando o usuario abre",
                    "Base pronta para playlists, recomendacoes e descoberta",
                  ].map((text) => (
                    <div className={`${subtlePanelClass} p-4`} key={text}>
                      <p className="text-sm leading-7 text-white/62">{text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className={`${surfaceCardClass} overflow-hidden`}>
              <CardHeader className="border-b border-white/8 pb-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle className="font-display text-3xl tracking-[-0.04em] text-white">Conexao com cara de produto</CardTitle>
                    <CardDescription className="mt-2 text-base leading-7 text-white/60">
                      A primeira impressao agora explica o valor do app, o que sera lido da conta e por que isso melhora a experiencia.
                    </CardDescription>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-emerald-200">
                    <LockKeyhole className="size-5" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3 pt-6">
                <div className={`${subtlePanelClass} flex items-start gap-3 p-4`}>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-emerald-300">
                    <ShieldCheck className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Escopos preparados</p>
                    <p className="mt-1 text-sm leading-6 text-white/56">Perfil, playback, historico recente, tops e playlists privadas.</p>
                  </div>
                </div>
                <div className={`${subtlePanelClass} flex items-start gap-3 p-4`}>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-cyan-300">
                    <Radio className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Entrada viva</p>
                    <p className="mt-1 text-sm leading-6 text-white/56">Assim que a conta conecta, overview e now playing contam uma historia imediatamente.</p>
                  </div>
                </div>
                <div className={`${subtlePanelClass} flex items-start gap-3 p-4`}>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-2 text-violet-300">
                    <Sparkles className="size-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">Arquitetura pronta para evoluir</p>
                    <p className="mt-1 text-sm leading-6 text-white/56">Cada modulo fica em rota propria de API e entra no momento certo.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        <motion.section variants={itemVariants}>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {modules.map((module) => {
              const Icon = module.icon;

              return (
                <Card className={surfaceCardClass} key={module.title}>
                  <CardContent className="space-y-4 px-5 py-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-white/72">
                        <Icon className="size-5" />
                      </div>
                      <Badge
                        className={`rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.22em] ${
                          module.status === "Ao vivo"
                            ? "border-emerald-300/20 bg-emerald-400/10 text-emerald-100"
                            : "border-white/10 bg-white/[0.03] text-white/62"
                        }`}
                        variant="outline"
                      >
                        {module.status}
                      </Badge>
                    </div>
                    <div>
                      <h3 className="font-display text-2xl tracking-[-0.04em] text-white">{module.title}</h3>
                      <p className="mt-2 text-sm leading-7 text-white/58">{module.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.section>

        <motion.section variants={itemVariants}>
          <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
            <Card className={`${surfaceCardClass} overflow-hidden`}>
              <CardHeader className="border-b border-white/8 pb-6">
                <CardTitle className="font-display text-3xl tracking-[-0.04em] text-white">Como o fluxo ficou melhor</CardTitle>
                <CardDescription className="text-base leading-7 text-white/60">
                  Menos cara de prototipo e mais cara de plataforma: narrativa clara, conexao segura e profundidade distribuida em modulos.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 pt-6">
                {steps.map((step) => (
                  <div className={`${subtlePanelClass} flex gap-4 p-4`} key={step.step}>
                    <div className="font-display text-xl text-white/42">{step.step}</div>
                    <div>
                      <p className="text-sm font-medium text-white">{step.title}</p>
                      <p className="mt-1 text-sm leading-6 text-white/56">{step.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className={`${surfaceCardClass} overflow-hidden`}>
              <CardHeader className="border-b border-white/8 pb-6">
                <CardTitle className="font-display text-3xl tracking-[-0.04em] text-white">O que muda na pratica</CardTitle>
                <CardDescription className="text-base leading-7 text-white/60">
                  O produto ja comunica a estrategia modular logo na home, antes mesmo do usuario conectar a conta.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 pt-6 md:grid-cols-2">
                {[
                  "Landing com proposta de valor forte e foco no uso real.",
                  "CTA principal de conexao apoiado por explicacao de escopos.",
                  "Preview dos modulos para o usuario entender o que vai ganhar.",
                  "Transicao mais clara entre conectar, entrar no hub e explorar dados.",
                ].map((text) => (
                  <div className={`${subtlePanelClass} p-4`} key={text}>
                    <p className="text-sm leading-7 text-white/58">{text}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </motion.section>
      </motion.div>
    </main>
  );
}
