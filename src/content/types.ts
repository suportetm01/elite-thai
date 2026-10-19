/**
 * Tipos do conteúdo do site. Todo o conteúdo fica nos arquivos desta pasta e entra no
 * site no próximo build — não há painel nem banco de dados.
 *
 * Convenções:
 * - Datas no formato "AAAA-MM-DD" (ex.: "2026-07-01").
 * - Relações apontam pelo `slug` (ex.: `championship: "copa-capixaba-2026"`).
 * - Imagens e vídeos ficam em `public/` e são referenciados a partir da raiz
 *   (ex.: "/images/atletas/carol.jpg").
 * - Só publique fotos, vídeos e depoimentos com autorização de quem aparece (e dos
 *   responsáveis, no caso de menores).
 */

export type Medal = "GOLD" | "SILVER" | "BRONZE" | "NONE";
export type EventStatus = "TENTATIVE" | "CONFIRMED" | "REGISTRATION_OPEN" | "POSTPONED" | "CANCELED" | "FINISHED";
export type MediaCategory = "ACADEMIA" | "TREINAMENTOS" | "CAMPEONATOS" | "ATLETAS" | "MEDALHAS" | "EQUIPE" | "EVENTOS";

export type Settings = {
  name: string;
  tagline: string;
  headline: string;
  subheadline: string;
  intro: string | null;
  historySummary: string | null;
  foundedYear: number | null;
  trainingHowItWorks: string | null;
  trainingBeginners: string | null;
  trainingAdvanced: string | null;
  trainingCompetition: string | null;
  facilities: string | null;
  addressStreet: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  latitude: number | null;
  longitude: number | null;
  mapsUrl: string | null;
  whatsapp: string | null;
  phone: string | null;
  email: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  youtubeUrl: string | null;
  tiktokUrl: string | null;
  openingHours: string | null;
  logoUrl: string | null;
  teamPhotoUrl: string | null;
  heroPosterUrl: string | null;
  heroVideoUrl: string | null;
  ogImageUrl: string | null;
  privacyContact: string | null;
};

export type Modality = {
  name: string;
  slug: string;
  summary: string | null;
  description: string | null;
  /** turmas, separadas por "·" (ex.: "Kids · Teens · Adulto") */
  audience: string | null;
  level: string | null;
  imageUrl: string | null;
};

export type Instructor = {
  name: string;
  slug: string;
  role: string | null;
  graduation: string | null;
  bio: string | null;
  photoUrl: string | null;
  instagram: string | null;
  /** slugs das modalidades */
  modalities: string[];
};

export type ClassSchedule = {
  /** slug da modalidade */
  modality: string;
  /** slug do professor */
  instructor: string | null;
  /** 0 = domingo … 6 = sábado */
  weekday: number;
  startTime: string;
  endTime: string;
  audience: string | null;
  level: string | null;
};

export type Athlete = {
  name: string;
  slug: string;
  nickname: string | null;
  category: string | null;
  modality: string | null;
  /** slug do professor */
  instructor: string | null;
  bio: string | null;
  photoUrl: string | null;
  coverUrl: string | null;
  instagram: string | null;
  otherSocialUrl: string | null;
  featured: boolean;
};

export type Championship = {
  name: string;
  slug: string;
  startDate: string;
  endDate: string | null;
  venue: string | null;
  city: string | null;
  state: string | null;
  organizer: string | null;
  level: string | null;
  description: string | null;
  coverUrl: string | null;
  officialUrl: string | null;
  featured: boolean;
};

export type Result = {
  /** slugs */
  championship: string;
  athlete: string;
  category: string | null;
  placement: string | null;
  medal: Medal;
};

export type NewsLink = {
  /** slug do campeonato relacionado */
  championship: string | null;
  title: string;
  url: string;
  source: string | null;
  publishedAt: string | null;
};

export type SportEvent = {
  name: string;
  slug: string;
  startDate: string | null;
  endDate: string | null;
  /** a contagem regressiva só aparece com a data oficialmente confirmada */
  dateConfirmed: boolean;
  venue: string | null;
  city: string | null;
  state: string | null;
  organizer: string | null;
  status: EventStatus;
  description: string | null;
  coverUrl: string | null;
  officialUrl: string | null;
  followUrl: string | null;
  /** atletas inscritos (slugs) e a categoria de cada um */
  athletes: { athlete: string; category: string | null }[];
};

export type MediaItem = {
  /** identificador único (ex.: "treino-2026-07-01") */
  id: string;
  type: "IMAGE" | "VIDEO" | "EMBED";
  url: string;
  thumbUrl: string | null;
  posterUrl: string | null;
  width: number | null;
  height: number | null;
  alt: string;
  caption: string | null;
  category: MediaCategory;
  /** slugs/ids relacionados (opcionais) */
  championship: string | null;
  event: string | null;
  athlete: string | null;
  timelineEntry: string | null;
  featured: boolean;
};

export type TimelineEntry = {
  id: string;
  year: number;
  month: number | null;
  title: string;
  description: string | null;
  coverUrl: string | null;
  videoUrl: string | null;
  /** slug do campeonato relacionado */
  championship: string | null;
};

export type Testimonial = {
  id: string;
  authorName: string;
  authorInfo: string | null;
  text: string;
  photoUrl: string | null;
};
