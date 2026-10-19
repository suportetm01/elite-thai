// Formulário de aula experimental: opções e a mensagem enviada pelo WhatsApp.
// Nada é guardado no site — o pedido vai direto para a conversa com a academia.

export const AGE_RANGES = ["Até 11 anos", "12 a 17 anos", "18 a 29 anos", "30 a 44 anos", "45 anos ou mais"] as const;
export const MINOR_RANGES: readonly string[] = ["Até 11 anos", "12 a 17 anos"];
export const EXPERIENCE = ["Nunca treinei", "Já treinei outra luta", "Já treinei Muay Thai", "Sou atleta/competidor"] as const;
export const PREFERRED_TIMES = ["Manhã", "Tarde", "Noite", "Qualquer horário"] as const;

export type TrialRequest = {
  name: string;
  ageRange: string;
  experience: string;
  preferredTime: string;
  modalityInterest: string;
  message: string;
  guardian: boolean;
};

export type TrialErrors = Partial<Record<keyof TrialRequest, string>>;

/** Valida o pedido; devolve as mensagens de erro por campo (vazio = válido). */
export function validateTrial(data: TrialRequest): TrialErrors {
  const errors: TrialErrors = {};
  const name = data.name.trim();
  if (name.length < 3) errors.name = "Informe seu nome completo.";
  else if (name.length > 120) errors.name = "Nome muito longo.";
  if (!(AGE_RANGES as readonly string[]).includes(data.ageRange)) errors.ageRange = "Selecione a faixa etária.";
  if (!(EXPERIENCE as readonly string[]).includes(data.experience)) errors.experience = "Selecione sua experiência.";
  if (!(PREFERRED_TIMES as readonly string[]).includes(data.preferredTime)) errors.preferredTime = "Selecione o horário preferido.";
  if (data.message.trim().length > 600) errors.message = "Mensagem muito longa (máx. 600 caracteres).";
  if (MINOR_RANGES.includes(data.ageRange) && !data.guardian) {
    errors.guardian = "Para menores de idade, a solicitação deve ser feita pelo responsável legal.";
  }
  return errors;
}

/** Texto que chega no WhatsApp da academia. */
export function trialMessage(data: TrialRequest, academy: string) {
  return [
    `Olá! Quero agendar uma aula experimental na ${academy}.`,
    "",
    `Nome: ${data.name.trim()}`,
    `Idade: ${data.ageRange}${data.guardian ? " (sou o responsável legal)" : ""}`,
    `Experiência: ${data.experience}`,
    `Horário preferido: ${data.preferredTime}`,
    data.modalityInterest ? `Modalidade: ${data.modalityInterest}` : null,
    data.message.trim() ? `Observações: ${data.message.trim()}` : null,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}
