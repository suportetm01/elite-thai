import { Reveal } from "@/components/site/reveal";
import { cn } from "@/lib/utils";

export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  align = "left",
  className,
  as: Heading = "h2",
}: {
  index?: string;
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      <p className={cn("eyebrow flex items-center gap-3 text-gold", align === "center" && "justify-center")}>
        {index && <span className="text-blood">{index}</span>}
        <span className="h-px w-8 bg-gold/50" aria-hidden />
        {eyebrow}
      </p>
      <Heading className="display mt-4 text-[clamp(2.8rem,7vw,5.6rem)] text-white">{title}</Heading>
      {description && <div className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">{description}</div>}
    </Reveal>
  );
}

export function Section({ id, className, children, ...props }: React.ComponentProps<"section">) {
  return (
    <section id={id} className={cn("relative py-24 md:py-32", className)} {...props}>
      {children}
    </section>
  );
}

/** Cabeçalho das páginas internas — tipografia de pôster de luta. */
export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <header className="film-grain relative overflow-hidden border-b border-white/[0.06] pb-16 pt-40 md:pb-24 md:pt-48">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -right-40 -top-40 size-[640px] rounded-full bg-blood/20 blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 h-px w-2/3 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      </div>
      <div className="container-site relative">
        <SectionHeading as="h1" eyebrow={eyebrow} title={title} description={description} />
        {children}
      </div>
    </header>
  );
}

export function EmptyState({ title, children, icon }: { title: string; children?: React.ReactNode; icon?: React.ReactNode }) {
  return (
    <div className="panel cut-corner-br flex flex-col items-start gap-4 p-8 md:p-12">
      {icon && <div className="text-blood">{icon}</div>}
      <p className="display text-4xl text-white">{title}</p>
      {children && <div className="max-w-xl text-zinc-400">{children}</div>}
    </div>
  );
}
