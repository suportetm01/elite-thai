import type { Metadata } from "next";
import Image from "@/components/site/smart-image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, ArrowUpRight, CalendarDays, Landmark, MapPin } from "lucide-react";
import { MedalTally, PhotoPlaceholder } from "@/components/site/cards";
import { CrowdOnView } from "@/components/site/crowd-on-view";
import { Gallery } from "@/components/site/gallery";
import { JsonLd, breadcrumbJsonLd } from "@/components/site/json-ld";
import { Reveal } from "@/components/site/reveal";
import { Section } from "@/components/site/section";
import { getChampionshipBySlug, getChampionshipSlugs } from "@/lib/data/public";
import { countMedals, toGalleryMedia } from "@/lib/data/mappers";
import { MEDAL_LABEL, formatDate, formatDateRange } from "@/lib/format";
import { absoluteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

// site estático: uma página por campeonato cadastrado em src/content/competitions.ts
export const dynamicParams = false;
export async function generateStaticParams() {
  const slugs = await getChampionshipSlugs();
  // a exportação exige ao menos uma página: sem campeonatos, gera só um "não encontrado" (noindex)
  return slugs.length ? slugs : [{ slug: "_" }];
}

export async function generateMetadata({ params }: PageProps<"/campeonatos/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const c = await getChampionshipBySlug(slug);
  if (!c) return { title: "Campeonato não encontrado" };
  const description = c.description?.slice(0, 155) ?? `${c.name} — participação da equipe Elite Thai, resultados e medalhas.`;
  return {
    title: c.name,
    description,
    alternates: { canonical: `/campeonatos/${c.slug}` },
    openGraph: { title: c.name, description, images: c.coverUrl ? [{ url: absoluteUrl(c.coverUrl) }] : undefined },
  };
}

export default function ChampionshipPage({ params }: PageProps<"/campeonatos/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-[80vh] animate-pulse bg-coal/40" />}>
      <ChampionshipDetail params={params} />
    </Suspense>
  );
}

const MEDAL_STYLE: Record<string, string> = {
  GOLD: "from-[#f3d68b] to-[#b8862f]",
  SILVER: "from-[#f2f2f2] to-[#8d939c]",
  BRONZE: "from-[#e3a36b] to-[#8a4f22]",
  NONE: "from-zinc-700 to-zinc-800",
};

async function ChampionshipDetail({ params }: { params: PageProps<"/campeonatos/[slug]">["params"] }) {
  const { slug } = await params;
  const c = await getChampionshipBySlug(slug);
  if (!c) notFound();
  const medals = countMedals(c.results);
  const place = [c.venue, [c.city, c.state].filter(Boolean).join("/")].filter(Boolean).join(" — ");

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Início", path: "/" },
            { name: "Campeonatos", path: "/campeonatos" },
            { name: c.name, path: `/campeonatos/${c.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "SportsEvent",
            name: c.name,
            startDate: c.startDate.toISOString(),
            endDate: c.endDate?.toISOString(),
            eventStatus: "https://schema.org/EventScheduled",
            location: place ? { "@type": "Place", name: c.venue ?? place, address: [c.city, c.state].filter(Boolean).join(", ") } : undefined,
            organizer: c.organizer ? { "@type": "Organization", name: c.organizer } : undefined,
            image: c.coverUrl ? absoluteUrl(c.coverUrl) : undefined,
          },
        ]}
      />
      {medals.gold + medals.silver + medals.bronze > 0 && <CrowdOnView />}
      <header className="film-grain relative overflow-hidden pb-16 pt-32 md:pt-40">
        <div className="absolute inset-0" aria-hidden>
          {c.coverUrl ? <Image src={c.coverUrl} alt="" fill priority sizes="100vw" className="object-cover opacity-30" /> : <PhotoPlaceholder />}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/40" />
        </div>
        <div className="container-site relative">
          <Link href="/campeonatos" className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
            <ArrowLeft className="size-4" /> Campeonatos
          </Link>
          <Reveal>
            {c.level && <p className="eyebrow text-gold">{c.level}</p>}
            <h1 className="display mt-2 max-w-5xl text-[clamp(3rem,8vw,7rem)] text-white">{c.name}</h1>
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2 text-zinc-300">
              <span className="flex items-center gap-2">
                <CalendarDays className="size-4 text-blood" aria-hidden /> {formatDateRange(c.startDate, c.endDate)}
              </span>
              {place && (
                <span className="flex items-center gap-2">
                  <MapPin className="size-4 text-blood" aria-hidden /> {place}
                </span>
              )}
              {c.organizer && (
                <span className="flex items-center gap-2">
                  <Landmark className="size-4 text-blood" aria-hidden /> {c.organizer}
                </span>
              )}
            </div>
            <MedalTally medals={medals} size="lg" className="mt-8" />
          </Reveal>
        </div>
      </header>

      <Section className="py-16">
        <div className="container-site grid gap-14 lg:grid-cols-[1fr_1.3fr]">
          <div>
            {c.description && <p className="whitespace-pre-line text-lg leading-relaxed text-zinc-300">{c.description}</p>}
            {c.officialUrl && (
              <a href={c.officialUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost-line mt-8">
                Página oficial do evento <ArrowUpRight className="size-4" />
              </a>
            )}
            {c.news.length > 0 && (
              <div className="mt-12">
                <h2 className="eyebrow text-gold">Notícias relacionadas</h2>
                <ul className="mt-4 divide-y divide-white/[0.06] border-y border-white/[0.06]">
                  {c.news.map((n) => (
                    <li key={n.id}>
                      <a href={n.url} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-4 py-4">
                        <span>
                          <span className="block text-white group-hover:text-gold">{n.title}</span>
                          <span className="text-xs text-zinc-500">{[n.source, n.publishedAt ? formatDate(n.publishedAt) : null].filter(Boolean).join(" · ")}</span>
                        </span>
                        <ArrowUpRight className="size-4 shrink-0 text-zinc-500" aria-hidden />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div>
            <h2 className="display text-5xl text-white">Atletas e resultados</h2>
            {c.results.length ? (
              <ul className="mt-8 grid gap-3">
                {c.results.map((r) => (
                  <li key={r.id} className="panel flex items-center gap-4 p-4">
                    <span className={cn("grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br text-xs font-bold text-black", MEDAL_STYLE[r.medal])} aria-hidden>
                      {r.medal === "NONE" ? "" : MEDAL_LABEL[r.medal][0]}
                    </span>
                    <div className="min-w-0 flex-1">
                      <Link href={`/atletas/${r.athlete.slug}`} className="font-semibold text-white hover:text-gold">
                        {r.athlete.name}
                        {r.athlete.nickname ? <span className="text-zinc-500"> “{r.athlete.nickname}”</span> : null}
                      </Link>
                      <p className="text-sm text-zinc-500">{[r.category, r.placement].filter(Boolean).join(" · ") || "Participação"}</p>
                    </div>
                    <span className="text-sm font-semibold text-zinc-300">{r.medal === "NONE" ? "" : MEDAL_LABEL[r.medal]}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-6 text-zinc-500">Resultados ainda não publicados.</p>
            )}
          </div>
        </div>
      </Section>

      {c.media.length > 0 && (
        <Section className="py-16">
          <div className="container-site">
            <h2 className="display mb-8 text-5xl text-white">Fotos e vídeos</h2>
            <Gallery items={c.media.map(toGalleryMedia)} filters={false} />
          </div>
        </Section>
      )}
    </>
  );
}
