import type { Championship, NewsLink, Result, SportEvent } from "./types";

/**
 * Campeonatos disputados, resultados, notícias e próximos eventos. Os números do site
 * (campeonatos, medalhas, atletas) são sempre calculados a partir destas listas.
 *
 * Exemplo de campeonato:
 * { name: "Copa Capixaba de Muay Thai", slug: "copa-capixaba-2026", startDate: "2026-07-01", endDate: null,
 *   venue: "Ginásio Municipal", city: "Vitória", state: "ES", organizer: null, level: "Estadual",
 *   description: null, coverUrl: "/images/campeonatos/copa-capixaba.jpg", officialUrl: null, featured: true }
 *
 * Exemplo de resultado:
 * { championship: "copa-capixaba-2026", athlete: "slug-do-atleta", category: "-60 kg", placement: "1º lugar", medal: "GOLD" }
 *
 * Eventos já encerrados ou cancelados saem da agenda automaticamente no próximo build.
 */

export const CHAMPIONSHIPS: Championship[] = [];

export const RESULTS: Result[] = [];

export const NEWS: NewsLink[] = [];

export const EVENTS: SportEvent[] = [];
