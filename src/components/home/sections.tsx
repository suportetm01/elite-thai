import Image from "@/components/site/smart-image";
import Link from "next/link";
import { ArrowUpRight, Clock, MapPin } from "lucide-react";
import { InstagramIcon, WhatsappIcon } from "@/components/brand/social-icons";
import { AthleteCard, EventCard, PhotoPlaceholder, type AthleteCardData, type EventCardData } from "@/components/site/cards";
import { Reveal, Stagger, StaggerItem } from "@/components/site/reveal";
import { Section, SectionHeading } from "@/components/site/section";
import { MapEmbed } from "@/components/home/map-embed";
import type { Settings } from "@/lib/data/public";
import { formatPhone, instagramHandle, whatsappLink } from "@/lib/format";
import { TRIAL_PATH } from "@/lib/site";
import { SITE_MEDIA } from "@/lib/site-media";

/* 6 · Próximos eventos */
export function EventsSection({ events, index }: { events: EventCardData[]; index: string }) {
  if (!events.length) return null;
  return (
    <Section>
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            index={index}
            eyebrow="Próximos eventos"
            title={
              <>
                Próxima <span className="text-blood">luta</span>
              </>
            }
          />
          <Link href="/agenda" className="btn-ghost-line">
            Agenda completa <ArrowUpRight className="size-4" />
          </Link>
        </div>
        <Stagger className="mt-12 grid gap-4">
          {events.slice(0, 3).map((event) => (
            <StaggerItem key={event.id}>
              <EventCard event={event} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}

/* 7 · Atletas em destaque (transição Campeonatos → Atletas) */
export function AthletesSection({ athletes, index }: { athletes: AthleteCardData[]; index: string }) {
  if (!athletes.length) return null;
  return (
    <Section className="bg-[linear-gradient(180deg,transparent,rgba(227,38,54,0.05)_40%,transparent)]">
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            index={index}
            eyebrow="Atletas"
            title={
              <>
                Quem leva <span className="text-blood">o nome</span>
              </>
            }
          />
          <Link href="/atletas" className="btn-ghost-line">
            Conhecer os atletas <ArrowUpRight className="size-4" />
          </Link>
        </div>
        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" step={0.1}>
          {athletes.map((athlete) => (
            <StaggerItem key={athlete.slug}>
              <AthleteCard athlete={athlete} />
            </StaggerItem>
          ))}
          <StaggerItem>
            <NextAthleteCard />
          </StaggerItem>
        </Stagger>
      </div>
    </Section>
  );
}

/** Último card da grade de atletas: convite para a aula experimental, com um atleta no córner. */
function NextAthleteCard() {
  return (
    <Link
      href={TRIAL_PATH}
      className="group relative block aspect-[3/4] overflow-hidden border border-blood/40 bg-coal outline-offset-4 cut-corner-br"
    >
      <Image
        src={SITE_MEDIA.nextAthlete}
        alt=""
        fill
        sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 80vw"
        className="object-cover object-top transition-transform duration-700 ease-[var(--ease-cinematic)] group-hover:scale-[1.06]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="eyebrow text-gold">Sua vez</p>
        <p className="display mt-1 text-4xl text-white md:text-5xl">
          O próximo <span className="text-blood">é você</span>
        </p>
        <p className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-300 group-hover:text-white">
          Agendar aula experimental <ArrowUpRight className="size-4" />
        </p>
      </div>
    </Link>
  );
}

/* 8 · Treinamentos */
export function TrainingSection({ modalities, index }: { modalities: { name: string; slug: string; summary: string | null; audience: string | null }[]; index: string }) {
  return (
    <Section className="border-t border-white/[0.06]">
      <div className="container-site">
        <SectionHeading
          index={index}
          eyebrow="Treinamentos"
          title={
            <>
              Suor, técnica <span className="text-blood">e respeito</span>
            </>
          }
          description="Treinos para crianças e adultos, em modalidades de trocação e artes marciais tradicionais."
        />
        <Stagger className="mt-12 grid content-start gap-x-12 gap-y-3 md:grid-cols-2">
          {modalities.map((m, i) => (
            <StaggerItem key={m.slug}>
              <Link href={`/treinamentos#${m.slug}`} className="group flex items-baseline gap-5 border-b border-white/[0.07] pb-4">
                <span className="stat text-2xl text-zinc-600 transition-colors group-hover:text-blood">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex-1">
                  <span className="display block text-4xl text-white transition-colors group-hover:text-gold-soft">{m.name}</span>
                  {(m.summary || m.audience) && <span className="mt-1 block text-sm text-zinc-500">{[m.summary, m.audience].filter(Boolean).join(" · ")}</span>}
                </span>
                <ArrowUpRight className="size-5 text-zinc-600 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-white" aria-hidden />
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}

/* 9 · Galeria */
/** A prévia da galeria só aparece com pelo menos 3 fotos. */
export const GALLERY_PREVIEW_MIN = 3;

export function GalleryPreview({ items, index }: { index: string; items: { id: string; url: string; thumbUrl: string | null; alt: string; width: number | null; height: number | null; blurDataUrl: string | null }[] }) {
  if (items.length < GALLERY_PREVIEW_MIN) return null;
  return (
    <Section>
      <div className="container-site">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading index={index} eyebrow="Galeria" title={<>Por trás <span className="text-blood">das luvas</span></>} />
          <Link href="/galeria" className="btn-ghost-line">
            Abrir galeria <ArrowUpRight className="size-4" />
          </Link>
        </div>
        <div className="mt-12 columns-2 gap-3 md:columns-3 [&>*]:mb-3">
          {items.map((item) => (
            <Reveal key={item.id} y={20}>
              <Link href="/galeria" className="group relative block overflow-hidden">
                <Image
                  src={item.thumbUrl ?? item.url}
                  alt={item.alt}
                  width={item.width ?? 800}
                  height={item.height ?? 1000}
                  sizes="(min-width: 768px) 33vw, 50vw"
                  placeholder={item.blurDataUrl ? "blur" : "empty"}
                  blurDataURL={item.blurDataUrl ?? undefined}
                  className="h-auto w-full transition-transform duration-700 ease-[var(--ease-cinematic)] group-hover:scale-105"
                />
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* 10 · Depoimentos reais (com autorização) */
export function TestimonialsSection({ items, index }: { index: string; items: { id: string; authorName: string; authorInfo: string | null; text: string; photoUrl: string | null }[] }) {
  if (!items.length) return null;
  return (
    <Section className="border-t border-white/[0.06]">
      <div className="container-site">
        <SectionHeading index={index} eyebrow="Depoimentos" title={<>Quem treina, <span className="text-blood">conta</span></>} />
        <Stagger className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 6).map((t) => (
            <StaggerItem key={t.id}>
              <figure className="panel flex h-full flex-col p-7">
                <span className="display text-7xl leading-none text-blood" aria-hidden>
                  “
                </span>
                <blockquote className="-mt-4 flex-1 leading-relaxed text-zinc-300">{t.text}</blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  {t.photoUrl ? (
                    <Image src={t.photoUrl} alt="" width={44} height={44} className="size-11 rounded-full object-cover" />
                  ) : (
                    <span className="grid size-11 place-items-center rounded-full bg-white/5 font-[family-name:var(--font-barlow)] font-bold text-gold">{t.authorName[0]}</span>
                  )}
                  <span>
                    <span className="block font-semibold text-white">{t.authorName}</span>
                    {t.authorInfo && <span className="block text-xs text-zinc-500">{t.authorInfo}</span>}
                  </span>
                </figcaption>
              </figure>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}

/* 11 · Convite para aula experimental */
export function TrialInvite({ settings }: { settings: Settings }) {
  const wa = whatsappLink(settings.whatsapp, "Olá! Quero agendar uma aula experimental na Elite Thai.");
  return (
    <section className="film-grain relative overflow-hidden border-y border-blood/30 bg-[linear-gradient(120deg,#1a0508,#080808_55%,#1a0508)] py-24 md:py-32">
      {/* foto da turma: no celular, um quadro 16:9 no topo sumindo para baixo; no computador, à direita, sumindo para o lado do texto */}
      <div className="pointer-events-none absolute inset-x-0 top-0 aspect-[16/9] opacity-45 [mask-image:linear-gradient(180deg,black_45%,transparent)] md:inset-y-0 md:left-[30%] md:aspect-auto md:opacity-60 md:[mask-image:linear-gradient(90deg,transparent_5%,black_60%)]" aria-hidden>
        <Image src={SITE_MEDIA.trialBackdrop} alt="" fill sizes="(min-width: 768px) 70vw, 100vw" className="object-cover object-[50%_45%]" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(26,5,8,0.85),rgba(26,5,8,0.15)_55%,rgba(8,8,8,0.6))]" />
      </div>
      <div className="container-site relative">
        <Reveal className="max-w-3xl">
          <p className="eyebrow text-gold">Aula experimental</p>
          <h2 className="display mt-4 text-[clamp(3.2rem,9vw,7.5rem)] text-white">
            O primeiro round <span className="text-blood">é seu.</span>
          </h2>
          <p className="mt-6 max-w-xl text-lg text-zinc-300">Preencha o pedido, envie pelo WhatsApp e a equipe confirma com você a turma e o horário.</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href={TRIAL_PATH} className="btn-blood px-8 py-4 text-base">
              Agendar aula experimental
            </Link>
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-ghost-line px-8 py-4 text-base">
                <WhatsappIcon className="size-5" /> Falar no WhatsApp
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* 12 · Localização e redes sociais */
export function LocationSection({ settings, index }: { settings: Settings; index: string }) {
  const address = [settings.addressStreet, settings.neighborhood, [settings.city, settings.state].filter(Boolean).join(" - "), settings.postalCode].filter(Boolean).join(", ");
  const query = settings.addressStreet ? address : `${settings.name} ${address}`;
  const wa = whatsappLink(settings.whatsapp, "Olá! Vim pelo site da Elite Thai.");
  return (
    <Section>
      <div className="container-site grid gap-12 lg:grid-cols-[1fr_1.3fr]">
        <div>
          <SectionHeading index={index} eyebrow="Onde treinar" title={<>Venha conhecer <span className="text-blood">a academia</span></>} />
          <ul className="mt-10 space-y-6">
            {address && (
              <li className="flex gap-4">
                <MapPin className="mt-1 size-5 shrink-0 text-blood" aria-hidden />
                <div>
                  <p className="eyebrow text-[0.7rem] text-zinc-500">Endereço</p>
                  <p className="mt-1 text-lg text-white">{address}</p>
                  {settings.mapsUrl && (
                    <a href={settings.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex items-center gap-1 text-sm text-gold hover:underline">
                      Abrir no mapa <ArrowUpRight className="size-3.5" />
                    </a>
                  )}
                </div>
              </li>
            )}
            {settings.openingHours && (
              <li className="flex gap-4">
                <Clock className="mt-1 size-5 shrink-0 text-blood" aria-hidden />
                <div>
                  <p className="eyebrow text-[0.7rem] text-zinc-500">Funcionamento</p>
                  <p className="mt-1 whitespace-pre-line text-white">{settings.openingHours}</p>
                </div>
              </li>
            )}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            {settings.instagramUrl && (
              <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost-line">
                <InstagramIcon className="size-5" /> {instagramHandle(settings.instagramUrl)}
              </a>
            )}
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-ghost-line">
                <WhatsappIcon className="size-5" /> {formatPhone(settings.whatsapp)}
              </a>
            )}
          </div>
        </div>
        <MapEmbed query={query} latitude={settings.latitude} longitude={settings.longitude} />
      </div>
    </Section>
  );
}

export { PhotoPlaceholder };
