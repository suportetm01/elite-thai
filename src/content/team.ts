import type { Athlete, ClassSchedule, Instructor } from "./types";

/**
 * Professores, grade de horários e atletas. Listas vazias mostram no site um estado
 * honesto ("em atualização") — nunca nomes ou horários inventados.
 *
 * Exemplo de professor:
 * { name: "Nome Sobrenome", slug: "nome-sobrenome", role: "Head Coach", graduation: "Kru",
 *   bio: null, photoUrl: "/images/equipe/nome.jpg", instagram: "@perfil", modalities: ["muay-thai"] }
 *
 * Exemplo de horário (segunda, 19h–20h):
 * { modality: "muay-thai", instructor: "nome-sobrenome", weekday: 1, startTime: "19:00", endTime: "20:00",
 *   audience: "Adulto", level: null }
 *
 * Atletas: cadastre somente com autorização de uso de imagem (e do responsável, se menor).
 */

export const INSTRUCTORS: Instructor[] = [
  {
    name: "Uanderley Moreira",
    slug: "uanderley-moreira",
    role: "Fundador · Professor de Muay Thai",
    graduation: "“Carioca” · campeão estadual como atleta",
    bio: "Começou a praticar Muay Thai aos 14 anos. Antes de se tornar professor, disputou campeonatos estaduais, eventos de outras equipes e o Campeonato Brasileiro, conquistando também o título de campeão estadual. A vivência nos treinos e nas competições orienta o ensino, respeitando os objetivos e o ritmo de cada aluno.",
    photoUrl: "/images/equipe/uanderley-moreira.webp",
    instagram: "@_uanderleymoreira_",
    modalities: ["muay-thai"],
  },
];

export const SCHEDULES: ClassSchedule[] = [];

export const ATHLETES: Athlete[] = [];
