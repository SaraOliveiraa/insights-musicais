"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

const featureCards = [
  {
    title: "Tudo em um so lugar",
    description: "Veja artistas, musicas e generos favoritos em uma leitura clara, organizada e facil de explorar.",
  },
  {
    title: "Seu momento musical",
    description: "Entenda o que dominou seus ultimos dias com destaques, sinais de repeticao e tendencias pessoais.",
  },
  {
    title: "Feito para explorar",
    description: "Navegue pelos seus habitos de escuta com uma interface leve, responsiva e pensada para uso recorrente.",
  },
];

const proofPoints = [
  "Top artistas",
  "Top faixas",
  "Generos em alta",
  "Resumo pessoal",
];

const capabilityCards = [
  {
    title: "Visao geral",
    value: "Rapida",
    description: "Abra o painel e entenda em segundos o que mais marcou sua escuta recente.",
  },
  {
    title: "Tendencias",
    value: "Pessoais",
    description: "Acompanhe artistas, faixas e generos que mais aparecem no seu replay.",
  },
  {
    title: "Conta",
    value: "Segura",
    description: "Conecte sua conta do Spotify para ver seus dados com praticidade e controle.",
  },
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
      <motion.div
        animate="visible"
        className="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-7xl flex-col gap-6"
        initial="hidden"
        variants={containerVariants}
      >
        <motion.header
          className="glass-card flex items-center justify-between gap-4 px-5 py-4 sm:px-6"
          style={{ transformPerspective: 1400 }}
          transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 20 }}
          variants={itemVariants}
          whileHover={reducedMotion ? undefined : { y: -6, scale: 1.01, rotateX: 2 }}
        >
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-white/42">Experiencia musical pessoal</p>
            <h1 className="mt-2 font-display text-xl tracking-[-0.06em] text-white sm:text-2xl">Insights Musicais</h1>
          </div>
          <span className="hero-chip">Conectado ao Spotify</span>
        </motion.header>

        <div className="grid flex-1 gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <motion.section
            className="glass-card relative overflow-hidden p-7 sm:p-10"
            style={{ transformPerspective: 1400 }}
            transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 22 }}
            variants={itemVariants}
            whileHover={reducedMotion ? undefined : { y: -8, scale: 1.008, rotateX: 2.5, rotateY: -1.5 }}
          >
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
                Entenda o que define seu momento musical.
              </h2>

              <p className="mt-6 max-w-2xl text-base leading-8 text-white/64 sm:text-lg">
                Conecte sua conta do Spotify e acompanhe artistas, faixas e generos que mais aparecem na sua rotina com um painel claro, rapido e agradavel de usar.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-100"
                  href="/api/auth/login"
                >
                  Conectar Spotify
                </Link>
                <Link
                  className="inline-flex items-center justify-center rounded-full border border-white/14 bg-white/[0.04] px-6 py-3 text-sm font-semibold text-white transition hover:border-white/28 hover:bg-white/[0.08]"
                  href="/dashboard"
                >
                  Ver painel
                </Link>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                {capabilityCards.map((card) => (
                  <motion.div
                    className="subtle-panel rounded-[26px] p-5"
                    key={card.title}
                    style={{ transformPerspective: 1400 }}
                    transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 280, damping: 22 }}
                    whileHover={reducedMotion ? undefined : { y: -10, scale: 1.025, rotateX: 3 }}
                  >
                    <p className="text-xs uppercase tracking-[0.28em] text-white/42">{card.title}</p>
                    <strong className="mt-3 block font-display text-3xl tracking-[-0.06em] text-white">{card.value}</strong>
                    <p className="mt-2 text-sm text-white/56">{card.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          <motion.aside className="grid gap-4" variants={itemVariants}>
            {featureCards.map((card, index) => (
              <motion.article
                className="glass-card flex flex-col justify-between p-6"
                key={card.title}
                style={{ transformPerspective: 1400 }}
                transition={reducedMotion ? { duration: 0 } : { type: "spring", stiffness: 260, damping: 20 }}
                whileHover={reducedMotion ? undefined : { y: -10, scale: 1.02, rotateX: 3, rotateY: -2 }}
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
