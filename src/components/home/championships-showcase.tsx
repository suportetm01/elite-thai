import Image from "@/components/site/smart-image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays } from "lucide-react";
import { Emblem } from "@/components/brand/emblem";
import { MedalTally } from "@/components/site/cards";
import { CountUp } from "@/components/site/count-up";
import { RevealLines } from "@/components/site/reveal-lines";
import { HighlightReel } from "@/components/site/highlight-reel";
import { MarqueeStrip } from "@/components/site/marquee-strip";
import { Reveal, Stagger, StaggerItem } from "@/components/site/reveal";
import type { ChampionshipShowcaseData } from "@/lib/data/mappers";
import { SITE_MEDIA } from "@/lib/site-media";
import { cn } from "@/lib/utils";

/**
 * Campeonatos no formato "provas": carimbo numerado e manchete revelada linha a linha, o
 * reel de melhores momentos, contadores animados (sempre calculados dos registros), o
 * campeonato em destaque com foto, um mosaico de cartões e a faixa com os nomes das competições. Sem cadastros, mostra o mesmo layout
 * com um estado honesto ("temporada em construção") — nunca números ou eventos inventados.
 */

type Stats = { championships: number; medals: number; gold: number; athletes: number };

const year = (d: Date) => new Date(d).getFullYear();
const place = (c: ChampionshipShowcaseData) => [c.city, c.state].filter(Boolean).join("/");
const medalTotal = (c: ChampionshipShowcaseData) => c.medals.gold + c.medals.silver + c.medals.bronze;

/** padrão do mosaico (6 colunas): largo+alto, simples, simples, largo, simples, simples, largo */
const SPANS = ["lg:col-span-2 lg:row-span-2", "", "", "lg:col-span-2", "", "", "lg:col-span-2"];

function Counters({ stats }: { stats: Stats }) {
  const tiles = [
    { label: "Campeonatos disputados", value: stats.championships },
    { label: "Medalhas conquistadas", value: stats.medals },
    { label: "Medalhas de ouro", value: stats.gold },
    { label: "Atletas da equipe", value: stats.athletes },
  ].filter((t) => t.value > 0);
  if (tiles.length < 2) return null;
  return (
    <Stagger className={cn("mt-14 grid gap-4", tiles.length >= 4 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-2 md:grid-cols-3")}>
      {tiles.map((t) => (
        <StaggerItem key={t.label}>
          <div className="card-light relative rounded-[18px] p-6">
            <p className="stat text-[clamp(3.4rem,6vw,5rem)] text-ink">
              <CountUp value={t.value} />
              <span className="text-blood">+</span>
            </p>
            <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.26em] text-zinc-500">{t.label}</p>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

function Featured({ item }: { item: ChampionshipShowcaseData }) {
  const chips = [String(year(item.startDate)), item.venue ?? place(item), item.level ?? item.organizer].filter(Boolean) as string[];
  return (
    <div className="mt-14 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
      <Reveal>
        <div className="card-dark relative flex h-full min-h-[440px] flex-col overflow-hidden rounded-[18px] p-7 md:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_480px_at_110%_-10%,rgba(227,38,54,0.35),transparent_60%)]" aria-hidden />
          <ul className="relative flex flex-wrap gap-2">
            {chips.map((chip) => (
              <li key={chip} className="chip border border-white/10 bg-white/10 text-white/85">
                {chip}
              </li>
            ))}
          </ul>
          <div className="relative mt-auto pt-16">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold">Em destaque</p>
            <h3 className="display mt-3 text-[clamp(2.8rem,5.5vw,4.8rem)] text-white">
              {item.name}
            </h3>
            {item.description && <p className="mt-4 line-clamp-3 max-w-xl leading-relaxed text-zinc-400">{item.description}</p>}
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              {item.athletes > 0 && (
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-400">
                  {item.athletes} {item.athletes === 1 ? "atleta" : "atletas"}
                </span>
              )}
              <MedalTally medals={item.medals} />
              <Link href={`/campeonatos/${item.slug}`} className="inline-flex items-center gap-1.5 font-[family-name:var(--font-barlow)] text-sm font-bold uppercase tracking-[0.16em] text-white hover:text-gold">
                Ver campeonato <ArrowUpRight className="size-4" />
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <div className="card-dark relative h-full min-h-[440px] overflow-hidden rounded-[18px]">
          {item.coverUrl ? (
            <div className="absolute inset-0">
              <Image src={item.coverUrl} alt={`Equipe no ${item.name}`} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" />
            </div>
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(ellipse_at_50%_35%,#3a0d12,#0b0b0b_70%)]" aria-hidden>
              <Emblem className="size-[46%] opacity-30" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" aria-hidden />
          <p className="absolute left-5 top-5 rounded-full border border-white/10 bg-black/55 px-3 py-1.5 backdrop-blur">
            <b className="stat text-xl text-white">{year(item.startDate)}</b>
            {place(item) && <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">· {place(item)}</span>}
          </p>
          <span className="absolute right-5 top-5 grid size-11 place-items-center rounded-[10px] bg-blood/95 shadow-lg" aria-hidden>
            <Emblem className="size-8" />
          </span>
          <div className="absolute inset-x-5 bottom-5">
            <p className="font-[family-name:var(--font-barlow)] text-2xl font-bold uppercase leading-tight text-white">{item.name}</p>
            {medalTotal(item) > 0 && (
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.24em] text-white/60">
                {medalTotal(item)} {medalTotal(item) === 1 ? "medalha" : "medalhas"} da equipe
              </p>
            )}
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function Mosaic({ items }: { items: ChampionshipShowcaseData[] }) {
  if (!items.length) return null;
  return (
    <Stagger className="mt-4 grid auto-rows-[200px] grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6" step={0.06}>
      {items.slice(0, SPANS.length).map((item, i) => (
        <StaggerItem key={item.slug} className={cn("h-full", SPANS[i], i === 0 && "col-span-2 row-span-2 md:col-span-1")}>
          <div className="card-dark group relative h-full overflow-hidden rounded-[16px]">
            <Link href={`/campeonatos/${item.slug}`} className="absolute inset-0 z-[7]" aria-label={`${item.name} (${year(item.startDate)})`} />
            {item.coverUrl ? (
              <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                <Image src={item.coverUrl} alt="" fill sizes="(min-width: 1024px) 30vw, 50vw" className="object-cover" />
              </div>
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_20%,#2c0b0f,#111_70%)]" aria-hidden>
                <Emblem className="absolute -bottom-6 -right-6 size-32 opacity-10" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/25 to-transparent" aria-hidden />
            <div className="absolute inset-x-4 bottom-4">
              <p className="font-mono text-[10px] uppercase tracking-[0.26em] text-gold">{year(item.startDate)}</p>
              <p className="mt-1 font-[family-name:var(--font-barlow)] text-lg font-bold uppercase leading-tight text-white">{item.name}</p>
            </div>
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}

/** Reel de melhores momentos da equipe, com o texto do próprio post da academia. */
function Highlights() {
  const reel = SITE_MEDIA.highlights;
  return (
    <div className="mt-16 grid items-center gap-10 md:grid-cols-[minmax(240px,340px)_1fr] lg:gap-16">
      <Reveal className="mx-auto w-full max-w-[340px] md:mx-0">
        <HighlightReel src={reel.src} poster={reel.poster} label={reel.label} />
      </Reveal>
      <Reveal delay={0.1}>
        <p className="eyebrow flex items-center gap-3 text-gold">
          <span className="h-px w-10 bg-gold/50" aria-hidden />
          Melhores momentos
        </p>
        <blockquote className="mt-5">
          <p className="display text-[clamp(2.4rem,5.2vw,4.6rem)] leading-[0.92] text-white">
            Enquanto muitos procuram desculpas, <span className="text-blood">nós buscamos evolução.</span>
          </p>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-zinc-400">A pressão separa os que desistem dos que deixam seu nome marcado.</p>
        </blockquote>
        <a href={reel.href} target="_blank" rel="noopener noreferrer" className="btn-ghost-line mt-8">
          Ver no Instagram <ArrowUpRight className="size-4" />
        </a>
      </Reveal>
    </div>
  );
}

/** Mesmo layout do destaque, sem dados: a temporada ainda não foi publicada. */
function ComingSoon() {
  return (
    <div className="mt-14 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
      <Reveal>
        <div className="card-dark relative flex h-full min-h-[380px] flex-col overflow-hidden rounded-[18px] p-7 md:p-10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(800px_480px_at_110%_-10%,rgba(227,38,54,0.32),transparent_60%)]" aria-hidden />
          <ul className="relative flex flex-wrap gap-2">
            {["Resultados oficiais", "Medalhas", "Fotos e vídeos"].map((chip) => (
              <li key={chip} className="chip border border-white/10 bg-white/10 text-white/85">
                {chip}
              </li>
            ))}
          </ul>
          <div className="relative mt-auto pt-14">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-gold">Temporada em construção</p>
            <h3 className="display mt-3 text-[clamp(2.6rem,5vw,4.4rem)] text-white">
              O próximo capítulo <span className="text-blood">começa no ringue.</span>
            </h3>
            <p className="mt-4 max-w-xl leading-relaxed text-zinc-400">
              Cada campeonato disputado pela equipe será publicado aqui com local, resultados e medalhas oficiais.
            </p>
            <Link href="/agenda" className="btn-ghost-line mt-7">
              <CalendarDays className="size-4" /> Ver agenda de eventos
            </Link>
          </div>
        </div>
      </Reveal>
      <Reveal delay={0.1}>
        <div className="card-red mesh-red relative grid h-full min-h-[380px] place-items-center overflow-hidden rounded-[18px]">
          <div className="grid place-items-center">
            <Emblem className="size-48 drop-shadow-[0_24px_40px_rgba(0,0,0,0.45)] md:size-60" />
          </div>
          <p className="absolute inset-x-6 bottom-6 font-mono text-[10px] uppercase tracking-[0.3em] text-white/80">Registros oficiais em breve</p>
        </div>
      </Reveal>
    </div>
  );
}

export function ChampionshipsShowcase({
  items,
  stats,
  index = "02",
  as = "h2",
  showAllLink = true,
  mosaic = true,
  className,
  intro = "Os campeonatos disputados pela equipe, com resultados e medalhas publicados a partir dos registros oficiais da academia.",
}: {
  items: ChampionshipShowcaseData[];
  stats: Stats;
  /** número da seção no carimbo (null = só o rótulo, nas páginas internas) */
  index?: string | null;
  as?: "h1" | "h2";
  showAllLink?: boolean;
  /** mosaico dos demais campeonatos (a página /campeonatos usa o arquivo por ano) */
  mosaic?: boolean;
  className?: string;
  intro?: string;
}) {
  const featured = items.find((i) => i.featured) ?? items[0];
  const rest = items.filter((i) => i !== featured);
  return (
    <section aria-labelledby="campeonatos-titulo" className={cn("relative overflow-hidden border-t border-white/[0.06] bg-[linear-gradient(180deg,#0b0b0b,#120607_60%,#0b0b0b)] pt-28 md:pt-36", className)}>
      <div className="container-site relative pb-20 md:pb-28">
        <div className="grid gap-8 lg:grid-cols-[minmax(160px,200px)_1fr] lg:gap-12">
          <Reveal className="lg:pt-6">
            {index && <p className="stat text-[clamp(5rem,11vw,9rem)] leading-[0.8] text-blood [text-shadow:0_18px_50px_rgba(227,38,54,0.35)]">{index}.</p>}
            <p className="eyebrow mt-3 text-[0.72rem] text-zinc-400">Campeonatos</p>
          </Reveal>
          <div>
            <RevealLines
              id="campeonatos-titulo"
              as={as}
              className="text-[clamp(3.4rem,9vw,8rem)] text-white"
              lines={[
                "Cada medalha",
                <span key="accent" className="text-blood">
                  tem história.
                </span>,
              ]}
            />
            <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
              <Reveal>
                <p className="max-w-2xl text-lg leading-relaxed text-zinc-400">{intro}</p>
              </Reveal>
              {showAllLink && items.length > 0 && (
                <Link href="/campeonatos" className="btn-ghost-line shrink-0">
                  Todos os campeonatos <ArrowUpRight className="size-4" />
                </Link>
              )}
            </div>
          </div>
        </div>

        <Highlights />
        <Counters stats={stats} />
        {featured ? <Featured item={featured} /> : <ComingSoon />}
        {mosaic && <Mosaic items={rest} />}
      </div>
      {items.length >= 3 && <MarqueeStrip items={[...new Set(items.map((i) => i.name))]} slow />}
    </section>
  );
}
