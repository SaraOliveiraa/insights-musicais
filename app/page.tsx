"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const featureCards = [
  {
    title: "OAuth 2.0 sem friccao",
    description: "Fluxo de autenticacao com Spotify para transformar login em acesso imediato aos dados reais do usuario.",
  },
  {
    title: "Leitura visual premium",
    description: "Cards, hierarquia tipografica e contraste forte para parecer produto pronto, nao projeto academico.",
  },
  {
    title: "Insights orientados a repertorio",
    description: "Artistas, musicas, generos e sinais de comportamento apresentados como narrativa de consumo.",
  },
];

const proofPoints = [
  "Next.js App Router",
  "Spotify Web API",
  "Framer Motion",
  "Tailwind CSS v4",
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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
      duration: 0.65,
      ease: smoothEase,
    },
  },
};

export default function HomePage() {
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-5 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="mesh-orb absolute left-[-8%] top-10 h-72 w-72 rounded-full bg-emerald-400/16 blur-3xl" />
        <div className="mesh-orb absolute right-[-10%] top-24 h-[28rem] w-[28rem] rounded-full bg-orange-200/12 blur-3xl [animation-delay:-7s]" />
        <div className="mesh-orb absolute bottom-[-16%] left-1/2 h-80 w-80 rounded-full bg-cyan-300/12 blur-3xl [animation-delay:-12s]" />
      </div>

      <motion.div
        animate="visible"
        className="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-7xl flex-col gap-6"
        initial="hidden"
        variants={containerVariants}
      >
        <motion.header className="glass-card flex items-center justify-between gap-4 px-5 py-4 sm:px-6" variants={itemVariants}>
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-white/42">Portfolio project</p>
            <h1 className="mt-2 font-display text-xl tracking-[-0.06em] text-white sm:text-2xl">Insights Musicais</h1>
          </div>
          <span className="hero-chip">Spotify dashboard</span>
        </motion.header>

        <div className="grid flex-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.section className="glass-card relative overflow-hidden p-7 sm:p-10" variants={itemVariants}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(124,252,203,0.16),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(251,191,36,0.12),_transparent_25%)]" />
            <div className="relative">
              <div className="flex flex-wrap gap-3">
                {proofPoints.map((point) => (
                  <span className="hero-chip" key={point}>
                    {point}
                  </span>
                ))}
              </div>

              <h2 className="mt-8 max-w-4xl font-display text-5xl tracking-[-0.09em] text-white sm:text-6xl lg:text-7xl">
                Dashboard em Next.js para traduzir habitos musicais em percepcao de produto.
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-8 text-white/64 sm:text-lg">
                Autenticacao OAuth 2.0 com Spotify, integracao direta com a Web API e uma interface criada para impressionar recrutadores com leitura clara, movimento e identidade propria.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-100"
                  href="/api/auth/login"
                >
                  Entrar com Spotify
                </Link>
                <Link
                  className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition hover:border-white/28 hover:bg-white/[0.08]"
                  href="/dashboard"
                >
                  Abrir dashboard
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/42">Experiencia</p>
                  <strong className="mt-3 block font-display text-3xl tracking-[-0.06em] text-white">Animada</strong>
                  <p className="mt-2 text-sm text-white/56">Entrada em camadas, hover sutil e leitura fluida em desktop e mobile.</p>
                </div>
                <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/42">Dados</p>
                  <strong className="mt-3 block font-display text-3xl tracking-[-0.06em] text-white">Reais</strong>
                  <p className="mt-2 text-sm text-white/56">Nada mockado: artistas, faixas e perfil vem direto do Spotify autenticado.</p>
                </div>
                <div className="rounded-[26px] border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-xs uppercase tracking-[0.28em] text-white/42">Objetivo</p>
                  <strong className="mt-3 block font-display text-3xl tracking-[-0.06em] text-white">Portfolio</strong>
                  <p className="mt-2 text-sm text-white/56">Estrutura pronta para demonstrar design, integracao e criterio de execucao.</p>
                </div>
              </div>
            </div>
          </motion.section>

          <motion.aside className="grid gap-4" variants={itemVariants}>
            {featureCards.map((card, index) => (
              <motion.article
                className="glass-card flex flex-col justify-between p-6"
                key={card.title}
                transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 20 }}
                whileHover={reducedMotion ? undefined : { y: -6 }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.28em] text-white/42">0{index + 1}</span>
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-300 shadow-[0_0_18px_rgba(110,231,183,0.8)]" />
                </div>
                <div className="mt-8">
                  <h3 className="font-display text-3xl tracking-[-0.06em] text-white">{card.title}</h3>
                  <p className="mt-4 text-sm leading-7 text-white/60">{card.description}</p>
                </div>
              </motion.article>
            ))}
          </motion.aside>
        </div>
      </motion.div>
    </main>
  );
}
