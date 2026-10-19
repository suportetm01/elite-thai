import type { MediaItem, Testimonial, TimelineEntry } from "./types";

/**
 * Galeria, linha do tempo e depoimentos. Publique apenas fotos, vídeos e depoimentos com
 * autorização de quem aparece (e dos responsáveis, no caso de menores).
 *
 * Exemplo de foto da galeria:
 * { id: "treino-2026-10-08", type: "IMAGE", url: "/images/galeria/treino.jpg", thumbUrl: null, posterUrl: null,
 *   width: 1440, height: 960, alt: "Alunos treinando chutes no aparador", caption: null, category: "TREINAMENTOS",
 *   championship: null, event: null, athlete: null, timelineEntry: null, featured: false }
 *
 * Exemplo de marco da história:
 * { id: "fundacao", year: 2020, month: 3, title: "Fundação da Elite Thai", description: null,
 *   coverUrl: null, videoUrl: null, championship: null }
 */

export const MEDIA: MediaItem[] = [];

export const TIMELINE: TimelineEntry[] = [];

export const TESTIMONIALS: Testimonial[] = [];
