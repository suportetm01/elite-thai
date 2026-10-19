import type { Metadata } from "next";
import { ChampionshipCard } from "@/components/site/cards";
import { JsonLd, breadcrumbJsonLd } from "@/components/site/json-ld";
import { Stagger, StaggerItem } from "@/components/site/reveal";
import { ChampionshipsShowcase } from "@/components/home/championships-showcase";
import { Section } from "@/components/site/section";
import { getChampionships, getStats } from "@/lib/data/public";
import { toChampionshipCard, toChampionshipShowcase } from "@/lib/data/mappers";

export const metadata: Metadata = {
  title: "Campeonatos disputados",
  description: "Campeonatos disputados pelos atletas da Elite Thai: datas, locais, resultados, medalhas, fotos e vídeos.",
  alternates: { canonical: "/campeonatos" },
};

export default async function CampeonatosPage() {
  const [championships, stats] = await Promise.all([getChampionships(), getStats()]);
  const items = championships.map(toChampionshipCard);
  const byYear = new Map<number, typeof items>();
  items.forEach((item) => {
    const year = new Date(item.startDate).getFullYear();
    byYear.set(year, [...(byYear.get(year) ?? []), item]);
  });

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Início", path: "/" }, { name: "Campeonatos", path: "/campeonatos" }])} />
      <ChampionshipsShowcase
        as="h1"
        index={null}
        showAllLink={false}
        mosaic={false}
        className="border-t-0 pt-36 md:pt-44"
        items={championships.map(toChampionshipShowcase)}
        stats={stats}
        intro="Onde a equipe se provou: local, resultados, medalhas, fotos e vídeos de cada competição — publicados a partir das informações oficiais da Elite Thai."
      />
      <Section className="pt-12 md:pt-16">
        <div className="container-site space-y-20">
          {[...byYear.entries()].map(([year, list]) => (
            <section key={year} aria-labelledby={`ano-${year}`}>
              <h2 id={`ano-${year}`} className="stat mb-8 flex items-center gap-6 text-7xl text-white/90">
                {year}
                <span className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" aria-hidden />
              </h2>
              <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((item) => (
                  <StaggerItem key={item.slug}>
                    <ChampionshipCard item={item} className="h-full" />
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
