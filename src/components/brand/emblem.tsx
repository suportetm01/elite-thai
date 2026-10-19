import Image from "@/components/site/smart-image";
import { cn } from "@/lib/utils";

/** Logo oficial (selo circular com fundo transparente): WebP leve para o site e PNG para ícones e buscadores. */
export const LOGO_SRC = "/images/logo-elite-thai.webp";
export const LOGO_PNG = "/images/logo-elite-thai.png";

/**
 * Logo oficial da Elite Thai (selo com o guerreiro espartano). O tamanho vem da classe
 * (ex.: `size-24`); o selo é sempre quadrado e mantém a proporção.
 */
export function Emblem({ className, title = "Elite Thai", priority }: { className?: string; title?: string; priority?: boolean }) {
  return (
    <span role="img" aria-label={title} className={cn("relative block aspect-square shrink-0", className)}>
      <Image src={LOGO_SRC} alt="" fill sizes="(min-width: 1024px) 320px, 240px" className="object-contain" priority={priority} />
    </span>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("flex flex-col leading-none", className)}>
      <span className="display text-[1.55rem] tracking-[0.06em] text-white">
        Elite <span className="text-blood">Thai</span>
      </span>
      <span className="eyebrow mt-0.5 text-[0.55rem] tracking-[0.32em] text-gold">Centro de Artes Marciais</span>
    </span>
  );
}
