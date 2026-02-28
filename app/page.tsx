"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Disc3, LayoutDashboard, ListMusic, ShieldCheck, Sparkles, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const heroHighlights = [
  {
    title: "Visao geral imediata",
    description: "Abra o painel e veja em segundos o que dominou sua escuta recente.",
    icon: LayoutDashboard,
  },
  {
    title: "Listas organizadas",
    description: "Artistas e faixas aparecem em blocos alinhados, simples de comparar e navegar.",
    icon: ListMusic,
  },
  {
    title: "Conta conectada",
    description: "Acesse seus dados do Spotify de forma segura e com leitura clara.",
    icon: ShieldCheck,
  },
];

const insightItems = [
  {
    title: "Top artistas",
    description: "Veja quem mais apareceu na sua fase atual.",
    icon: UserRound,
  },
  {
    title: "Top faixas",
    description: "Entenda o que mais voltou para o replay.",
    icon: Disc3,
  },
  {
    title: "Generos em destaque",
    description: "Perceba se sua escuta esta mais focada ou diversa.",
    icon: Sparkles,
  },
  {
    title: "Resumo pessoal",
    description: "Tenha uma leitura direta do seu momento musical.",
    icon: BarChart3,
  },
];

const onboardingSteps = [
  {
    step: "01",
    title: "Conecte sua conta",
    description: "Entre com o Spotify para liberar seus dados de escuta.",
  },
  {
    step: "02",
    title: "Abra o painel",
    description: "Acesse uma grade organizada com artistas, faixas e generos.",
  },
  {
    step: "03",
    title: "Explore sua rotina",
    description: "Descubra o que define sua fase musical com mais contexto.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.06,
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

const surfaceCardClass = "rounded-xl border-white/10 bg-[#0d1420]/88 shadow-[0_14px_34px_rgba(2,6,23,0.24)] backdrop-blur-sm";

const subtlePanelClass = "rounded-lg border border-white/8 bg-white/[0.03]";

export default function HomePage() {
  return (
    <main className="min-h-screen px-4 py-4 sm:px-6 lg:px-8">
      <motion.div animate="visible" className="mx-auto flex max-w-7xl flex-col gap-4" initial="hidden" variants={containerVariants}>
      

        <div className="grid gap-4 lg:grid-cols-12">
          <motion.section className="lg:col-span-7" variants={itemVariants}>
            <Card className={`${surfaceCardClass} h-full`}>
              <CardHeader className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge className="rounded-md border-white/10 bg-white/[0.03] text-white/70" variant="outline">
                    Top artistas
                  </Badge>
                  <Badge className="rounded-md border-white/10 bg-white/[0.03] text-white/70" variant="outline">
                    Top faixas
                  </Badge>
                  <Badge className="rounded-md border-white/10 bg-white/[0.03] text-white/70" variant="outline">
                    Generos em alta
                  </Badge>
                </div>
                <div className="space-y-4">
                  <CardTitle className="font-display text-4xl leading-tight tracking-[-0.04em] text-white sm:text-5xl">Seu Spotify, organizado em um painel que faz sentido.</CardTitle>
                  <CardDescription className="max-w-2xl text-base leading-8 text-white/64">
                    Conecte sua conta e acompanhe artistas, faixas e generos que mais aparecem na sua rotina com uma interface mais alinhada, clara e preparada para uso continuo.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild className="h-10 rounded-lg bg-emerald-400 px-5 text-slate-950 hover:bg-emerald-300">
                    <Link href="/api/auth/login">
                      Conectar Spotify
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                  <Button asChild className="h-10 rounded-lg border-white/10 bg-white/[0.03] px-5 text-white hover:bg-white/[0.06]" variant="outline">
                    <Link href="/dashboard">Ver painel</Link>
                  </Button>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                  {heroHighlights.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div className={`${subtlePanelClass} p-4`} key={item.title}>
                        <div className="mb-4 inline-flex rounded-lg border border-white/10 bg-white/[0.04] p-2 text-emerald-300">
                          <Icon className="size-4" />
                        </div>
                        <h3 className="font-medium text-white">{item.title}</h3>
                        <p className="mt-2 text-sm leading-6 text-white/58">{item.description}</p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.section>

          <div className="grid gap-4 lg:col-span-5 lg:auto-rows-fr">
            <motion.section variants={itemVariants}>
              <Card className={`${surfaceCardClass} h-full`}>
                <CardHeader>
                  <CardTitle className="font-display text-2xl text-white">O que voce encontra</CardTitle>
                  <CardDescription className="text-white/60">Um painel direto para acompanhar sua fase musical sem excesso de informacao.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3">
                  {insightItems.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div className={`${subtlePanelClass} flex items-start gap-3 p-4`} key={item.title}>
                        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-cyan-300">
                          <Icon className="size-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-white">{item.title}</h3>
                          <p className="mt-1 text-sm leading-6 text-white/56">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.section>

            <motion.section variants={itemVariants}>
              <Card className={`${surfaceCardClass} h-full`}>
                <CardHeader>
                  <CardTitle className="font-display text-2xl text-white">Como funciona</CardTitle>
                  <CardDescription className="text-white/60">Uma experiencia simples para entrar, ver seus dados e explorar sua rotina de escuta.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-3">
                  {onboardingSteps.map((item) => (
                    <div className={`${subtlePanelClass} flex gap-4 p-4`} key={item.step}>
                      <div className="font-display text-lg text-white/42">{item.step}</div>
                      <div>
                        <h3 className="text-sm font-medium text-white">{item.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-white/56">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.section>
          </div>
        </div>

        <motion.section variants={itemVariants}>
          <div className="grid gap-4 lg:grid-cols-3">
            {["Layout mais limpo para leitura rapida", "Componentes alinhados para desktop e mobile", "Dados reais do Spotify em uma experiencia organizada"].map((text, index) => (
              <Card className={surfaceCardClass} key={text}>
                <CardContent className="flex h-full items-center gap-3 px-5 py-5">
                  <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2 text-emerald-300">
                    {index === 0 ? <LayoutDashboard className="size-4" /> : index === 1 ? <Sparkles className="size-4" /> : <BarChart3 className="size-4" />}
                  </div>
                  <p className="text-sm leading-6 text-white/66">{text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>
      </motion.div>
    </main>
  );
}
