import Image from "@/components/site/smart-image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Emblem } from "@/components/brand/emblem";
import { MarqueeStrip } from "@/components/site/marquee-strip";
import { Stagger, StaggerItem } from "@/components/site/reveal";
import { modalityAudiences } from "@/lib/data/mappers";
import type { Settings } from "@/lib/data/public";
import { TRIAL_PATH } from "@/lib/site";
import { SITE_MEDIA } from "@/lib/site-media";
import { cn } from "@/lib/utils";

/**
 * Grade "bento" — a Elite Thai em um olhar, em sete cartões. Tudo vem de src/content:
 * modalidades, turmas, horários, depoimento autorizado, fotos (ou as fotos padrão da academia) e números
 * calculados — nada é inventado.
 */

type Modality = { name: string; slug: string; audience: string | null };
type Schedule = { weekday: number; modality: { slug: string } };
type Testimonial = { authorName: string; authorInfo: string | null; text: string; photoUrl: string | null };
type Stats = { athletes: number; medals: number; championships: number };

const DAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const WEEK = [1, 2, 3, 4, 5, 6, 0];

/** "Seg a Sex" para dias seguidos; "Seg · Qua · Sex" para alternados. */
export function dayRange(days: number[]) {
  const sorted = WEEK.filter((d) => days.includes(d));
  if (!sorted.length) return null;
  const idx = sorted.map((d) => WEEK.indexOf(d));
  if (sorted.length >= 3 && idx.every((v, i) => i === 0 || v === idx[i - 1]! + 1)) return `${DAYS[sorted[0]!]} a ${DAYS[sorted.at(-1)!]}`;
  return sorted.map((d) => DAYS[d]).join(" · ");
}

const cardBase = "relative isolate overflow-hidden rounded-[18px]";

function ProgramCard({ settings, chips }: { settings: Settings; chips: string[] }) {
  const text = settings.trainingHowItWorks?.split("\n").find(Boolean) ?? "Técnica, condicionamento e disciplina — do primeiro treino ao nível de competição.";
  return (
    <div className={cn(cardBase, "card-red mesh-red flex min-h-[230px] flex-col p-6")}>
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-white/75">
        Programa {settings.name}
      </p>
      <h3 className="mt-3 text-[1.9rem] font-black leading-[1.02] tracking-tight">
        Treine como
        <span className="mt-1 block w-fit rounded-[4px] bg-white px-2 py-0.5 text-blood">atleta.</span>
      </h3>
      <p className="mt-3 text-[0.82rem] leading-relaxed text-white/80">
        {text}
      </p>
      {chips.length > 0 && (
        <ul className="mt-auto flex flex-wrap gap-1.5 pt-4" aria-label="Turmas">
          {chips.slice(0, 4).map((chip) => (
            <li key={chip} className="chip border border-white/20 bg-white/15">
              {chip}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function PhotoCard({ settings, testimonial }: { settings: Settings; testimonial: Testimonial | null }) {
  // foto do depoimento → foto da equipe (src/content/site.ts) → foto padrão da turma
  const photo = testimonial?.photoUrl ?? settings.teamPhotoUrl;
  const alt = testimonial ? `Foto de ${testimonial.authorName}` : photo ? `Equipe ${settings.name}` : SITE_MEDIA.team.alt;
  const motto = settings.subheadline;
  return (
    <div className={cn(cardBase, "card-dark min-h-[280px]")}>
      <div className="absolute inset-0">
        <Image src={photo ?? SITE_MEDIA.team.src} alt={alt} fill sizes="(min-width: 1024px) 28vw, 100vw" className="object-cover" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/30" aria-hidden />
      <div className="absolute left-4 top-4 rounded-[10px] border border-white/10 bg-white/10 px-3 py-2 backdrop-blur">
        <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/70">{testimonial ? "Depoimento" : "Nossa equipe"}</p>
        <p className="text-sm font-bold text-white">{testimonial?.authorName ?? `Equipe ${settings.name}`}</p>
        {testimonial?.authorInfo && <p className="text-[11px] text-white/70">{testimonial.authorInfo}</p>}
      </div>
      <blockquote className="absolute inset-x-4 bottom-4 rounded-[10px] bg-white px-4 py-3 text-[0.82rem] leading-snug text-ink shadow-xl">
        “{testimonial ? testimonial.text.slice(0, 140) + (testimonial.text.length > 140 ? "…" : "") : motto}”
      </blockquote>
    </div>
  );
}

function ScheduleCard({ modalities, schedules }: { modalities: Modality[]; schedules: Schedule[] }) {
  const rows = modalities.slice(0, 6).map((m) => ({ name: m.name, days: dayRange(schedules.filter((s) => s.modality.slug === m.slug).map((s) => s.weekday)) }));
  return (
    <div className={cn(cardBase, "card-dark min-h-[280px]")}>
      <Link href="/treinamentos" className="absolute inset-0 z-[7]" aria-label="Ver a grade de treinos" />
      <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-blood" aria-hidden />
        <span className="size-2.5 rounded-full bg-white/20" aria-hidden />
        <span className="size-2.5 rounded-full bg-white/20" aria-hidden />
        <span className="ml-2 truncate font-mono text-[11px] tracking-wide text-white/50">elitethai · grade de treinos</span>
      </div>
      <ul className="cycle-highlight px-3 py-2">
        {rows.map((row, i) => (
          <li key={row.name} className="flex items-center justify-between gap-3 rounded-md border-b border-white/[0.05] px-2 py-2.5 last:border-0" style={{ ["--i" as string]: i }}>
            <span className="text-[0.92rem] font-bold text-white">{row.name}</span>
            <span className="font-mono text-[11px] tracking-wide text-white/55">{row.days ?? "sob consulta"}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function HeroCard({ settings, modalities, stats }: { settings: Settings; modalities: Modality[]; stats: Stats }) {
  const years = settings.foundedYear ? new Date().getFullYear() - settings.foundedYear : 0;
  const numbers = [
    modalities.length > 0 ? { value: String(modalities.length), label: "modalidades" } : null,
    settings.students ? { value: settings.students, label: "alunos" } : null,
    years > 0 ? { value: String(years), label: years === 1 ? "ano" : "anos" } : null,
    stats.athletes > 0 ? { value: String(stats.athletes), label: "atletas" } : null,
    stats.medals > 0 ? { value: String(stats.medals), label: "medalhas" } : null,
    stats.championships > 0 ? { value: String(stats.championships), label: "campeonatos" } : null,
  ]
    .filter((n): n is { value: string; label: string } => Boolean(n))
    .slice(0, 3);
  const place = [settings.city, settings.state].filter(Boolean).join(" · ");
  const photo = settings.heroPosterUrl ?? settings.teamPhotoUrl;
  const [lead, punch] = (() => {
    const parts = settings.headline.split(".").map((p) => p.trim()).filter(Boolean);
    return parts.length >= 2 ? [`${parts[0]}.`, `${parts.slice(1).join(". ")}.`] : [settings.headline, ""];
  })();

  return (
    <div className={cn(cardBase, "card-dark flex min-h-[560px] flex-col lg:min-h-full")}>
      {photo ? (
        <div className="absolute inset-0">
          <Image src={photo} alt={`Treino na ${settings.name}`} fill sizes="(min-width: 1024px) 34vw, 100vw" className="object-cover" />
        </div>
      ) : (
        // no cartão alto (computador) a logo fica ao fundo; nos menores ela entra no fluxo, abaixo
        <div className="absolute inset-0 hidden place-items-start justify-center pt-[22%] lg:grid" aria-hidden>
          <div className="absolute left-1/2 top-[36%] size-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blood/30 blur-[80px]" />
          <Emblem className="relative size-[66%] drop-shadow-[0_30px_60px_rgba(0,0,0,0.6)]" />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(13,13,13,0)_42%,rgba(13,13,13,0.94)_78%)]" aria-hidden />

      <div className="pointer-events-none relative z-[2] flex flex-1 flex-col p-5 md:p-6">
        <p className="flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-white/85 backdrop-blur">
          <span className="size-1.5 rounded-full bg-blood shadow-[0_0_10px_#e32636]" aria-hidden />
          {modalities
            .slice(0, 3)
            .map((m) => m.name)
            .join(" · ")}
        </p>
        {numbers.length > 0 && (
          <dl
            className={cn(
              "mt-4 grid rounded-xl border border-white/10 bg-black/40 px-2 py-3 text-center backdrop-blur",
              numbers.length === 1 ? "grid-cols-1" : numbers.length === 2 ? "grid-cols-2" : "grid-cols-3",
            )}
          >
            {numbers.map((n) => (
              <div key={n.label}>
                <dd className="stat text-[2.1rem] text-white">{n.value}</dd>
                <dt className="font-mono text-[9px] uppercase tracking-[0.22em] text-white/55">{n.label}</dt>
              </div>
            ))}
          </dl>
        )}
        {!photo && (
          <div className="relative mx-auto my-8 grid place-items-center lg:hidden" aria-hidden>
            <div className="absolute size-[120%] rounded-full bg-blood/30 blur-[60px]" />
            <Emblem className="relative size-44 drop-shadow-[0_24px_48px_rgba(0,0,0,0.6)] md:size-56" />
          </div>
        )}
        <div className="mt-auto">
          {place && <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">{`${settings.name} · ${place}`}</p>}
          <h3 className="display mt-3 text-[clamp(2.8rem,5vw,4.2rem)] text-white">
            {lead}
            {punch && <span className="block text-blood">{punch}</span>}
          </h3>
          <p className="mt-3 max-w-sm text-sm text-white/70">
            {settings.subheadline}
          </p>
          <Link href={TRIAL_PATH} className="btn-blood pointer-events-auto mt-5 w-fit">
            Agendar aula experimental
          </Link>
        </div>
      </div>
    </div>
  );
}

function LogoCard({ settings }: { settings: Settings }) {
  const place = [settings.neighborhood, [settings.city, settings.state].filter(Boolean).join("/")].filter(Boolean).join(" · ");
  return (
    <div className={cn(cardBase, "card-light flex min-h-[260px] flex-col items-center justify-between p-6 text-center")}>
      <div className="grid flex-1 place-items-center py-2">
        {settings.logoUrl ? (
          <Image src={settings.logoUrl} alt={settings.name} width={170} height={170} className="size-40 object-contain drop-shadow-xl" />
        ) : (
          <Emblem className="size-40 drop-shadow-[0_14px_24px_rgba(0,0,0,0.25)]" title={settings.name} />
        )}
      </div>
      <div className="w-full border-t border-black/[0.08] pt-4">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.3em] text-blood">
          {settings.name} · {settings.tagline}
        </p>
        {place && <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">{place}</p>}
      </div>
    </div>
  );
}

function TrialCard() {
  return (
    <div className={cn(cardBase, "card-red mesh-red flex min-h-[220px] flex-col p-6")}>
      <p className="chip w-fit bg-black/40">
        Aula experimental
      </p>
      <h3 className="mt-3 text-[1.7rem] font-black leading-[1.02] tracking-tight">
        Pronto pro
        <br />
        primeiro round?
      </h3>
      <p className="mt-3 max-w-[16rem] text-[0.82rem] leading-relaxed text-white/85">
        Venha treinar antes de decidir. A equipe confirma com você a turma e o horário.
      </p>
      <Link
        href={TRIAL_PATH}
        className="mt-auto inline-flex w-fit items-center gap-2 rounded-full border border-white/30 bg-ink px-5 py-2.5 font-[family-name:var(--font-barlow)] text-sm font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-black"
       
      >
        Agendar aula <ArrowUpRight className="size-4" />
      </Link>
    </div>
  );
}

function ModalitiesCard({ modalities }: { modalities: Modality[] }) {
  return (
    <div className={cn(cardBase, "card-dark flex min-h-[260px] flex-col p-6")}>
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/50">
        {String(modalities.length).padStart(2, "0")} modalidades
      </p>
      <ul className="cycle-highlight mt-4 grid grid-cols-2 gap-x-3 gap-y-1">
        {modalities.map((m, i) => (
          <li key={m.slug} className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[0.9rem] font-semibold text-white" style={{ ["--i" as string]: i }}>
            <span className="size-1.5 shrink-0 rounded-full bg-blood" aria-hidden />
            {m.name}
          </li>
        ))}
      </ul>
      <Link
        href="/treinamentos"
        className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-blood px-5 py-2.5 font-[family-name:var(--font-barlow)] text-sm font-bold uppercase tracking-[0.14em] text-white transition-colors hover:bg-[#f03443]"
       
      >
        Ver treinos <ArrowUpRight className="size-4" />
      </Link>
    </div>
  );
}

export function BentoSection({
  settings,
  modalities,
  schedules,
  testimonial,
  stats,
}: {
  settings: Settings;
  modalities: Modality[];
  schedules: Schedule[];
  testimonial: Testimonial | null;
  stats: Stats;
}) {
  const values = settings.subheadline
    .split(".")
    .map((v) => v.trim())
    .filter(Boolean);
  const place = [settings.city, settings.state].filter(Boolean).join("/");
  return (
    <section aria-labelledby="bento-titulo" className="paper relative overflow-hidden pt-20 md:pt-28">
      <h2 id="bento-titulo" className="sr-only">
        A {settings.name} em um olhar
      </h2>
      <div className="container-site pb-20 md:pb-28">
        <Stagger className="grid gap-4 md:grid-cols-2 lg:grid-cols-[1fr_1.2fr_1fr] lg:gap-[14px]" step={0.07}>
          <div className="grid content-start gap-4 lg:gap-[14px]">
            <StaggerItem>
              <ProgramCard settings={settings} chips={modalityAudiences(modalities)} />
            </StaggerItem>
            <StaggerItem>
              <PhotoCard settings={settings} testimonial={testimonial} />
            </StaggerItem>
            <StaggerItem>
              <ScheduleCard modalities={modalities} schedules={schedules} />
            </StaggerItem>
          </div>
          <StaggerItem className="order-first md:col-span-2 lg:order-none lg:col-span-1">
            <HeroCard settings={settings} modalities={modalities} stats={stats} />
          </StaggerItem>
          <div className="grid content-start gap-4 lg:gap-[14px]">
            <StaggerItem>
              <LogoCard settings={settings} />
            </StaggerItem>
            <StaggerItem>
              <TrialCard />
            </StaggerItem>
            <StaggerItem>
              <ModalitiesCard modalities={modalities} />
            </StaggerItem>
          </div>
        </Stagger>
      </div>
      <MarqueeStrip items={[...values, ...modalities.map((m) => m.name), place].filter(Boolean)} />
    </section>
  );
}
