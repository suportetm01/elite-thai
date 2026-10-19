import type { Metadata } from "next";
import { Images } from "lucide-react";
import { Gallery } from "@/components/site/gallery";
import { JsonLd, breadcrumbJsonLd } from "@/components/site/json-ld";
import { EmptyState, PageHero, Section } from "@/components/site/section";
import { getGallery, getSettings } from "@/lib/data/public";
import { toGalleryMedia } from "@/lib/data/mappers";

export const metadata: Metadata = {
  title: "Galeria",
  description: "Fotos e vídeos da Elite Thai: academia, treinamentos, campeonatos, atletas, medalhas, equipe e eventos.",
  alternates: { canonical: "/galeria" },
};

export default async function GaleriaPage() {
  const [items, settings] = await Promise.all([getGallery(), getSettings()]);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Início", path: "/" }, { name: "Galeria", path: "/galeria" }])} />
      <PageHero
        eyebrow="Galeria"
        title={
          <>
            Momentos <span className="text-blood">da equipe</span>
          </>
        }
        description="Toque em uma foto para ampliar. No celular, deslize para navegar entre as imagens."
      />
      <Section className="pt-12 md:pt-16">
        <div className="container-site">
          {items.length ? (
            <Gallery items={items.map(toGalleryMedia)} />
          ) : (
            <EmptyState title="Galeria em preparação" icon={<Images className="size-8" />}>
              As fotos e vídeos oficiais são publicados pela equipe com autorização de uso de imagem.
              {settings.instagramUrl && (
                <>
                  {" "}Enquanto isso, acompanhe o{" "}
                  <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-white underline underline-offset-4 hover:text-gold">
                    Instagram oficial
                  </a>
                  .
                </>
              )}
            </EmptyState>
          )}
        </div>
      </Section>
    </>
  );
}
