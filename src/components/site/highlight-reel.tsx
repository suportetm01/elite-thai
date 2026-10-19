"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { cn } from "@/lib/utils";

const control = "grid size-10 place-items-center rounded-full border border-white/15 bg-black/50 text-white backdrop-blur transition-colors hover:bg-blood focus-visible:bg-blood";

/**
 * Vídeo vertical (formato reels). Só começa a baixar quando o visitante se aproxima, toca
 * sem som enquanto está visível e pausa fora da tela. Som e pausa ficam nos botões; com
 * "reduzir movimento" não toca sozinho, espera o play.
 */
export function HighlightReel({ src, poster, label, className }: { src: string; poster: string; label: string; className?: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotionSafe();
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(false);
  const [choice, setChoice] = useState<"auto" | "play" | "pause">("auto");
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const shouldPlay = visible && (choice === "play" || (choice === "auto" && !reduce));

  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const approach = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setNear(true);
        approach.disconnect();
      },
      { rootMargin: "800px 0px" },
    );
    const view = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.35 });
    approach.observe(el);
    view.observe(el);
    return () => {
      approach.disconnect();
      view.disconnect();
    };
  }, []);

  useEffect(() => {
    const v = video.current;
    if (v) v.muted = muted;
  }, [muted]);

  useEffect(() => {
    const v = video.current;
    if (!v || !near) return;
    // navegador bloqueou a reprodução automática: fica no play manual
    if (shouldPlay) v.play().catch((err: DOMException) => err.name === "NotAllowedError" && setChoice("pause"));
    else v.pause();
  }, [near, shouldPlay]);

  const togglePlay = () => setChoice(playing ? "pause" : "play");
  const toggleSound = () => {
    setMuted((m) => !m);
    if (muted && !playing) setChoice("play");
  };

  return (
    <div
      ref={frame}
      className={cn("relative aspect-[9/16] overflow-hidden rounded-[22px] border border-white/10 bg-black shadow-[0_40px_90px_-30px_rgba(227,38,54,0.5)]", className)}
    >
      <video
        ref={video}
        className="absolute inset-0 size-full object-cover"
        src={near ? src : undefined}
        poster={poster}
        preload="metadata"
        muted
        loop
        playsInline
        aria-label={label}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          if (bar.current && v.duration) bar.current.style.transform = `scaleX(${v.currentTime / v.duration})`;
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 to-transparent" aria-hidden />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/85 to-transparent" aria-hidden />

      <p className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-black/45 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.24em] text-white backdrop-blur">
        <span className={cn("size-2 rounded-full bg-blood", playing && "animate-pulse")} aria-hidden />
        Highlights
      </p>

      {!playing && (
        // alvo grande para o mouse/toque; leitores de tela usam o botão de play da barra
        <button type="button" onClick={togglePlay} className="absolute inset-0 grid place-items-center" tabIndex={-1} aria-hidden>
          <span className="grid size-16 place-items-center rounded-full bg-blood text-white shadow-[0_12px_40px_rgba(227,38,54,0.55)] transition-transform hover:scale-105">
            <Play className="ml-1 size-7 fill-current" aria-hidden />
          </span>
        </button>
      )}

      <div className="absolute inset-x-4 bottom-5 flex items-end justify-between gap-3">
        <p className="font-[family-name:var(--font-barlow)] text-sm font-bold uppercase tracking-[0.14em] text-white">@elite_thaii</p>
        <div className="flex gap-2">
          <button type="button" onClick={togglePlay} className={control} aria-label={playing ? "Pausar vídeo" : "Reproduzir vídeo"}>
            {playing ? <Pause className="size-4" aria-hidden /> : <Play className="size-4" aria-hidden />}
          </button>
          <button type="button" onClick={toggleSound} className={control} aria-label={muted ? "Ativar som do vídeo" : "Desativar som do vídeo"} aria-pressed={!muted}>
            {muted ? <VolumeX className="size-4" aria-hidden /> : <Volume2 className="size-4" aria-hidden />}
          </button>
        </div>
      </div>
      <span className="absolute inset-x-0 bottom-0 h-[3px] bg-white/10" aria-hidden>
        <span ref={bar} className="block h-full origin-left bg-blood" style={{ transform: "scaleX(0)" }} />
      </span>
    </div>
  );
}
