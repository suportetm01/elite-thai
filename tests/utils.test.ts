import { test } from "node:test";
import assert from "node:assert/strict";
import { formatPhone, instagramHandle, normalizeWhatsapp, slugify, whatsappLink, youtubeEmbedUrl } from "../src/lib/format";
import { trialMessage, validateTrial } from "../src/lib/trial";

test("slugify remove acentos e caracteres especiais", () => {
  assert.equal(slugify("Campeonato Capixaba de Muay Thai — 2026!"), "campeonato-capixaba-de-muay-thai-2026");
  assert.equal(slugify("  João  Ávila  "), "joao-avila");
});

test("WhatsApp é normalizado com DDI e gera link wa.me", () => {
  assert.equal(normalizeWhatsapp("(28) 99999-1234"), "5528999991234");
  assert.equal(whatsappLink("28 99999-1234", "Olá"), "https://wa.me/5528999991234?text=Ol%C3%A1");
  assert.equal(whatsappLink(""), null);
  assert.equal(whatsappLink("1234"), null);
  assert.equal(formatPhone("5528999991234"), "(28) 99999-1234");
});

test("links de mídia e redes", () => {
  assert.equal(youtubeEmbedUrl("https://youtu.be/dQw4w9WgXcQ"), "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
  assert.equal(youtubeEmbedUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=1"), "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
  assert.equal(youtubeEmbedUrl("https://example.com"), null);
  assert.equal(instagramHandle("https://www.instagram.com/elite_thaii/"), "@elite_thaii");
});

const valid = {
  name: "Maria da Silva",
  ageRange: "18 a 29 anos",
  experience: "Nunca treinei",
  preferredTime: "Noite",
  modalityInterest: "",
  message: "",
  guardian: false,
};

test("formulário de aula experimental aceita dados válidos", () => {
  assert.deepEqual(validateTrial(valid), {});
});

test("formulário aponta nome curto e opções inválidas", () => {
  assert.ok(validateTrial({ ...valid, name: "Ma" }).name);
  assert.ok(validateTrial({ ...valid, ageRange: "qualquer" }).ageRange);
  assert.ok(validateTrial({ ...valid, preferredTime: "" }).preferredTime);
});

test("menor de idade exige declaração do responsável (LGPD)", () => {
  assert.ok(validateTrial({ ...valid, ageRange: "12 a 17 anos" }).guardian);
  assert.deepEqual(validateTrial({ ...valid, ageRange: "12 a 17 anos", guardian: true }), {});
});

test("mensagem do WhatsApp traz os dados do pedido", () => {
  const text = trialMessage({ ...valid, modalityInterest: "Muay Thai", message: "Tenho asma" }, "Elite Thai");
  assert.match(text, /aula experimental na Elite Thai/);
  assert.match(text, /Nome: Maria da Silva/);
  assert.match(text, /Modalidade: Muay Thai/);
  assert.match(text, /Observações: Tenho asma/);
  assert.equal(whatsappLink("+55 28 98111-6072", "Oi"), "https://wa.me/5528981116072?text=Oi");
});
