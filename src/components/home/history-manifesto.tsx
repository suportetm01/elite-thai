import Image from "@/components/site/smart-image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { RevealLines } from "@/components/site/reveal-lines";
import { Reveal, Stagger, StaggerItem } from "@/components/site/reveal";
import type { Settings } from "@/lib/data/public";
import { SITE_MEDIA } from "@/lib/site-media";
import { cn } from "@/lib/utils";

/**
 * Nossa história: rótulo numerado, manchete gigante revelada linha a linha à
 * esquerda e, à direita, a foto da academia, o texto de abertura e os fatos (modalidades,
 * turmas, local). Quando há marcos publicados, a linha do tempo aparece em cartões.
 * Texto, foto e marcos vêm de src/content.
 */

type Entry = { id: string; year: number; title: string; description: string | null; coverUrl?: string | null };

export function defaultStory(settings: Settings, modalities: string[]) {
  const list = modalities.length > 1 ? `${modalities.slice(0, -1).join(", ")} e ${modalities.at(-1)}` : modalities[0];
  return `Um ${settings.tagline.toLowerCase()} onde técnica se aprende com disciplina e respeito.${list ? ` ${list},` : ""} para crianças e adultos, do primeiro treino à competição.`;
}

/** "Kids · Adulto": da turma mais nova à adulta, a partir das turmas cadastradas nas modalidades. */
function audienceRange(audiences: string[]) {
  const find = (re: RegExp) => audiences.find((a) => re.test(a));
  const youngest = find(/kids|infantil|crian/i);
  const adult = find(/adult/i);
  if (youngest && adult) return `${youngest} · ${adult}`;
  return audiences.slice(0, 2).join(" · ") || null;
}

function TimelineFan({ entries }: { entries: Entry[] }) {
  const last = entries.slice(-5);
  return (
    <Stagger className="mt-20 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-6 [scrollbar-width:thin] lg:grid lg:snap-none lg:grid-cols-5 lg:overflow-visible" step={0.1}>
      {last.map((entry, i) => (
        <StaggerItem key={entry.id} className="w-[78vw] max-w-[320px] shrink-0 snap-start lg:w-auto lg:max-w-none">
          <div className={cn("card-dark relative flex h-full min-h-[300px] flex-col overflow-hidden rounded-[18px] p-6", i === last.length - 1 && "card-red mesh-red")}>
            {entry.coverUrl && (
              <div className="absolute inset-0 opacity-35">
                <Image src={entry.coverUrl} alt="" fill sizes="320px" className="object-cover" />
              </div>
            )}
            <p className="stat relative text-6xl text-white">
              {entry.year}
            </p>
            <p className="relative mt-auto font-[family-name:var(--font-barlow)] text-xl font-bold uppercase leading-tight tracking-wide text-white">
              {entry.title}
            </p>
            {entry.description && <p className="relative mt-2 line-clamp-3 text-sm leading-relaxed text-white/65">{entry.description}</p>}
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

/** A foto da equipe definida em src/content/site.ts tem prioridade sobre a foto padrão. */
function AcademyPhoto({ photo, name }: { photo: string | null; name: string }) {
  const { src, alt } = photo ? { src: photo, alt: `Equipe da ${name}` } : SITE_MEDIA.history;
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] border border-white/10">
      <div className="absolute inset-0">
        <Image src={src} alt={alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
      </div>
    </div>
  );
}

export function HistoryManifesto({
  settings,
  modalities,
  audiences,
  timeline,
  index = "01",
  as = "h2",
  showLink = true,
  showEntries = true,
  className,
}: {
  settings: Settings;
  modalities: string[];
  /** turmas cadastradas nas modalidades (ex.: Kids, Teens, Adulto, Feminino) */
  audiences: string[];
  timeline: Entry[];
  /** número da seção no rótulo (null = só o rótulo, nas páginas internas) */
  index?: string | null;
  as?: "h1" | "h2";
  showLink?: boolean;
  /** na página de história a linha do tempo completa aparece logo abaixo */
  showEntries?: boolean;
  className?: string;
}) {
  const place = [settings.neighborhood, [settings.city, settings.state].filter(Boolean).join("/")].filter(Boolean).join(", ");
  const story = settings.historySummary ?? settings.intro ?? defaultStory(settings, modalities);
  const turmas = audienceRange(audiences);
  const facts = [
    settings.foundedYear ? { k: "Desde", v: String(settings.foundedYear) } : null,
    modalities.length ? { k: "Modalidades", v: String(modalities.length).padStart(2, "0") } : null,
    turmas ? { k: "Turmas", v: turmas } : null,
    settings.city ? { k: "Onde", v: [settings.city, settings.state].filter(Boolean).join("/") } : null,
  ].filter((f): f is { k: string; v: string } => Boolean(f));

  return (
    <section aria-labelledby="manifesto-titulo" className={cn("relative overflow-hidden bg-ink py-24 md:py-32", className)}>
      <div className="container-site relative">
        <Reveal>
          <p className="eyebrow flex items-center gap-3 text-gold">
            {index && <span className="text-blood">{index}</span>}
            <span className="h-px w-12 bg-gold/50" aria-hidden />
            Nossa história
          </p>
        </Reveal>

        <div className="mt-10 grid gap-12 lg:mt-12 lg:grid-cols-2 lg:items-end lg:gap-16">
          <RevealLines
            id="manifesto-titulo"
            as={as}
            className="text-[clamp(3.8rem,9.4vw,9.25rem)] leading-[0.86] text-[#f2eee6]"
            lines={[
              "Aqui,",
              <span key="accent" className="text-blood">
                disciplina
              </span>,
              "vem antes",
              "do talento.",
            ]}
          />

          <Reveal delay={0.1} className="min-w-0">
            <AcademyPhoto photo={settings.teamPhotoUrl} name={settings.name} />
            <p className="mt-7 max-w-xl whitespace-pre-line text-[0.95rem] leading-relaxed text-zinc-400">
              <strong className="font-semibold text-white">
                {settings.name}
                {place ? ` — ${place}.` : "."}
              </strong>{" "}
              {story}
            </p>
            {facts.length > 0 && (
              <dl className="mt-7 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-white/10 pt-6 sm:grid-flow-col sm:auto-cols-fr sm:grid-cols-none">
                {facts.map((f) => (
                  <div key={f.k} className="min-w-0">
                    <dt className="font-mono text-[10px] uppercase tracking-[0.28em] text-zinc-500">{f.k}</dt>
                    <dd className="stat mt-2 text-[clamp(1.7rem,2.4vw,2.2rem)] text-gold">{f.v}</dd>
                  </div>
                ))}
              </dl>
            )}
          </Reveal>
        </div>

        {showEntries && timeline.length > 0 && <TimelineFan entries={timeline} />}

        {showLink && timeline.length > 0 && (
          <Reveal className="mt-12">
            <Link href="/historia" className="btn-ghost-line">
              Ver a linha do tempo completa <ArrowUpRight className="size-4" />
            </Link>
          </Reveal>
        )}
      </div>
    </section>
  );
}
