"use client";

import { motion, type Variants } from "motion/react";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";
import { cn } from "@/lib/utils";

/**
 * Manchete revelada linha a linha: cada linha sobe por trás de uma máscara. O gatilho fica
 * no título inteiro, que é o elemento visível para o observador. Com "reduzir movimento"
 * as linhas apenas aparecem.
 */
export function RevealLines({ lines, as = "h2", className, id }: { lines: React.ReactNode[]; as?: "h1" | "h2"; className?: string; id?: string }) {
  const reduce = useReducedMotionSafe();
  const Heading = as === "h1" ? motion.h1 : motion.h2;
  const line: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.6 } } }
    : {
        hidden: { opacity: 0, y: "100%" },
        show: { opacity: 1, y: "0%", transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
      };
  return (
    <Heading
      id={id}
      className={cn("display", className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.12 } } }}
    >
      {lines.map((content, i) => (
        // folga no topo da máscara para os acentos das maiúsculas (HISTÓRIA)
        <span key={i} className="-mt-[0.16em] block overflow-hidden pb-[0.06em] pt-[0.16em]">
          <motion.span className="block will-change-transform" variants={line}>
            {content}
            {/* espaço entre linhas para leitores de tela ("Cada medalha tem história") */}
            {i < lines.length - 1 && " "}
          </motion.span>
        </span>
      ))}
    </Heading>
  );
}
