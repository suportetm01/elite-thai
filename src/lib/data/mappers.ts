import type { AthleteCardData, ChampionshipCardData } from "@/components/site/cards";

type MedalRow = { medal: string };

export function countMedals(results: MedalRow[]) {
  return {
    gold: results.filter((r) => r.medal === "GOLD").length,
    silver: results.filter((r) => r.medal === "SILVER").length,
    bronze: results.filter((r) => r.medal === "BRONZE").length,
  };
}

export function toAthleteCard(a: {
  name: string;
  slug: string;
  nickname: string | null;
  category: string | null;
  modality: string | null;
  photoUrl: string | null;
  results: MedalRow[];
}): AthleteCardData {
  return { name: a.name, slug: a.slug, nickname: a.nickname, category: a.category, modality: a.modality, photoUrl: a.photoUrl, medals: countMedals(a.results) };
}

export function toChampionshipCard(c: {
  name: string;
  slug: string;
  startDate: Date;
  endDate: Date | null;
  city: string | null;
  state: string | null;
  coverUrl: string | null;
  results: (MedalRow & { athleteId: string })[];
}): ChampionshipCardData {
  return {
    name: c.name,
    slug: c.slug,
    startDate: c.startDate,
    endDate: c.endDate,
    city: c.city,
    state: c.state,
    coverUrl: c.coverUrl,
    athletes: new Set(c.results.map((r) => r.athleteId)).size,
    medals: countMedals(c.results),
  };
}

type MediaRow = {
  id: string;
  type: "IMAGE" | "VIDEO" | "EMBED";
  url: string;
  thumbUrl: string | null;
  posterUrl: string | null;
  width: number | null;
  height: number | null;
  blurDataUrl: string | null;
  alt: string;
  caption: string | null;
  category: "ACADEMIA" | "TREINAMENTOS" | "CAMPEONATOS" | "ATLETAS" | "MEDALHAS" | "EQUIPE" | "EVENTOS";
  championship?: { name: string; slug: string } | null;
  event?: { name: string; slug: string } | null;
};

export function toGalleryMedia(m: MediaRow) {
  const album = m.championship ? { name: m.championship.name, key: `c:${m.championship.slug}` } : m.event ? { name: m.event.name, key: `e:${m.event.slug}` } : null;
  return {
    id: m.id,
    type: m.type,
    url: m.url,
    thumbUrl: m.thumbUrl,
    posterUrl: m.posterUrl,
    width: m.width,
    height: m.height,
    blurDataUrl: m.blurDataUrl,
    alt: m.alt,
    caption: m.caption,
    category: m.category,
    album,
  };
}

export type ChampionshipShowcaseData = ChampionshipCardData & {
  venue: string | null;
  level: string | null;
  organizer: string | null;
  description: string | null;
  featured: boolean;
};

/** Dados do mosaico/destaque de campeonatos (inclui local, nível e descrição). */
export function toChampionshipShowcase(c: Parameters<typeof toChampionshipCard>[0] & {
  venue: string | null;
  level: string | null;
  organizer: string | null;
  description: string | null;
  featured: boolean;
}): ChampionshipShowcaseData {
  return { ...toChampionshipCard(c), venue: c.venue, level: c.level, organizer: c.organizer, description: c.description, featured: c.featured };
}

/** Turmas citadas nas modalidades ("Kids · Teens · Adulto · Feminino"), sem repetição e na ordem de cadastro. */
export function modalityAudiences(modalities: { audience: string | null }[]) {
  const set = new Set<string>();
  modalities.forEach((m) =>
    m.audience
      ?.split(/[·,|/]/)
      .map((a) => a.trim())
      .filter(Boolean)
      .forEach((a) => set.add(a)),
  );
  return [...set];
}
