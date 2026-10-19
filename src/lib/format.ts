// Utilitários de formatação compartilhados (servidor e cliente).

const TZ = "America/Sao_Paulo";

export function formatDate(value: Date | string | null | undefined, options?: Intl.DateTimeFormatOptions) {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  return new Intl.DateTimeFormat("pt-BR", { timeZone: TZ, day: "2-digit", month: "long", year: "numeric", ...options }).format(date);
}

export function formatShortDate(value: Date | string | null | undefined) {
  return formatDate(value, { day: "2-digit", month: "short", year: "numeric" });
}

export function formatDateRange(start: Date | string | null | undefined, end?: Date | string | null) {
  if (!start) return "Data a confirmar";
  if (!end) return formatDate(start);
  const s = new Date(start);
  const e = new Date(end);
  if (s.toDateString() === e.toDateString()) return formatDate(s);
  return `${formatDate(s, { day: "2-digit", month: "short" })} – ${formatDate(e)}`;
}

export function formatMonthYear(value: Date | string) {
  return formatDate(value, { day: undefined, month: "long", year: "numeric" });
}

export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Mantém somente dígitos; adiciona DDI 55 quando o número parece brasileiro. */
export function normalizeWhatsapp(value: string) {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10 || digits.length === 11) return `55${digits}`;
  return digits;
}

export function whatsappLink(number: string | null | undefined, message?: string) {
  if (!number) return null;
  const digits = normalizeWhatsapp(number);
  if (digits.length < 12) return null;
  const text = message ? `?text=${encodeURIComponent(message)}` : "";
  return `https://wa.me/${digits}${text}`;
}

export function formatPhone(value: string | null | undefined) {
  if (!value) return "";
  const d = value.replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return value;
}

export function instagramHandle(url: string | null | undefined) {
  if (!url) return null;
  const match = url.match(/instagram\.com\/([^/?#]+)/i);
  return match ? `@${match[1]}` : url.startsWith("@") ? url : `@${url}`;
}

export function instagramUrl(value: string | null | undefined) {
  if (!value) return null;
  if (/^https?:\/\//.test(value)) return value;
  return `https://www.instagram.com/${value.replace(/^@/, "")}/`;
}

export const WEEKDAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

export const MEDAL_LABEL = { GOLD: "Ouro", SILVER: "Prata", BRONZE: "Bronze", NONE: "Sem medalha" } as const;

export const EVENT_STATUS_LABEL = {
  TENTATIVE: "A confirmar",
  CONFIRMED: "Confirmado",
  REGISTRATION_OPEN: "Inscrições abertas",
  POSTPONED: "Adiado",
  CANCELED: "Cancelado",
  FINISHED: "Encerrado",
} as const;

export const MEDIA_CATEGORY_LABEL = {
  ACADEMIA: "Academia",
  TREINAMENTOS: "Treinamentos",
  CAMPEONATOS: "Campeonatos",
  ATLETAS: "Atletas",
  MEDALHAS: "Medalhas",
  EQUIPE: "Equipe",
  EVENTOS: "Eventos",
} as const;

export const LEAD_STATUS_LABEL = {
  NEW: "Novo",
  CONTACTED: "Contatado",
  SCHEDULED: "Aula agendada",
  ATTENDED: "Compareceu",
  ENROLLED: "Matriculado",
  NOT_INTERESTED: "Sem interesse",
  ARCHIVED: "Arquivado",
} as const;

export const ROLE_LABEL = { OWNER: "Proprietário", ADMIN: "Administrador", EDITOR: "Editor" } as const;

/** Extrai o ID de vídeos do YouTube para incorporação respeitando privacidade (youtube-nocookie). */
export function youtubeEmbedUrl(url: string | null | undefined) {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/);
  return match ? `https://www.youtube-nocookie.com/embed/${match[1]}` : null;
}

export function isInstagramUrl(url: string | null | undefined) {
  return Boolean(url && /instagram\.com\/(p|reel|tv)\//.test(url));
}
