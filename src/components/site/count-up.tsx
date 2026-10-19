"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "motion/react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

/**
 * Número que conta de 0 até o valor ao entrar na tela. O HTML do servidor já traz o valor
 * final (sem JavaScript ou com "reduzir movimento", é isso que aparece).
 */
export function CountUp({ value, className, duration = 1.6 }: { value: number; className?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });
  const reduce = useReducedMotionSafe();
  const [shown, setShown] = useState(value);
  const started = useRef(false);

  useEffect(() => {
    if (reduce || started.current) return;
    if (!inView) {
      // ainda fora da tela: prepara a contagem (invisível para quem lê)
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShown(0);
      return;
    }
    started.current = true;
    const controls = animate(0, value, { duration, ease: [0.16, 1, 0.3, 1], onUpdate: (v) => setShown(Math.round(v)) });
    return () => controls.stop();
  }, [inView, reduce, value, duration]);

  return (
    <span ref={ref} className={className}>
      {shown.toLocaleString("pt-BR")}
    </span>
  );
}
