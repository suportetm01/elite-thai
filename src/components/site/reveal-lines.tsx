"use client";

import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Manchete revelada linha a linha: cada linha sobe um pouco e aparece. Sem máscara de
 * recorte — se o aparelho estiver lento e a animação demorar, o texto nunca fica cortado.
 * O gatilho fica no título inteiro; com "reduzir movimento" o MotionProvider
 * (reducedMotion="user") tira o deslocamento e mantém só o fade.
 */
const line: Variants = {
  hidden: { opacity: 0, y: "0.35em" },
  show: { opacity: 1, y: "0em", transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
};

export function RevealLines({ lines, as = "h2", className, id }: { lines: React.ReactNode[]; as?: "h1" | "h2"; className?: string; id?: string }) {
  const Heading = as === "h1" ? motion.h1 : motion.h2;
  return (
    <Heading
      id={id}
      className={cn("display", className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1 } } }}
    >
      {lines.map((content, i) => (
        <motion.span key={i} className="block pb-[0.06em]" variants={line}>
          {content}
          {/* espaço entre linhas para leitores de tela ("Cada medalha tem história") */}
          {i < lines.length - 1 && " "}
        </motion.span>
      ))}
    </Heading>
  );
}
