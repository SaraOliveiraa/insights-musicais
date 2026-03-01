import Image from "next/image";
import { AlertCircle, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const surfaceCardClass = "rounded-[28px] border-white/10 bg-[#08111d]/88 shadow-[0_24px_80px_rgba(2,8,23,0.35)] backdrop-blur-md";
export const subtlePanelClass = "rounded-2xl border border-white/8 bg-white/[0.035]";

export function formatNumber(value: number) {
  return new Intl.NumberFormat("pt-BR").format(value);
}

export function formatDuration(durationMs: number) {
  const totalMinutes = Math.round(durationMs / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes} min`;
  }

  return `${hours}h ${minutes.toString().padStart(2, "0")}min`;
}

export function formatRelativeTime(value: string | null) {
  if (!value) {
    return "agora";
  }

  const diffMs = new Date(value).getTime() - Date.now();
  const minutes = Math.round(diffMs / 60000);

  if (Math.abs(minutes) < 1) {
    return "agora";
  }

  if (Math.abs(minutes) < 60) {
    return new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" }).format(minutes, "minute");
  }

  const hours = Math.round(minutes / 60);

  if (Math.abs(hours) < 24) {
    return new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" }).format(hours, "hour");
  }

  const days = Math.round(hours / 24);
  return new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" }).format(days, "day");
}

export function capitalize(value: string) {
  if (!value) {
    return value;
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function SpotifyArtwork({
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
      <div className={`flex items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-sm font-semibold uppercase tracking-[0.24em] text-white/55 ${className ?? ""}`}>
        {fallback}
      </div>
    );
  }

  return <Image alt={alt} className={`rounded-2xl object-cover ${className ?? ""}`} height={height} sizes={sizes} src={src} width={width} />;
}

export function ModuleLoadingState({ title }: { title: string }) {
  return (
    <div className={`${subtlePanelClass} flex min-h-[260px] items-center justify-center gap-3 p-6 text-sm text-white/62`}>
      <LoaderCircle className="size-4 animate-spin text-emerald-300" />
      Carregando {title.toLowerCase()}...
    </div>
  );
}

export function ModuleErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className={`${subtlePanelClass} flex min-h-[260px] flex-col items-center justify-center gap-4 p-6 text-center`}>
      <div className="flex items-center gap-2 rounded-full border border-rose-300/20 bg-rose-400/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-rose-100">
        <AlertCircle className="size-3.5" />
        modulo indisponivel
      </div>
      <p className="max-w-lg text-sm leading-7 text-white/62">{message}</p>
      <Button className="rounded-full bg-white text-slate-950 hover:bg-white/90" onClick={onRetry}>
        Tentar novamente
      </Button>
    </div>
  );
}
