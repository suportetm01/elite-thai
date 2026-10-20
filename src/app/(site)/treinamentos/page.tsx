import Link from "next/link";
import type { Metadata } from "next";
import Image from "@/components/site/smart-image";
import { Activity, Brain, Dumbbell, Flame, HeartPulse, Shield } from "lucide-react";
import { InstagramIcon } from "@/components/brand/social-icons";
import { PhotoPlaceholder } from "@/components/site/cards";
import { JsonLd, breadcrumbJsonLd } from "@/components/site/json-ld";
import { Reveal, Stagger, StaggerItem } from "@/components/site/reveal";
import { ScheduleTable } from "@/components/site/schedule-table";
import { PageHero, Section, SectionHeading } from "@/components/site/section";
import { getInstructors, getModalities, getSchedules, getSettings } from "@/lib/data/public";
import { instagramHandle, instagramUrl, whatsappLink } from "@/lib/format";
import { TRIAL_PATH } from "@/lib/site";

export const metadata: Metadata = {
  title: "Treinamentos",
  description: "Muay Thai, Boxe, MMA, Karatê e Taekwondo em Castelo/ES. Conheça as modalidades, professores, horários e benefícios do treino na Elite Thai.",
  alternates: { canonical: "/treinamentos" },
};

// Benefícios gerais da prática (informação sobre o esporte, não sobre a academia)
const BENEFITS = [
  { icon: HeartPulse, title: "Condicionamento", text: "Treinos intensos e intervalados melhoram a capacidade cardiorrespiratória." },
  { icon: Dumbbell, title: "Força e resistência", text: "Socos, chutes e joelhadas trabalham o corpo inteiro, do core às pernas." },
  { icon: Activity, title: "Coordenação", text: "Combinações de golpes e movimentação desenvolvem equilíbrio e agilidade." },
  { icon: Shield, title: "Defesa pessoal", text: "Técnicas reais de ataque e defesa aumentam a confiança no dia a dia." },
  { icon: Brain, title: "Foco e disciplina", text: "A rotina de treino e o respeito às regras fortalecem o controle emocional." },
  { icon: Flame, title: "Gasto energético", text: "Aulas dinâmicas favorecem o gasto calórico e o bem-estar." },
];

export default async function TreinamentosPage() {
  const [settings, modalities, instructors, schedules] = await Promise.all([getSettings(), getModalities(), getInstructors(), getSchedules()]);
  const levels = [
    { title: "Iniciantes", text: settings.trainingBeginners },
    { title: "Avançados", text: settings.trainingAdvanced },
    { title: "Preparação para competições", text: settings.trainingCompetition },
  ].filter((l) => l.text);
  const wa = whatsappLink(settings.whatsapp, "Olá! Gostaria de saber os horários das aulas.");
  // numeração só das seções que aparecem
  const numbered = ["modalidades", instructors.length > 0 && "professores", "horarios", settings.facilities && "estrutura", "beneficios"].filter(Boolean);
  const n = (key: string) => String(numbered.indexOf(key) + 1).padStart(2, "0");

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Início", path: "/" }, { name: "Treinamentos", path: "/treinamentos" }])} />
      <PageHero
        eyebrow="Treinamentos"
        title={
          <>
            Do primeiro treino <span className="text-blood">ao ringue</span>
          </>
        }
        description={`Aulas para crianças e adultos em ${modalities.map((m) => m.name).join(", ")}.`}
      />

      {settings.trainingHowItWorks && (
        <Section className="py-16 md:py-20">
          <div className="container-site grid gap-10 lg:grid-cols-[1fr_1.4fr]">
            <SectionHeading eyebrow="Como funcionam as aulas" title="O método" />
            <Reveal>
              <p className="whitespace-pre-line text-lg leading-relaxed text-zinc-300">{settings.trainingHowItWorks}</p>
            </Reveal>
          </div>
        </Section>
      )}

      {levels.length > 0 && (
        <Section className="py-16">
          <div className="container-site">
            <Stagger className="grid gap-5 md:grid-cols-3">
              {levels.map((level, i) => (
                <StaggerItem key={level.title} className="panel cut-corner-br h-full p-8">
                  <p className="stat text-5xl text-blood">{String(i + 1).padStart(2, "0")}</p>
                  <h2 className="display mt-3 text-4xl text-white">{level.title}</h2>
                  <p className="mt-3 whitespace-pre-line leading-relaxed text-zinc-400">{level.text}</p>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </Section>
      )}

      <Section>
        <div className="container-site">
          <SectionHeading index={n("modalidades")} eyebrow="Modalidades" title={<>O que você <span className="text-blood">pode treinar</span></>} />
          <div className="mt-12 grid gap-px border border-white/[0.07] bg-white/[0.07] md:grid-cols-2">
            {modalities.map((m) => (
              <article key={m.id} id={m.slug} className="relative scroll-mt-28 bg-ink p-8 md:p-10">
                {m.imageUrl && (
                  <div className="relative mb-6 aspect-[16/9] overflow-hidden">
                    <Image src={m.imageUrl} alt={m.name} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
                  </div>
                )}
                <h3 className="display text-5xl text-white">{m.name}</h3>
                {m.audience && <p className="eyebrow mt-2 text-gold">{m.audience}</p>}
                {m.summary && <p className="mt-4 text-lg text-zinc-200">{m.summary}</p>}
                {m.description && <p className="mt-3 leading-relaxed text-zinc-400">{m.description}</p>}
                {m.level && <p className="mt-4 text-sm text-zinc-500">Nível: {m.level}</p>}
              </article>
            ))}
          </div>
        </div>
      </Section>

      {instructors.length > 0 && (
        <Section className="border-t border-white/[0.06]">
          <div className="container-site">
            <SectionHeading index={n("professores")} eyebrow="Professores" title={<>Quem <span className="text-blood">conduz o treino</span></>} />
            <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {instructors.map((p) => (
                <StaggerItem key={p.id}>
                  <article className="panel h-full overflow-hidden">
                    <div className="relative aspect-[4/5]">
                      {p.photoUrl ? <Image src={p.photoUrl} alt={`Professor ${p.name}`} fill sizes="(min-width: 1024px) 33vw, 100vw" className="object-cover" /> : <PhotoPlaceholder label={p.name.split(" ")[0]} />}
                      <div className="absolute inset-0 bg-gradient-to-t from-coal via-transparent to-transparent" />
                    </div>
                    <div className="p-6">
                      {p.role && <p className="eyebrow text-gold">{p.role}</p>}
                      <h3 className="display mt-1 text-4xl text-white">{p.name}</h3>
                      {p.graduation && <p className="mt-1 text-sm text-zinc-400">{p.graduation}</p>}
                      {p.modalities.length > 0 && <p className="mt-2 text-xs uppercase tracking-[0.18em] text-zinc-500">{p.modalities.map((m) => m.name).join(" · ")}</p>}
                      {p.bio && <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-zinc-400">{p.bio}</p>}
                      {p.instagram && (
                        <a href={instagramUrl(p.instagram)!} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm text-gold hover:underline">
                          <InstagramIcon className="size-4" /> {instagramHandle(instagramUrl(p.instagram))}
                        </a>
                      )}
                    </div>
                  </article>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </Section>
      )}

      <Section className="border-t border-white/[0.06]">
        <div className="container-site">
          <SectionHeading index={n("horarios")} eyebrow="Horários" title={<>Grade de <span className="text-blood">aulas</span></>} />
          <div className="mt-12">
            {schedules.length ? (
              <ScheduleTable schedules={schedules} />
            ) : (
              <p className="max-w-xl text-zinc-400">
                A grade de horários é informada diretamente pela equipe.{" "}
                {wa ? (
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="text-white underline underline-offset-4 hover:text-gold">
                    Consulte pelo WhatsApp
                  </a>
                ) : (
                  "Solicite uma aula experimental para receber as opções disponíveis."
                )}
              </p>
            )}
          </div>
        </div>
      </Section>

      {settings.facilities && (
        <Section className="border-t border-white/[0.06]">
          <div className="container-site grid gap-10 lg:grid-cols-[1fr_1.4fr]">
            <SectionHeading index={n("estrutura")} eyebrow="Estrutura" title="O espaço" />
            <p className="whitespace-pre-line text-lg leading-relaxed text-zinc-300">{settings.facilities}</p>
          </div>
        </Section>
      )}

      <Section className="border-t border-white/[0.06]">
        <div className="container-site">
          <SectionHeading index={n("beneficios")} eyebrow="Por que treinar" title={<>Benefícios do <span className="text-blood">Muay Thai</span></>} />
          <Stagger className="mt-12 grid gap-px border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <StaggerItem key={b.title} className="bg-ink p-8">
                <b.icon className="size-7 text-blood" aria-hidden />
                <h3 className="display mt-5 text-3xl text-white">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{b.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
          <div className="mt-14">
            <Link href={TRIAL_PATH} className="btn-blood px-8 py-4 text-base">
              Agendar aula experimental
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}
