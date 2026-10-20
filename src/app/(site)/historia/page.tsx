import type { Metadata } from "next";
import { HistoryManifesto } from "@/components/home/history-manifesto";
import { HistoryStory } from "@/components/home/history-story";
import { Section } from "@/components/site/section";
import { Timeline } from "@/components/site/timeline";
import { JsonLd, breadcrumbJsonLd } from "@/components/site/json-ld";
import { modalityAudiences } from "@/lib/data/mappers";
import { getHistory, getModalities, getSettings, getTimeline } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Nossa história",
  description: "A história da Elite Thai e do professor Uanderley Moreira, o Carioca: da trajetória como atleta e campeão estadual ao Centro de Artes Marciais em Castelo/ES.",
  alternates: { canonical: "/historia" },
};

export default async function HistoriaPage() {
  const [settings, timeline, modalities, history] = await Promise.all([getSettings(), getTimeline(), getModalities(), getHistory()]);
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
      <HistoryStory story={history} />
      {items.length > 0 && (
        <Section>
          <div className="container-site">
            <Timeline items={items} />
          </div>
        </Section>
      )}
    </>
  );
}
