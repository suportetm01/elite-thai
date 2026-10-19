import { BentoSection } from "@/components/home/bento-section";
import { ChampionshipsShowcase } from "@/components/home/championships-showcase";
import { HeroSection } from "@/components/home/hero-section";
import { HistoryManifesto } from "@/components/home/history-manifesto";
import { PhotoBand } from "@/components/home/photo-band";
import {
  AthletesSection,
  EventsSection,
  GALLERY_PREVIEW_MIN,
  GalleryPreview,
  LocationSection,
  TestimonialsSection,
  TrainingSection,
  TrialInvite,
} from "@/components/home/sections";
import { JsonLd, organizationJsonLd } from "@/components/site/json-ld";
import {
  getChampionships,
  getFeaturedAthletes,
  getGalleryPreview,
  getModalities,
  getSchedules,
  getSettings,
  getStats,
  getTestimonials,
  getTimeline,
  getUpcomingEvents,
} from "@/lib/data/public";
import { modalityAudiences, toAthleteCard, toChampionshipShowcase } from "@/lib/data/mappers";
import { SITE_MEDIA } from "@/lib/site-media";

export default async function HomePage() {
  const [settings, modalities, stats, timeline, championships, events, athletes, gallery, testimonials, schedules] = await Promise.all([
    getSettings(),
    getModalities(),
    getStats(),
    getTimeline(),
    getChampionships(),
    getUpcomingEvents(),
    getFeaturedAthletes(8),
    getGalleryPreview(9),
    getTestimonials(),
    getSchedules(),
  ]);
  // destaque primeiro, depois os mais recentes (até 8: 1 em destaque + 7 no mosaico)
  const showcase = [...championships].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, 8);
  const modalityNames = modalities.map((m) => m.name);
  // numeração só das seções que aparecem (as vazias somem da página)
  const numbered = [
    "historia",
    "campeonatos",
    events.length > 0 && "agenda",
    athletes.length > 0 && "atletas",
    "treinos",
    gallery.length >= GALLERY_PREVIEW_MIN && "galeria",
    testimonials.length > 0 && "depoimentos",
    "local",
  ].filter(Boolean);
  const n = (key: string) => String(numbered.indexOf(key) + 1).padStart(2, "0");

  return (
    <>
      <JsonLd data={organizationJsonLd(settings, modalities.map((m) => m.name))} />
      <HeroSection settings={settings} modalities={modalityNames} />
      <HistoryManifesto index={n("historia")} settings={settings} modalities={modalityNames} audiences={modalityAudiences(modalities)} timeline={timeline} />
      <BentoSection settings={settings} modalities={modalities} schedules={schedules} testimonial={testimonials[0] ?? null} stats={stats} />
      <PhotoBand src={SITE_MEDIA.band}>
        <p className="eyebrow flex items-center gap-3 text-gold">
          <span className="h-px w-10 bg-gold/50" aria-hidden />
          {settings.name}
        </p>
        <p className="display mt-5 max-w-4xl text-[clamp(3rem,8.5vw,7.5rem)] leading-[0.88] text-white">
          A pressão é o nosso <span className="text-blood">habitat.</span>
        </p>
      </PhotoBand>
      <ChampionshipsShowcase index={n("campeonatos")} items={showcase.map(toChampionshipShowcase)} stats={stats} />
      <EventsSection index={n("agenda")} events={events} />
      <AthletesSection index={n("atletas")} athletes={athletes.map(toAthleteCard)} />
      <TrainingSection index={n("treinos")} modalities={modalities} />
      <GalleryPreview index={n("galeria")} items={gallery} />
      <TestimonialsSection index={n("depoimentos")} items={testimonials} />
      <TrialInvite settings={settings} />
      <LocationSection index={n("local")} settings={settings} />
    </>
  );
}
