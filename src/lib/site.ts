// Constantes do site compartilhadas entre servidor e cliente.

/**
 * Endereço público, usado no build (SEO, sitemap, imagem de compartilhamento): o domínio
 * próprio em NEXT_PUBLIC_SITE_URL ou, na Vercel, o endereço de produção do projeto.
 */
const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || (vercelUrl ? `https://${vercelUrl}` : "http://localhost:3000")).replace(/\/$/, "");

export const NAV_ITEMS = [
  { href: "/historia", label: "História" },
  { href: "/atletas", label: "Atletas" },
  { href: "/campeonatos", label: "Campeonatos" },
  { href: "/agenda", label: "Agenda" },
  { href: "/treinamentos", label: "Treinos" },
  { href: "/galeria", label: "Galeria" },
] as const;

export const TRIAL_PATH = "/aula-experimental";

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
