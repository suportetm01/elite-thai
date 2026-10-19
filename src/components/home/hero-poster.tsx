"use client";

import Image from "@/components/site/smart-image";
import { Emblem } from "@/components/brand/emblem";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { useEffect, useRef } from "react";

/** Poster imediato do Hero; o vídeo só começa depois de respeitar a preferência do usuário. */
export function HeroPoster({ videoUrl, posterUrl }: { videoUrl: string | null; posterUrl: string | null }) {
  const reducedMotion = useReducedMotionSafe();
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (reducedMotion) {
      video.current?.pause();
      return;
    }
    if (video.current) void video.current.play().catch(() => undefined);
  }, [reducedMotion, videoUrl]);

  if (reducedMotion && videoUrl && !posterUrl) {
    return (
      <div className="absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute right-[-10%] top-1/2 size-[70vmin] -translate-y-1/2 rounded-full bg-blood/25 blur-[120px]" />
        <div className="absolute right-[8%] top-1/2 hidden size-[46vmin] -translate-y-1/2 opacity-[0.16] md:block">
          <Emblem className="size-full" />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_70%_100%,rgba(255,230,204,0.08),transparent_60%)]" />
      </div>
    );
  }

  if (videoUrl) {
    return (
      <video
        ref={video}
        className="absolute inset-0 size-full object-cover opacity-70"
        src={videoUrl}
        poster={posterUrl ?? undefined}
        muted
        loop
        playsInline
        preload={reducedMotion ? "none" : "metadata"}
        aria-hidden
      />
    );
  }
  if (posterUrl) {
    // no celular a foto aparece inteira (sem zoom) logo abaixo do cabeçalho, com as duas pessoas;
    // no computador, ocupa a abertura toda
    return (
      <div className="absolute inset-x-0 top-16 aspect-square md:inset-0 md:aspect-auto">
        <Image src={posterUrl} alt="" fill priority sizes="100vw" className="object-cover object-[45%_30%] opacity-70 md:object-[50%_30%]" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden>
      <div className="absolute right-[-10%] top-1/2 size-[70vmin] -translate-y-1/2 rounded-full bg-blood/25 blur-[120px]" />
      <div className="absolute right-[8%] top-1/2 hidden size-[46vmin] -translate-y-1/2 opacity-[0.16] md:block">
        <Emblem className="size-full" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(ellipse_at_70%_100%,rgba(255,230,204,0.08),transparent_60%)]" />
    </div>
  );
}
