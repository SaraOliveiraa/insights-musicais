import type { Metadata } from "next";
import { DM_Sans, Geist_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const bodyFont = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
});

const displayFont = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const monoFont = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Insights Musicais",
    template: "%s | Insights Musicais",
  },
  description:
    "Plataforma modular para Spotify com overview leve, now playing em tempo real e modulos de descoberta acionados sob demanda.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className="dark" lang="pt-BR">
      <body className={`${bodyFont.variable} ${displayFont.variable} ${monoFont.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
