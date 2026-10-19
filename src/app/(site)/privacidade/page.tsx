import type { Metadata } from "next";
import { PageHero, Section } from "@/components/site/section";
import { getSettings } from "@/lib/data/public";
import { formatPhone } from "@/lib/format";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: "Como a Elite Thai trata dados pessoais conforme a Lei Geral de Proteção de Dados (LGPD).",
  alternates: { canonical: "/privacidade" },
};

export default async function PrivacidadePage() {
  const s = await getSettings();
  const contact = s.privacyContact || s.email || (s.whatsapp ? `WhatsApp ${formatPhone(s.whatsapp)}` : null) || "os canais oficiais da academia";
  return (
    <>
      <PageHero eyebrow="LGPD" title="Política de privacidade" description="Como este site trata (e não guarda) dados pessoais, e como você pode exercer seus direitos." />
      <Section className="pt-12">
        <div className="container-site max-w-3xl space-y-10 leading-relaxed text-zinc-300 [&_h2]:display [&_h2]:text-4xl [&_h2]:text-white [&_li]:ml-5 [&_li]:list-disc [&_ul]:mt-3 [&_ul]:space-y-2">
          <p className="text-sm text-zinc-500">Última atualização: 19 de outubro de 2026.</p>
          <section>
            <h2>1. Quem somos</h2>
            <p className="mt-3">
              {s.name} — {s.tagline}
              {s.city ? `, ${s.city}/${s.state ?? ""}` : ""} — é a responsável por este site, nos termos da Lei nº 13.709/2018 (LGPD).
            </p>
          </section>
          <section>
            <h2>2. O site não coleta dados pessoais</h2>
            <p className="mt-3">
              Este é um site informativo: não tem cadastro, login, banco de dados nem estatísticas de visita, e não usa cookies.
            </p>
          </section>
          <section>
            <h2>3. Pedido de aula experimental</h2>
            <p className="mt-3">
              O formulário de aula experimental apenas monta uma mensagem no seu próprio aparelho e abre o WhatsApp para você enviá-la. Nada
              é guardado no site. Os dados que você decidir enviar (nome, faixa etária, experiência, horário preferido, modalidade e
              observações) chegam à academia pela conversa no WhatsApp e são usados somente para combinar a aula. O WhatsApp tem a sua
              própria política de privacidade.
            </p>
          </section>
          <section>
            <h2>4. Conteúdo de terceiros</h2>
            <p className="mt-3">
              Mapas e vídeos de terceiros (Google Maps, YouTube) só são carregados quando você pede. Os links para o Instagram e o WhatsApp
              abrem os serviços dessas empresas, que seguem as próprias regras de privacidade.
            </p>
          </section>
          <section>
            <h2>5. Imagens de alunos e atletas</h2>
            <p className="mt-3">
              Fotos e vídeos de alunos e atletas são publicados somente com autorização de uso de imagem — e, no caso de menores de idade,
              com autorização do responsável legal. Para pedir a retirada de uma imagem, fale com a equipe.
            </p>
          </section>
          <section>
            <h2>6. Seus direitos</h2>
            <p className="mt-3">
              Você pode pedir informações, correção ou exclusão dos dados que enviou à academia pelo WhatsApp, além de retirar a autorização
              de uso de imagem (art. 18 da LGPD).
            </p>
          </section>
          <section>
            <h2>7. Contato</h2>
            <p className="mt-3">Para exercer seus direitos ou tirar dúvidas sobre privacidade, fale com a equipe por {contact}.</p>
          </section>
        </div>
      </Section>
    </>
  );
}
