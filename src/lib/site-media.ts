/**
 * Mídias padrão do site, tiradas do Instagram da academia (@elite_thaii e parceiros), com
 * autorização de quem aparece e dos responsáveis pelos menores. Quando `src/content/site.ts`
 * define uma foto própria (ex.: `teamPhotoUrl`), ela tem prioridade sobre estas.
 */
export const SITE_MEDIA = {
  history: {
    src: "/images/historia-graduacao-2025.webp",
    alt: "Turma adulta da Elite Thai com os certificados da graduação, ajoelhada sob a placa da academia",
  },
  team: {
    src: "/images/equipe-elite-thai.webp",
    alt: "Alunos, atletas e professores da Elite Thai reunidos em frente à academia",
  },
  /** fundos decorativos (o texto da seção já diz tudo; a foto não precisa de descrição) —
   *  na abertura, professor e atleta antes da luta; na faixa, o professor orientando a turma
   *  (ambas do post da graduação de dezembro/2025) */
  heroBackdrop: "/images/hero-treino.webp",
  band: "/images/fundo-professor.webp",
  trialBackdrop: "/images/equipe-elite-thai.webp",
  highlights: {
    src: "/videos/destaques-luta.mp4",
    poster: "/videos/destaques-luta-capa.webp",
    href: "https://www.instagram.com/elite_thaii/reel/DaS2PrROoKN/",
    label: "Melhores momentos de uma luta de atleta da Elite Thai",
  },
} as const;
