"use client";

import { useEffect, useRef } from "react";

export default function GlowCursor() {
  const glowRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(pointer: fine)");
    let animationFrame = 0;
    let isEnabled = false;

    const setGlowPosition = (x: number, y: number) => {
      if (!glowRef.current) {
        return;
      }

      glowRef.current.style.setProperty("--glow-x", `${x}px`);
      glowRef.current.style.setProperty("--glow-y", `${y}px`);
    };

    const syncEnabledState = () => {
      isEnabled = mediaQuery.matches && window.innerWidth >= 1024;

      if (!glowRef.current) {
        return;
      }

      glowRef.current.style.opacity = isEnabled ? "1" : "0";

      if (isEnabled) {
        setGlowPosition(window.innerWidth / 2, window.innerHeight / 2);
      }
    };

    const handleMove = (event: MouseEvent) => {
      if (!isEnabled) {
        return;
      }

      cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        setGlowPosition(event.clientX, event.clientY);
      });
    };

    syncEnabledState();
    mediaQuery.addEventListener("change", syncEnabledState);
    window.addEventListener("resize", syncEnabledState);
    window.addEventListener("mousemove", handleMove);

    return () => {
      cancelAnimationFrame(animationFrame);
      mediaQuery.removeEventListener("change", syncEnabledState);
      window.removeEventListener("resize", syncEnabledState);
      window.removeEventListener("mousemove", handleMove);
    };
  }, []);

  return (
    <div
      className="glow-cursor pointer-events-none fixed inset-0 z-0"
      ref={glowRef}
    />
  );
}
