import type { Metadata } from "next";
import { CalendarCheck2, MessageSquareText, Send } from "lucide-react";
import { PageHero, Section } from "@/components/site/section";
import { TrialForm } from "@/components/site/trial-form";
import { ScheduleTable } from "@/components/site/schedule-table";
import { getModalities, getSchedules, getSettings } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Aula experimental de Muay Thai",
  description: "Agende uma aula experimental na Elite Thai, centro de artes marciais em Santo Andrezinho, Castelo/ES. Muay Thai, Boxe, MMA, Karatê e Taekwondo.",
  alternates: { canonical: "/aula-experimental" },
};

const steps = [
  { icon: Send, title: "Preencha o pedido", text: "Leva menos de um minuto." },
  { icon: MessageSquareText, title: "Envie pelo WhatsApp", text: "A conversa abre com a mensagem pronta; a equipe confirma turma e horário." },
  { icon: CalendarCheck2, title: "Aula agendada", text: "Com a confirmação, é só chegar no horário combinado." },
];

export default async function TrialPage() {
  const [modalities, schedules, settings] = await Promise.all([getModalities(), getSchedules(), getSettings()]);
  return (
    <>
      <PageHero
        eyebrow="Aula experimental"
        title={
          <>
            Seu primeiro passo <span className="text-blood">na elite</span>
          </>
        }
        description={`Conheça a ${settings.name} na prática. Preencha o pedido e envie pelo WhatsApp: a equipe confirma com você a turma e o horário.`}
      />
      <Section className="pt-12 md:pt-16">
        <div className="container-site grid gap-12 lg:grid-cols-[1fr_380px]">
          <TrialForm modalities={modalities.map((m) => m.name)} whatsapp={settings.whatsapp} academy={settings.name} />
          <aside className="space-y-6">
            <ol className="space-y-4">
              {steps.map((step, i) => (
                <li key={step.title} className="panel flex gap-4 p-5">
                  <span className="stat text-4xl text-blood">{i + 1}</span>
                  <div>
                    <p className="flex items-center gap-2 font-[family-name:var(--font-barlow)] text-lg font-bold uppercase tracking-wide text-white">
                      <step.icon className="size-4 text-gold" aria-hidden />
                      {step.title}
                    </p>
                    <p className="mt-1 text-sm text-zinc-400">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="text-xs leading-relaxed text-zinc-500">
              O pedido vai direto para o WhatsApp da academia; nenhum dado fica guardado neste site. Para menores de idade, a
              solicitação deve ser feita pelo responsável legal.
            </p>
          </aside>
        </div>
        {schedules.length > 0 && (
          <div className="container-site mt-20">
            <h2 className="display text-5xl text-white">Horários das turmas</h2>
            <div className="mt-8">
              <ScheduleTable schedules={schedules} />
            </div>
          </div>
        )}
      </Section>
    </>
  );
}
