"use client";

import { useEffect } from "react";
import { useSound } from "@/components/site/sound-provider";

/** Reação da torcida ao abrir um campeonato com medalhas — somente se o som estiver ativado. */
export function CrowdOnView() {
  const { enabled, play } = useSound();
  useEffect(() => {
    if (!enabled) return;
    const id = window.setTimeout(() => play("crowd", 0.8), 600);
    return () => window.clearTimeout(id);
  }, [enabled, play]);
  return null;
}
