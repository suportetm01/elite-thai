import type { Metadata } from "next";
import { CalendarClock } from "lucide-react";
import { EventCard } from "@/components/site/cards";
import { JsonLd, breadcrumbJsonLd } from "@/components/site/json-ld";
import { Stagger, StaggerItem } from "@/components/site/reveal";
import { EmptyState, PageHero, Section } from "@/components/site/section";
import { getUpcomingEvents } from "@/lib/data/public";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Próximos campeonatos",
  description: "Agenda de competições e eventos da equipe Elite Thai: datas, locais, status, atletas confirmados e links oficiais.",
  alternates: { canonical: "/agenda" },
};

export default async function AgendaPage() {
  const events = await getUpcomingEvents();
  const groups = new Map<string, typeof events>();
  events.forEach((e) => {
    const key =
      e.dateConfirmed && e.startDate
        ? new Date(e.startDate).toLocaleDateString("pt-BR", { month: "long", year: "numeric", timeZone: "America/Sao_Paulo" })
        : "Data a confirmar";
    groups.set(key, [...(groups.get(key) ?? []), e]);
  });

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "Início", path: "/" }, { name: "Agenda", path: "/agenda" }]),
          ...events
            .filter((e) => e.dateConfirmed && e.startDate)
            .map((e) => ({
              "@context": "https://schema.org",
              "@type": "SportsEvent",
              name: e.name,
              startDate: e.startDate!.toISOString(),
              endDate: e.endDate?.toISOString(),
              eventStatus: e.status === "POSTPONED" ? "https://schema.org/EventPostponed" : "https://schema.org/EventScheduled",
              location: e.venue || e.city ? { "@type": "Place", name: e.venue ?? e.city, address: [e.city, e.state].filter(Boolean).join(", ") } : undefined,
              url: e.officialUrl ?? absoluteUrl("/agenda"),
            })),
        ]}
      />
      <PageHero
        eyebrow="Próximos campeonatos"
        title={
          <>
            Agenda de <span className="text-blood">combate</span>
          </>
        }
        description="A contagem regressiva aparece apenas para eventos com data oficialmente confirmada."
      />
      <Section className="pt-12 md:pt-16">
        <div className="container-site space-y-16">
          {events.length === 0 && (
            <EmptyState title="Nenhum evento anunciado" icon={<CalendarClock className="size-8" />}>
              Assim que novas competições forem confirmadas, elas aparecerão aqui com data, local e atletas inscritos.
            </EmptyState>
          )}
          {[...groups.entries()].map(([label, list]) => (
            <section key={label} aria-labelledby={`grupo-${label}`}>
              <h2 id={`grupo-${label}`} className="eyebrow mb-6 text-gold first-letter:uppercase">
                {label}
              </h2>
              <Stagger className="grid gap-4">
                {list.map((event) => (
                  <StaggerItem key={event.id}>
                    <EventCard event={event} />
                  </StaggerItem>
                ))}
              </Stagger>
            </section>
          ))}
        </div>
      </Section>
    </>
  );
}
