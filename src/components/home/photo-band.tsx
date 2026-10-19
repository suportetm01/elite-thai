"use client";

import { useRef, useSyncExternalStore } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Image from "@/components/site/smart-image";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

const DESKTOP = "(min-width: 768px)";
const subscribe = (cb: () => void) => {
  const media = window.matchMedia(DESKTOP);
  media.addEventListener("change", cb);
  return () => media.removeEventListener("change", cb);
};

/**
 * Faixa de foto em largura total entre seções: a imagem desliza mais devagar que a página
 * (paralaxe) e a frase fica por cima. No celular a foto fica num quadro 4:3 no topo (sem
 * zoom excessivo) e a frase logo abaixo; com "reduzir movimento" a foto fica parada.
 */
export function PhotoBand({ src, children }: { src: string; children: React.ReactNode }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotionSafe();
  const desktop = useSyncExternalStore(subscribe, () => window.matchMedia(DESKTOP).matches, () => false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={ref} className="relative isolate flex items-end overflow-hidden bg-ink md:min-h-[78vh]">
      <motion.div className="absolute inset-x-0 top-0 -z-10 aspect-[4/3] md:-inset-y-[12%] md:aspect-auto" style={reduce || !desktop ? undefined : { y }} aria-hidden>
        <Image src={src} alt="" fill sizes="100vw" className="object-cover object-[60%_40%]" />
      </motion.div>
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(11,11,11,0.55)_0%,rgba(11,11,11,0.15)_35%,rgba(11,11,11,0.7)_75%,#0b0b0b_100%)]" aria-hidden />
      <div className="absolute inset-0 -z-10 md:bg-[linear-gradient(90deg,rgba(11,11,11,0.75),transparent_65%)]" aria-hidden />
      <div className="container-site w-full pb-14 pt-[56vw] md:pb-24 md:pt-40">{children}</div>
    </section>
  );
}
