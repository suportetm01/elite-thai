import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { BrandMark } from "@/components/brand/logo";
import { HeroBackdrop } from "@/components/home/hero-backdrop";
import { HeroPoster } from "@/components/home/hero-poster";
import type { Settings } from "@/lib/data/public";
import { TRIAL_PATH } from "@/lib/site";
import { SITE_MEDIA } from "@/lib/site-media";

export function HeroSection({ settings, modalities }: { settings: Settings; modalities: string[] }) {
  const place = [settings.neighborhood, [settings.city, settings.state].filter(Boolean).join("/")].filter(Boolean).join(" • ");
  const [first, ...rest] = settings.headline.split(". ");
  const marquee = modalities.length ? modalities : ["Muay Thai"];

  return (
    <section
      id="inicio"
      aria-labelledby="hero-title"
      className="film-grain relative flex min-h-[100svh] w-full flex-col overflow-hidden bg-ink [--hero-p:0]"
    >
      <HeroBackdrop>
        {/* a imagem do painel tem prioridade; sem ela, a foto de treino padrão */}
        <HeroPoster videoUrl={settings.heroVideoUrl} posterUrl={settings.heroPosterUrl ?? SITE_MEDIA.heroBackdrop} />
      </HeroBackdrop>

      {/* Legibilidade do texto e escurecimento progressivo na rolagem */}
      <div className="vignette pointer-events-none absolute inset-0" aria-hidden />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/20 md:bg-gradient-to-r md:from-ink/90 md:via-ink/60 md:to-transparent"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-ink" style={{ opacity: "calc(var(--hero-p) * 0.85)" }} aria-hidden />

      <div
        className="container-site pointer-events-none relative z-10 flex flex-1 flex-col justify-end pb-28 pt-28 md:justify-center md:pb-24"
        style={{ transform: "translateY(calc(var(--hero-p) * -90px))", opacity: "calc(1 - var(--hero-p) * 1.4)" }}
      >
        <div className="pointer-events-auto max-w-[44rem]">
          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-3 duration-700">
            <BrandMark logoUrl={settings.logoUrl} priority className="size-20 md:size-24" />
            <div>
              <p className="eyebrow text-gold">{settings.tagline}</p>
              {place && <p className="mt-1 text-sm text-zinc-400">{place}</p>}
            </div>
          </div>

          <h1 id="hero-title" className="display mt-7 text-[clamp(3.4rem,10.5vw,8.6rem)] text-white animate-in fade-in slide-in-from-bottom-6 duration-1000">
            {rest.length ? (
              <>
                {first}.
                <br />
                <span className="text-blood">{rest.join(". ")}</span>
              </>
            ) : (
              settings.headline
            )}
          </h1>

          <p className="mt-5 font-[family-name:var(--font-barlow)] text-xl font-semibold uppercase tracking-[0.32em] text-zinc-300 animate-in fade-in duration-1000 md:text-2xl">
            {settings.subheadline}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Link href={TRIAL_PATH} className="btn-blood px-7 py-4 text-base">
              Agendar aula experimental
            </Link>
            <Link href="#elite-thai" className="btn-ghost-line px-7 py-4 text-base">
              Conhecer a Elite Thai
            </Link>
          </div>
        </div>
      </div>

      <a
        href="#elite-thai"
        className="absolute bottom-20 right-8 z-10 hidden flex-col items-center gap-2 text-zinc-500 transition-colors hover:text-white lg:flex"
        aria-label="Rolar para conhecer a Elite Thai"
      >
        <span className="eyebrow text-[0.65rem]">Role</span>
        <ChevronDown className="size-4 animate-bounce" />
      </a>

      {/* Faixa com as modalidades oferecidas (dados do cadastro) */}
      <div className="absolute inset-x-0 bottom-0 z-10 overflow-hidden border-t border-white/[0.06] bg-ink/70 py-3 backdrop-blur" aria-label="Modalidades">
        <div className="marquee-track flex w-max gap-10 whitespace-nowrap">
          {[0, 1, 2, 3].map((n) => (
            <div key={n} className="flex gap-10" aria-hidden={n > 0}>
              {marquee.map((name) => (
                <span key={`${n}-${name}`} className="display flex items-center gap-10 text-2xl text-zinc-500">
                  {name}
                  <span className="size-1.5 rotate-45 bg-blood" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
