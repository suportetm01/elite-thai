import { cn } from "@/lib/utils";

/** Faixa contínua de palavras-chave (decorativa: o conteúdo existe no restante da página). */
export function MarqueeStrip({ items, className, slow }: { items: string[]; className?: string; slow?: boolean }) {
  if (!items.length) return null;
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <li key={`${item}-${i}`} className="flex items-center gap-6 px-6">
          <span className="text-blood" aria-hidden>
            ★
          </span>
          <span className="whitespace-nowrap font-[family-name:var(--font-barlow)] text-lg font-bold uppercase tracking-[0.2em] text-white/90">{item}</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className={cn("relative overflow-hidden border-y border-white/[0.06] bg-[linear-gradient(90deg,#0d0d0d,#1a080a_50%,#0d0d0d)] py-4", className)}>
      <div className={cn("marquee-track flex w-max", slow && "[animation-duration:60s]")}>
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
