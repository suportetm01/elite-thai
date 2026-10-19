import Image from "@/components/site/smart-image";
import Link from "next/link";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { Emblem } from "@/components/brand/emblem";
import { Countdown } from "@/components/site/countdown";
import { EVENT_STATUS_LABEL, formatDateRange, formatShortDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type MedalCount = { gold: number; silver: number; bronze: number };

export function MedalTally({ medals, size = "sm", className }: { medals: MedalCount; size?: "sm" | "lg"; className?: string }) {
  const items = [
    { key: "gold", label: "Ouro", value: medals.gold, color: "bg-gradient-to-br from-[#f3d68b] to-[#b8862f]" },
    { key: "silver", label: "Prata", value: medals.silver, color: "bg-gradient-to-br from-[#f2f2f2] to-[#8d939c]" },
    { key: "bronze", label: "Bronze", value: medals.bronze, color: "bg-gradient-to-br from-[#e3a36b] to-[#8a4f22]" },
  ].filter((m) => m.value > 0);
  if (!items.length) return null;
  return (
    <ul className={cn("flex items-center gap-3", className)} aria-label="Medalhas">
      {items.map((m) => (
        <li key={m.key} className="flex items-center gap-1.5" title={`${m.value} de ${m.label.toLowerCase()}`}>
          <span className={cn("rounded-full shadow-inner", m.color, size === "lg" ? "size-5" : "size-3")} aria-hidden />
          <span className={cn("stat text-white", size === "lg" ? "text-3xl" : "text-lg")}>{m.value}</span>
          <span className="sr-only">{m.label}</span>
        </li>
      ))}
    </ul>
  );
}

/** Fallback visual quando ainda não há fotografia cadastrada. */
export function PhotoPlaceholder({ label, className }: { label?: string; className?: string }) {
  return (
    <div className={cn("absolute inset-0 grid place-items-center bg-[radial-gradient(ellipse_at_50%_30%,#2a0d10,#0b0b0b_70%)]", className)} aria-hidden>
      <Emblem className="size-24 opacity-20" />
      {label && <span className="display absolute bottom-4 left-4 text-6xl text-white/[0.06]">{label}</span>}
    </div>
  );
}

export type AthleteCardData = {
  name: string;
  slug: string;
  nickname: string | null;
  category: string | null;
  modality: string | null;
  photoUrl: string | null;
  medals: MedalCount;
};

export function AthleteCard({ athlete, priority }: { athlete: AthleteCardData; priority?: boolean }) {
  const [first, ...rest] = athlete.name.split(" ");
  return (
    <Link
      href={`/atletas/${athlete.slug}`}
      className="group relative block aspect-[3/4] overflow-hidden border border-white/[0.07] bg-coal outline-offset-4 cut-corner-br"
    >
      {athlete.photoUrl ? (
        <Image
          src={athlete.photoUrl}
          alt={`Foto de ${athlete.name}`}
          fill
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 80vw"
          priority={priority}
          className="object-cover grayscale-[35%] transition-[transform,filter] duration-700 ease-[var(--ease-cinematic)] group-hover:scale-[1.06] group-hover:grayscale-0"
        />
      ) : (
        <PhotoPlaceholder label={first} />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-[3px] origin-left scale-x-0 bg-blood transition-transform duration-500 group-hover:scale-x-100" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        {athlete.nickname && <p className="eyebrow text-gold">“{athlete.nickname}”</p>}
        <p className="display mt-1 text-4xl text-white md:text-5xl">
          {first} <span className="text-blood">{rest.join(" ")}</span>
        </p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <p className="text-xs uppercase tracking-[0.18em] text-zinc-400">{[athlete.modality, athlete.category].filter(Boolean).join(" · ") || "Atleta Elite Thai"}</p>
          <MedalTally medals={athlete.medals} />
        </div>
      </div>
    </Link>
  );
}

export type ChampionshipCardData = {
  name: string;
  slug: string;
  startDate: Date;
  endDate: Date | null;
  city: string | null;
  state: string | null;
  coverUrl: string | null;
  athletes: number;
  medals: MedalCount;
};

export function ChampionshipCard({ item, className }: { item: ChampionshipCardData; className?: string }) {
  const place = [item.city, item.state].filter(Boolean).join("/");
  return (
    <Link href={`/campeonatos/${item.slug}`} className={cn("group relative flex flex-col overflow-hidden border border-white/[0.07] bg-coal", className)}>
      <div className="relative aspect-[16/10] overflow-hidden">
        {item.coverUrl ? (
          <Image src={item.coverUrl} alt={item.name} fill sizes="(min-width: 1024px) 33vw, 85vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <PhotoPlaceholder />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-coal to-transparent" />
        <span className="absolute left-4 top-4 bg-black/70 px-3 py-1 font-[family-name:var(--font-barlow)] text-xs font-bold uppercase tracking-[0.2em] text-gold backdrop-blur">
          {formatShortDate(item.startDate)}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <p className="display text-3xl text-white transition-colors group-hover:text-gold-soft">{item.name}</p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 text-sm text-zinc-400">
          <span className="flex items-center gap-4">
            {place && (
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5 text-blood" aria-hidden /> {place}
              </span>
            )}
            {item.athletes > 0 && (
              <span className="flex items-center gap-1.5">
                <Users className="size-3.5 text-blood" aria-hidden /> {item.athletes}
              </span>
            )}
          </span>
          <MedalTally medals={item.medals} />
        </div>
      </div>
    </Link>
  );
}

export type EventCardData = {
  id: string;
  name: string;
  startDate: Date | null;
  endDate: Date | null;
  dateConfirmed: boolean;
  venue: string | null;
  city: string | null;
  state: string | null;
  status: keyof typeof EVENT_STATUS_LABEL;
  description: string | null;
  officialUrl: string | null;
  followUrl: string | null;
  athletes: { athlete: { name: string; slug: string; nickname: string | null } ; category: string | null }[];
};

const STATUS_STYLE: Record<string, string> = {
  CONFIRMED: "border-gold/50 text-gold",
  REGISTRATION_OPEN: "border-blood/60 text-[#ff6b77]",
  TENTATIVE: "border-white/20 text-zinc-400",
  POSTPONED: "border-white/20 text-zinc-400",
};

export function EventCard({ event }: { event: EventCardData }) {
  const date = event.startDate ? new Date(event.startDate) : null;
  const place = [event.venue, [event.city, event.state].filter(Boolean).join("/")].filter(Boolean).join(" — ");
  return (
    <article className="panel grid gap-6 p-6 md:grid-cols-[120px_1fr_auto] md:items-center md:p-8">
      <div className="flex items-center gap-4 md:block md:text-center">
        {date && event.dateConfirmed ? (
          <>
            <p className="stat text-6xl text-white">{date.toLocaleDateString("pt-BR", { day: "2-digit", timeZone: "America/Sao_Paulo" })}</p>
            <p className="eyebrow text-gold">{date.toLocaleDateString("pt-BR", { month: "short", year: "numeric", timeZone: "America/Sao_Paulo" }).replace(".", "")}</p>
          </>
        ) : (
          <p className="eyebrow text-zinc-500">
            Data
            <br />a confirmar
          </p>
        )}
      </div>
      <div>
        <span className={cn("inline-block border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.18em]", STATUS_STYLE[event.status] ?? "border-white/20 text-zinc-400")}>
          {EVENT_STATUS_LABEL[event.status]}
        </span>
        <h3 className="display mt-3 text-4xl text-white">{event.name}</h3>
        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm text-zinc-400">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="size-3.5 text-blood" aria-hidden />
            {event.dateConfirmed ? formatDateRange(event.startDate, event.endDate) : "Data a confirmar"}
          </span>
          {place && (
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3.5 text-blood" aria-hidden />
              {place}
            </span>
          )}
        </div>
        {event.description && <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">{event.description}</p>}
        {event.athletes.length > 0 && (
          <p className="mt-4 text-sm text-zinc-300">
            <span className="eyebrow mr-2 text-[0.7rem] text-zinc-500">Atletas confirmados</span>
            {event.athletes.map((a, i) => (
              <span key={a.athlete.slug}>
                {i > 0 && ", "}
                <Link href={`/atletas/${a.athlete.slug}`} className="hover:text-gold">
                  {a.athlete.nickname ?? a.athlete.name}
                </Link>
              </span>
            ))}
          </p>
        )}
      </div>
      <div className="flex flex-col items-start gap-4 md:items-end">
        {date && event.dateConfirmed && <Countdown target={date.toISOString()} />}
        <div className="flex flex-wrap gap-2">
          {event.officialUrl && (
            <a href={event.officialUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost-line px-4 py-2 text-xs">
              Informações oficiais
            </a>
          )}
          {event.followUrl && (
            <a href={event.followUrl} target="_blank" rel="noopener noreferrer" className="btn-blood px-4 py-2 text-xs">
              Acompanhar
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
