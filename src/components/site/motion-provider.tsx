"use client";

import { MotionConfig } from "motion/react";

/**
 * Com "reduzir movimento" ativo no aparelho, o Motion desliga deslocamentos e rotações
 * e mantém só as transições de opacidade — sem mudar o HTML renderizado no servidor.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
