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

export const CHAMPIONSHIPS: Championship[] = [
  {
    name: "Kiffer Fight Night – 2ª edição",
    slug: "kiffer-fight-night-2026",
    startDate: "2026-06-27",
    endDate: null,
    venue: null,
    city: "Itaperuna",
    state: "RJ",
    organizer: "Kiffer Fight Night",
    level: null,
    description:
      "A Carol aceitou um grande desafio ao lutar em uma categoria acima da que está acostumada. Com a preparação e a estratégia certa, conquistou a vitória, com a instrutora da equipe ao lado na preparação e no córner.\n\nObrigado aos patrocinadores Salute Drogaria e Manipulação, Ollizstore e Restaurante Maria Bonita pelo apoio.",
    coverUrl: "/images/campeonatos/kiffer-fight-night-2026.webp",
    officialUrl: "https://www.instagram.com/kifferfightnight/",
    featured: true,
  },
  {
    name: "Thai Combat",
    slug: "thai-combat-serra-2026",
    startDate: "2026-05-30",
    endDate: null,
    venue: null,
    city: "Serra",
    state: "ES",
    organizer: null,
    level: null,
    description:
      "Atletas que perderam até 5 kg, enfrentaram o cansaço, a dor e a pressão para honrar a camisa da Elite Thai dentro do ringue. Alguns tiveram o braço levantado; outros, não — mas o resultado não apaga o que foi feito para chegar até ali.\n\nVitórias comemoramos. Derrotas estudamos.",
    coverUrl: "/images/campeonatos/thai-combat-serra-2026.webp",
    officialUrl: null,
    featured: false,
  },
];

export const RESULTS: Result[] = [];

export const NEWS: NewsLink[] = [];

export const EVENTS: SportEvent[] = [];
