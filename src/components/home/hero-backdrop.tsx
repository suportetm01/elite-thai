"use client";

import { useEffect, useRef } from "react";

/**
 * Fundo do Hero (poster, vídeo ou o emblema) e o progresso de rolagem da transição
 * Hero → História, publicado em `--hero-p` para o CSS escurecer o fundo e subir o texto.
 */
export function HeroBackdrop({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = ref.current?.closest("section");
    let frame = 0;
    const update = () => {
      frame = 0;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, -rect.top / Math.max(1, rect.height)));
      section.style.setProperty("--hero-p", progress.toFixed(3));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      {children}
    </div>
  );
}
