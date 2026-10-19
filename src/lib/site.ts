// Constantes do site compartilhadas entre servidor e cliente.

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");

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
