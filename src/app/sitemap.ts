import type { MetadataRoute } from "next";
import { getAthleteSlugs, getChampionshipSlugs } from "@/lib/data/public";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [athletes, championships] = await Promise.all([getAthleteSlugs(), getChampionshipSlugs()]);
  const pages: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/aula-experimental", priority: 0.9, changeFrequency: "monthly" },
    { path: "/treinamentos", priority: 0.9, changeFrequency: "monthly" },
    { path: "/atletas", priority: 0.8, changeFrequency: "weekly" },
    { path: "/campeonatos", priority: 0.8, changeFrequency: "weekly" },
    { path: "/agenda", priority: 0.8, changeFrequency: "weekly" },
    { path: "/historia", priority: 0.7, changeFrequency: "monthly" },
    { path: "/galeria", priority: 0.6, changeFrequency: "weekly" },
    { path: "/privacidade", priority: 0.2, changeFrequency: "monthly" },
  ];
  return [
    ...pages.map((p) => ({ url: `${SITE_URL}${p.path}`, priority: p.priority, changeFrequency: p.changeFrequency })),
    ...athletes.map((a) => ({ url: `${SITE_URL}/atletas/${a.slug}`, priority: 0.6 })),
    ...championships.map((c) => ({ url: `${SITE_URL}/campeonatos/${c.slug}`, priority: 0.6 })),
  ];
}
