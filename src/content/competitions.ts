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
  {
    name: "Campos Fight – 4ª edição",
    slug: "campos-fight-2026",
    startDate: "2026-04-12",
    endDate: null,
    venue: null,
    city: "Campos dos Goytacazes",
    state: "RJ",
    organizer: "Campos Fight",
    level: null,
    description:
      "Confrontos interestaduais contra equipes do Rio de Janeiro e de Minas Gerais. Foram 2 vitórias — sobre um atleta de MG e sobre o atleta da casa — e uma derrota que serviu para acender ainda mais o fogo.\n\nQuem cai e levanta é mais perigoso.",
    coverUrl: "/images/campeonatos/campos-fight-2026.webp",
    officialUrl: "https://www.instagram.com/camposfightoficial/",
    featured: false,
  },
  {
    name: "Campeonato Estadual de Muay Thai",
    slug: "estadual-es-2025",
    startDate: "2025-07-06",
    endDate: null,
    venue: null,
    city: null,
    state: "ES",
    organizer: null,
    level: "Estadual",
    description:
      "A Elite Thai levou 7 atletas ao Estadual e voltou com 8 medalhas: 5 de ouro e 3 de prata. Um dos atletas subiu ao lugar mais alto do pódio em duas categorias, e quatro garantiram vaga no Campeonato Brasileiro.\n\nTodos, para o professor, já eram campeões independentemente do resultado.",
    coverUrl: "/images/campeonatos/estadual-es-2025.webp",
    officialUrl: null,
    featured: false,
  },
];

/**
 * Kiffer Fight Night: card oficial (@kifferfightnight, 20/06/2026) e post da equipe.
 * Campos Fight: card oficial (@camposfightoficial, março/2026) e post da própria atleta.
 */
export const RESULTS: Result[] = [
  { championship: "kiffer-fight-night-2026", athlete: "ana-carolina", category: "Muay Thai amador · 59 kg", placement: "Vitória", medal: "NONE" },
  { championship: "campos-fight-2026", athlete: "maria-victoria", category: "Feminino · até 55 kg", placement: "Vitória", medal: "NONE" },
];

export const NEWS: NewsLink[] = [
  {
    championship: "estadual-es-2025",
    title: "Equipe de Castelo conquista 8 medalhas no Estadual de Muay Thai",
    url: "https://aquinoticias.com/linha-de-fundo/esportes/equipe-de-castelo-conquista-8-medalhas-no-estadual-de-muay-thai/",
    source: "Aqui Notícias",
    publishedAt: "2025-07-08",
  },
];

export const EVENTS: SportEvent[] = [];
