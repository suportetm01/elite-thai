import type { Metadata } from "next";
import Image from "@/components/site/smart-image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { InstagramIcon } from "@/components/brand/social-icons";
import { MedalTally, PhotoPlaceholder } from "@/components/site/cards";
import { Gallery } from "@/components/site/gallery";
import { JsonLd, breadcrumbJsonLd } from "@/components/site/json-ld";
import { Reveal } from "@/components/site/reveal";
import { Section } from "@/components/site/section";
import { getAthleteBySlug, getAthleteSlugs } from "@/lib/data/public";
import { countMedals, toGalleryMedia } from "@/lib/data/mappers";
import { EVENT_STATUS_LABEL, MEDAL_LABEL, formatDate, formatShortDate, instagramHandle, instagramUrl } from "@/lib/format";
import { absoluteUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

// site estático: uma página por atleta cadastrado em src/content/team.ts
export const dynamicParams = false;
export async function generateStaticParams() {
  const slugs = await getAthleteSlugs();
  // a exportação exige ao menos uma página: sem atletas, gera só um "não encontrado" (noindex)
  return slugs.length ? slugs : [{ slug: "_" }];
}

export async function generateMetadata({ params }: PageProps<"/atletas/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const athlete = await getAthleteBySlug(slug);
  if (!athlete) return { title: "Atleta não encontrado" };
  const title = athlete.nickname ? `${athlete.name} “${athlete.nickname}”` : athlete.name;
  const description = athlete.bio?.slice(0, 155) ?? `Perfil de ${athlete.name}, atleta da Elite Thai${athlete.category ? ` — ${athlete.category}` : ""}.`;
  return {
    title,
    description,
    alternates: { canonical: `/atletas/${athlete.slug}` },
    openGraph: { title, description, images: athlete.photoUrl ? [{ url: absoluteUrl(athlete.photoUrl) }] : undefined, type: "profile" },
  };
}

export default function AthletePage({ params }: PageProps<"/atletas/[slug]">) {
  return (
    <Suspense fallback={<div className="min-h-[80vh] animate-pulse bg-coal/40" />}>
      <AthleteDetail params={params} />
    </Suspense>
  );
}

async function AthleteDetail({ params }: { params: PageProps<"/atletas/[slug]">["params"] }) {
  const { slug } = await params;
  const athlete = await getAthleteBySlug(slug);
  if (!athlete) notFound();

  const medals = countMedals(athlete.results);
  const competitions = new Set(athlete.results.map((r) => r.championshipId)).size;
  const [first, ...rest] = athlete.name.split(" ");
  const instructor = athlete.instructor;
  const instagram = instagramUrl(athlete.instagram);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd([
            { name: "Início", path: "/" },
            { name: "Atletas", path: "/atletas" },
            { name: athlete.name, path: `/atletas/${athlete.slug}` },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "Person",
            name: athlete.name,
            alternateName: athlete.nickname ?? undefined,
            image: athlete.photoUrl ? absoluteUrl(athlete.photoUrl) : undefined,
            memberOf: { "@type": "SportsTeam", name: "Elite Thai" },
            sameAs: [instagram, athlete.otherSocialUrl].filter(Boolean),
          },
        ]}
      />
      <header className="film-grain relative overflow-hidden pb-16 pt-32 md:pt-40">
        <div className="absolute inset-0" aria-hidden>
          {athlete.coverUrl && <Image src={athlete.coverUrl} alt="" fill priority sizes="100vw" className="object-cover opacity-25" />}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/30" />
          <p className="display absolute -right-6 bottom-0 select-none text-[22vw] leading-none text-white/[0.03]">{first}</p>
        </div>
        <div className="container-site relative grid items-end gap-10 md:grid-cols-[minmax(0,420px)_1fr]">
          <Reveal className="relative aspect-[3/4] overflow-hidden border border-white/10 cut-corner-br">
            {athlete.photoUrl ? (
              <Image src={athlete.photoUrl} alt={`Foto de ${athlete.name}`} fill priority sizes="(min-width: 768px) 420px, 100vw" className="object-cover" />
            ) : (
              <PhotoPlaceholder label={first} />
            )}
          </Reveal>
          <Reveal delay={0.1}>
            <Link href="/atletas" className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-white">
              <ArrowLeft className="size-4" /> Atletas
            </Link>
            {athlete.nickname && <p className="eyebrow text-gold">“{athlete.nickname}”</p>}
            <h1 className="display mt-2 text-[clamp(3.5rem,9vw,8rem)] text-white">
              {first} <span className="text-blood">{rest.join(" ")}</span>
            </h1>
            <dl className="mt-6 grid max-w-xl grid-cols-2 gap-x-8 gap-y-4 text-sm">
              {athlete.modality && (
                <div>
                  <dt className="eyebrow text-[0.68rem] text-zinc-500">Modalidade</dt>
                  <dd className="mt-1 text-white">{athlete.modality}</dd>
                </div>
              )}
              {athlete.category && (
                <div>
                  <dt className="eyebrow text-[0.68rem] text-zinc-500">Categoria</dt>
                  <dd className="mt-1 text-white">{athlete.category}</dd>
                </div>
              )}
              {instructor && (
                <div>
                  <dt className="eyebrow text-[0.68rem] text-zinc-500">Professor responsável</dt>
                  <dd className="mt-1 text-white">{instructor.name}</dd>
                </div>
              )}
              {competitions > 0 && (
                <div>
                  <dt className="eyebrow text-[0.68rem] text-zinc-500">Campeonatos</dt>
                  <dd className="stat mt-1 text-3xl text-white">{competitions}</dd>
                </div>
              )}
            </dl>
            <MedalTally medals={medals} size="lg" className="mt-8" />
            <div className="mt-8 flex flex-wrap gap-3">
              {instagram && (
                <a href={instagram} target="_blank" rel="noopener noreferrer" className="btn-ghost-line px-4 py-2.5 text-sm">
                  <InstagramIcon className="size-4" /> {instagramHandle(instagram)}
                </a>
              )}
              {athlete.otherSocialUrl && (
                <a href={athlete.otherSocialUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost-line px-4 py-2.5 text-sm">
                  <ExternalLink className="size-4" /> Rede social
                </a>
              )}
            </div>
          </Reveal>
        </div>
      </header>

      {athlete.bio && (
        <Section className="py-16 md:py-20">
          <div className="container-site max-w-4xl">
            <p className="eyebrow text-gold">Biografia</p>
            <p className="mt-4 whitespace-pre-line text-lg leading-relaxed text-zinc-300">{athlete.bio}</p>
          </div>
        </Section>
      )}

      {athlete.eventEntries.length > 0 && (
        <Section className="py-12">
          <div className="container-site">
            <h2 className="display text-5xl text-white">Próximos compromissos</h2>
            <ul className="mt-6 grid gap-3 md:grid-cols-2">
              {athlete.eventEntries.map((entry) => (
                <li key={entry.eventId} className="panel flex items-center justify-between gap-4 p-5">
                  <div>
                    <p className="font-semibold text-white">{entry.event.name}</p>
                    <p className="text-sm text-zinc-500">
                      {entry.event.dateConfirmed && entry.event.startDate ? formatDate(entry.event.startDate) : "Data a confirmar"}
                      {entry.category ? ` · ${entry.category}` : ""}
                    </p>
                  </div>
                  <span className="text-xs uppercase tracking-[0.18em] text-gold">{EVENT_STATUS_LABEL[entry.event.status]}</span>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      <Section className="py-16">
        <div className="container-site">
          <h2 className="display text-5xl text-white">Histórico competitivo</h2>
          {athlete.results.length ? (
            <div className="mt-8 overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-zinc-500">
                    <th scope="col" className="eyebrow py-3 pr-4 text-[0.68rem]">Data</th>
                    <th scope="col" className="eyebrow py-3 pr-4 text-[0.68rem]">Campeonato</th>
                    <th scope="col" className="eyebrow py-3 pr-4 text-[0.68rem]">Categoria</th>
                    <th scope="col" className="eyebrow py-3 pr-4 text-[0.68rem]">Resultado</th>
                    <th scope="col" className="eyebrow py-3 text-[0.68rem]">Medalha</th>
                  </tr>
                </thead>
                <tbody>
                  {athlete.results.map((r) => (
                    <tr key={r.id} className="border-b border-white/[0.05]">
                      <td className="py-4 pr-4 text-zinc-400">{formatShortDate(r.championship.startDate)}</td>
                      <td className="py-4 pr-4">
                        <Link href={`/campeonatos/${r.championship.slug}`} className="font-semibold text-white hover:text-gold">
                          {r.championship.name}
                        </Link>
                      </td>
                      <td className="py-4 pr-4 text-zinc-400">{r.category ?? "—"}</td>
                      <td className="py-4 pr-4 text-zinc-300">{r.placement ?? "—"}</td>
                      <td className={cn("py-4 font-semibold", r.medal === "GOLD" ? "text-gold" : r.medal === "NONE" ? "text-zinc-600" : "text-zinc-200")}>
                        {r.medal === "NONE" ? "—" : MEDAL_LABEL[r.medal]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-6 text-zinc-500">Nenhum resultado oficial publicado ainda.</p>
          )}
        </div>
      </Section>

      {athlete.media.length > 0 && (
        <Section className="py-16">
          <div className="container-site">
            <h2 className="display mb-8 text-5xl text-white">Fotos e vídeos</h2>
            <Gallery items={athlete.media.map(toGalleryMedia)} filters={false} />
          </div>
        </Section>
      )}
    </>
  );
}
