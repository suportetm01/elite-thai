import { CHAMPIONSHIPS, EVENTS, NEWS, RESULTS } from "@/content/competitions";
import { MEDIA, TESTIMONIALS, TIMELINE } from "@/content/media";
import { MODALITIES, SETTINGS } from "@/content/site";
import { ATHLETES, INSTRUCTORS, SCHEDULES } from "@/content/team";
import type { Championship, MediaCategory, MediaItem, Medal, SportEvent } from "@/content/types";

/**
 * Camada de leitura do site estático: monta, a partir dos arquivos de `src/content`,
 * os mesmos formatos que as páginas usam. Tudo é resolvido durante o build.
 */

export type Settings = typeof SETTINGS;

const date = (value: string) => new Date(`${value}T12:00:00-03:00`);
const optionalDate = (value: string | null) => (value ? date(value) : null);

/** Ordem das medalhas na listagem: ouro, prata, bronze, participação. */
const MEDAL_ORDER: Medal[] = ["GOLD", "SILVER", "BRONZE", "NONE"];

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

const modalityRef = (slug: string) => {
  const m = MODALITIES.find((x) => x.slug === slug);
  return m ? { name: m.name, slug: m.slug } : null;
};
const instructorRef = (slug: string | null) => {
  const p = slug ? INSTRUCTORS.find((x) => x.slug === slug) : null;
  return p ? { name: p.name, slug: p.slug } : null;
};
const athleteRef = (slug: string) => {
  const a = ATHLETES.find((x) => x.slug === slug);
  return a ? { name: a.name, slug: a.slug, nickname: a.nickname, photoUrl: a.photoUrl } : null;
};
const championshipRef = (slug: string | null) => {
  const c = slug ? CHAMPIONSHIPS.find((x) => x.slug === slug) : null;
  return c ? { name: c.name, slug: c.slug } : null;
};
const eventRef = (slug: string | null) => {
  const e = slug ? EVENTS.find((x) => x.slug === slug) : null;
  return e ? { name: e.name, slug: e.slug } : null;
};

/** Campos de exibição de uma mídia (as relações por slug ficam de fora). */
const toMedia = (m: MediaItem) => ({
  id: m.id,
  type: m.type,
  url: m.url,
  thumbUrl: m.thumbUrl,
  posterUrl: m.posterUrl,
  width: m.width,
  height: m.height,
  blurDataUrl: null as string | null,
  alt: m.alt,
  caption: m.caption,
  category: m.category,
});

/** Resultados válidos: o atleta e o campeonato precisam existir nos arquivos. */
const validResults = () =>
  RESULTS.map((r, i) => ({ ...r, id: `${r.championship}:${r.athlete}:${i}` })).filter(
    (r) => ATHLETES.some((a) => a.slug === r.athlete) && CHAMPIONSHIPS.some((c) => c.slug === r.championship),
  );

const toChampionship = (c: Championship) => ({ ...c, id: c.slug, startDate: date(c.startDate), endDate: optionalDate(c.endDate) });

const toEvent = (e: SportEvent) => ({ ...e, id: e.slug, startDate: optionalDate(e.startDate), endDate: optionalDate(e.endDate) });

export async function getSettings() {
  return SETTINGS;
}

export async function getModalities() {
  return MODALITIES.map((m) => ({ ...m, id: m.slug }));
}

export async function getInstructors() {
  return INSTRUCTORS.map((p) => ({
    ...p,
    id: p.slug,
    modalities: p.modalities.map(modalityRef).filter((m): m is NonNullable<typeof m> => Boolean(m)),
  }));
}

export async function getSchedules() {
  return SCHEDULES.flatMap((s, i) => {
    const modality = modalityRef(s.modality);
    if (!modality) return [];
    return [{ ...s, id: `${s.modality}-${s.weekday}-${s.startTime}-${i}`, modality, instructor: instructorRef(s.instructor) }];
  }).sort((a, b) => a.weekday - b.weekday || a.startTime.localeCompare(b.startTime));
}

function athleteCard(slug: string) {
  const a = ATHLETES.find((x) => x.slug === slug)!;
  return {
    id: a.slug,
    name: a.name,
    slug: a.slug,
    nickname: a.nickname,
    category: a.category,
    modality: a.modality,
    photoUrl: a.photoUrl,
    featured: a.featured,
    results: validResults()
      .filter((r) => r.athlete === a.slug)
      .map((r) => ({ medal: r.medal })),
  };
}

export async function getAthletes() {
  return [...ATHLETES].sort((a, b) => Number(b.featured) - Number(a.featured)).map((a) => athleteCard(a.slug));
}

export async function getFeaturedAthletes(limit = 6) {
  const featured = ATHLETES.filter((a) => a.featured);
  return (featured.length ? featured : ATHLETES).slice(0, limit).map((a) => athleteCard(a.slug));
}

export async function getAthleteBySlug(slug: string) {
  const a = ATHLETES.find((x) => x.slug === slug);
  if (!a) return null;
  const results = validResults()
    .filter((r) => r.athlete === slug)
    .map((r) => {
      const c = toChampionship(CHAMPIONSHIPS.find((x) => x.slug === r.championship)!);
      return {
        ...r,
        championshipId: c.slug,
        championship: { name: c.name, slug: c.slug, startDate: c.startDate, city: c.city, state: c.state },
      };
    })
    .sort((x, y) => y.championship.startDate.getTime() - x.championship.startDate.getTime());
  const eventEntries = EVENTS.filter((e) => e.status !== "CANCELED" && e.status !== "FINISHED").flatMap((e) =>
    e.athletes
      .filter((entry) => entry.athlete === slug)
      .map((entry) => ({
        eventId: e.slug,
        category: entry.category,
        event: { name: e.name, slug: e.slug, startDate: optionalDate(e.startDate), dateConfirmed: e.dateConfirmed, status: e.status },
      })),
  );
  return {
    ...a,
    id: a.slug,
    instructor: instructorRef(a.instructor),
    results,
    media: MEDIA.filter((m) => m.athlete === slug).map(toMedia),
    eventEntries,
  };
}

export async function getAthleteSlugs() {
  return ATHLETES.map((a) => ({ slug: a.slug }));
}

export async function getChampionships() {
  const results = validResults();
  return CHAMPIONSHIPS.map(toChampionship)
    .sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
    .map((c) => ({
      ...c,
      results: results.filter((r) => r.championship === c.slug).map((r) => ({ medal: r.medal, athleteId: r.athlete })),
    }));
}

export async function getChampionshipBySlug(slug: string) {
  const found = CHAMPIONSHIPS.find((x) => x.slug === slug);
  if (!found) return null;
  const c = toChampionship(found);
  return {
    ...c,
    results: validResults()
      .filter((r) => r.championship === slug)
      .map((r) => ({ ...r, athlete: athleteRef(r.athlete)! }))
      .sort((x, y) => MEDAL_ORDER.indexOf(x.medal) - MEDAL_ORDER.indexOf(y.medal)),
    media: MEDIA.filter((m) => m.championship === slug).map(toMedia),
    news: NEWS.filter((n) => n.championship === slug)
      .map((n, i) => ({ ...n, id: `${slug}-${i}`, publishedAt: optionalDate(n.publishedAt) }))
      .sort((x, y) => (y.publishedAt?.getTime() ?? 0) - (x.publishedAt?.getTime() ?? 0)),
  };
}

export async function getChampionshipSlugs() {
  return CHAMPIONSHIPS.map((c) => ({ slug: c.slug }));
}

/** Eventos ainda por acontecer (calculado no build: gere o site de novo para atualizar a agenda). */
export async function getUpcomingEvents() {
  const today = startOfToday();
  return EVENTS.map(toEvent)
    .filter((e) => e.status !== "CANCELED" && e.status !== "FINISHED")
    .filter((e) => !e.startDate || e.startDate >= today || (e.endDate && e.endDate >= today))
    .sort((a, b) => {
      if (a.startDate && b.startDate) return a.startDate.getTime() - b.startDate.getTime() || a.name.localeCompare(b.name);
      if (a.startDate) return -1;
      if (b.startDate) return 1;
      return a.name.localeCompare(b.name);
    })
    .map((e) => ({
      ...e,
      athletes: e.athletes.flatMap((entry) => {
        const athlete = athleteRef(entry.athlete);
        return athlete ? [{ athlete, category: entry.category }] : [];
      }),
    }));
}

export async function getGallery() {
  return [...MEDIA]
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .map((m) => ({ ...toMedia(m), championship: championshipRef(m.championship), event: eventRef(m.event) }));
}

export async function getGalleryPreview(limit = 9, category?: MediaCategory) {
  return [...MEDIA]
    .filter((m) => m.type === "IMAGE" && (!category || m.category === category))
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, limit)
    .map(toMedia);
}

export async function getTimeline() {
  return [...TIMELINE]
    .sort((a, b) => a.year - b.year || (a.month ?? 0) - (b.month ?? 0))
    .map((t) => ({
      ...t,
      championship: championshipRef(t.championship),
      media: MEDIA.filter((m) => m.timelineEntry === t.id).slice(0, 6).map(toMedia),
    }));
}

export async function getTestimonials() {
  return TESTIMONIALS;
}

/** Números exibidos no site — sempre calculados a partir dos arquivos de conteúdo. */
export async function getStats() {
  const results = validResults().filter((r) => r.medal !== "NONE");
  const count = (m: Medal) => results.filter((r) => r.medal === m).length;
  const gold = count("GOLD");
  const silver = count("SILVER");
  const bronze = count("BRONZE");
  const upcoming = (await getUpcomingEvents()).length;
  return {
    athletes: ATHLETES.length,
    championships: CHAMPIONSHIPS.length,
    gold,
    silver,
    bronze,
    medals: gold + silver + bronze,
    upcoming,
    modalities: MODALITIES.length,
  };
}
