import type { Metadata } from "next";
import { Users } from "lucide-react";
import { AthleteCard } from "@/components/site/cards";
import { JsonLd, breadcrumbJsonLd } from "@/components/site/json-ld";
import { Stagger, StaggerItem } from "@/components/site/reveal";
import { EmptyState, PageHero, Section } from "@/components/site/section";
import { getAthletes } from "@/lib/data/public";
import { toAthleteCard } from "@/lib/data/mappers";

export const metadata: Metadata = {
  title: "Atletas",
  description: "Conheça os atletas da Elite Thai: trajetória, categorias, campeonatos disputados e medalhas conquistadas.",
  alternates: { canonical: "/atletas" },
};

export default async function AtletasPage() {
  const athletes = (await getAthletes()).map(toAthleteCard);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Início", path: "/" }, { name: "Atletas", path: "/atletas" }])} />
      <PageHero
        eyebrow="Atletas"
        title={
          <>
            Os nomes <span className="text-blood">da elite</span>
          </>
        }
        description="Atletas que representam a equipe dentro e fora do ringue. Resultados exibidos somente a partir dos registros oficiais."
      />
      <Section className="pt-12 md:pt-16">
        <div className="container-site">
          {athletes.length ? (
            <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" step={0.07}>
              {athletes.map((athlete, i) => (
                <StaggerItem key={athlete.slug}>
                  <AthleteCard athlete={athlete} priority={i < 4} />
                </StaggerItem>
              ))}
            </Stagger>
          ) : (
            <EmptyState title="Elenco em atualização" icon={<Users className="size-8" />}>
              Os perfis dos atletas são publicados pela equipe com autorização de uso de imagem (e dos responsáveis, no caso de menores).
            </EmptyState>
          )}
        </div>
      </Section>
    </>
  );
}
