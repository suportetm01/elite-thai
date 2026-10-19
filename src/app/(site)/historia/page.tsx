import type { Metadata } from "next";
import { History } from "lucide-react";
import { HistoryManifesto } from "@/components/home/history-manifesto";
import { EmptyState, Section } from "@/components/site/section";
import { Timeline } from "@/components/site/timeline";
import { JsonLd, breadcrumbJsonLd } from "@/components/site/json-ld";
import { modalityAudiences } from "@/lib/data/mappers";
import { getModalities, getSettings, getTimeline } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Nossa história",
  description: "A trajetória da Elite Thai, centro de artes marciais em Castelo/ES: marcos, conquistas e momentos importantes da equipe.",
  alternates: { canonical: "/historia" },
};

export default async function HistoriaPage() {
  const [settings, timeline, modalities] = await Promise.all([getSettings(), getTimeline(), getModalities()]);
  const items = timeline.map((t) => ({
    id: t.id,
    year: t.year,
    month: t.month,
    title: t.title,
    description: t.description,
    coverUrl: t.coverUrl,
    videoUrl: t.videoUrl,
    championship: t.championship,
    media: t.media.map((m) => ({ id: m.id, url: m.url, thumbUrl: m.thumbUrl, alt: m.alt })),
  }));

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Início", path: "/" }, { name: "Nossa história", path: "/historia" }])} />
      <HistoryManifesto
        as="h1"
        index={null}
        showLink={false}
        showEntries={false}
        className="pt-36 md:pt-44"
        settings={settings}
        modalities={modalities.map((m) => m.name)}
        audiences={modalityAudiences(modalities)}
        timeline={timeline}
      />
      <Section>
        <div className="container-site">
          {items.length ? (
            <Timeline items={items} />
          ) : (
            <EmptyState title="Linha do tempo em construção" icon={<History className="size-8" />}>
              Os marcos oficiais da equipe — fundação, primeiros campeonatos e conquistas — serão publicados aqui pela própria Elite Thai.
            </EmptyState>
          )}
        </div>
      </Section>
    </>
  );
}
