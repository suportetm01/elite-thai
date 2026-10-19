import type { Modality, Settings } from "./types";

/**
 * Informações da academia. Campos `null` simplesmente não aparecem no site — nada é
 * inventado. Para mudar um texto, edite aqui e gere o site de novo (`npm run build`).
 */
export const SETTINGS: Settings = {
  name: "Elite Thai",
  tagline: "Centro de Artes Marciais",
  headline: "MAIS QUE UMA EQUIPE. UMA ELITE.",
  subheadline: "Disciplina. Respeito. Evolução.",
  intro: null,
  historySummary: null,
  foundedYear: null,
  trainingHowItWorks: null,
  trainingBeginners: null,
  trainingAdvanced: null,
  trainingCompetition: null,
  facilities: null,
  addressStreet: null,
  neighborhood: "Santo Andrezinho",
  city: "Castelo",
  state: "ES",
  postalCode: null,
  latitude: null,
  longitude: null,
  mapsUrl: null,
  whatsapp: "+55 28 98111-6072",
  phone: null,
  email: null,
  instagramUrl: "https://www.instagram.com/elite_thaii/",
  facebookUrl: null,
  youtubeUrl: null,
  tiktokUrl: null,
  openingHours: null,
  /** logotipo e fotos próprios (vazio = usa os padrões de `src/lib/site-media.ts`) */
  logoUrl: null,
  teamPhotoUrl: null,
  heroPosterUrl: null,
  heroVideoUrl: null,
  ogImageUrl: null,
  privacyContact: null,
};

/** Modalidades, na ordem em que aparecem no site. */
export const MODALITIES: Modality[] = [
  {
    name: "Muay Thai",
    slug: "muay-thai",
    summary: "A arte das oito armas: punhos, cotovelos, joelhos e canelas.",
    description:
      "Arte marcial e esporte de combate de origem tailandesa. O treino desenvolve técnica de golpes, defesa, clinch, condicionamento físico, coordenação e confiança.",
    audience: "Kids · Teens · Adulto · Feminino",
    level: null,
    imageUrl: null,
  },
  {
    name: "Boxe",
    slug: "boxe",
    summary: "Socos, esquivas, bloqueios e movimentação de pernas.",
    description:
      "Esporte de combate baseado exclusivamente em golpes de punho. Trabalha precisão, ritmo, reflexo, defesa e alto condicionamento cardiovascular.",
    audience: null,
    level: null,
    imageUrl: null,
  },
  {
    name: "MMA",
    slug: "mma",
    summary: "Artes marciais mistas: trocação, quedas e solo.",
    description: "Modalidade que integra golpes em pé, quedas e luta no solo, exigindo preparo físico completo e versatilidade técnica.",
    audience: null,
    level: null,
    imageUrl: null,
  },
  {
    name: "Karatê",
    slug: "karate",
    summary: "Disciplina, técnica e autocontrole.",
    description:
      "Arte marcial de origem japonesa que desenvolve golpes de mãos e pernas, postura, concentração e respeito por meio da prática tradicional.",
    audience: null,
    level: null,
    imageUrl: null,
  },
  {
    name: "Taekwondo",
    slug: "taekwondo",
    summary: "Chutes rápidos, precisão e flexibilidade.",
    description:
      "Arte marcial de origem coreana e esporte olímpico, reconhecida pela velocidade e variedade de chutes. Desenvolve equilíbrio, flexibilidade e foco.",
    audience: null,
    level: null,
    imageUrl: null,
  },
  {
    name: "Personal Fight",
    slug: "personal-fight",
    summary: "Treino individual de luta.",
    description: "Sessões individuais com acompanhamento direto, adaptadas ao objetivo de cada aluno.",
    audience: null,
    level: null,
    imageUrl: null,
  },
];
