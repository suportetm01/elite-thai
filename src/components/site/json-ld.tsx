import { LOGO_PNG } from "@/components/brand/emblem";
import type { Settings } from "@/lib/data/public";
import { absoluteUrl, SITE_URL } from "@/lib/site";

/** Dados estruturados (schema.org) — ajudam o SEO local e a exibição nos buscadores. */
export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      // JSON serializado com escape de "<" para não permitir fechamento da tag
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function organizationJsonLd(settings: Settings, modalities: string[]) {
  const sameAs = [settings.instagramUrl, settings.facebookUrl, settings.youtubeUrl, settings.tiktokUrl].filter(Boolean);
  const address =
    settings.city || settings.addressStreet
      ? {
          "@type": "PostalAddress",
          streetAddress: settings.addressStreet ?? undefined,
          addressLocality: settings.city ?? undefined,
          addressRegion: settings.state ?? undefined,
          postalCode: settings.postalCode ?? undefined,
          addressCountry: "BR",
        }
      : undefined;
  return {
    "@context": "https://schema.org",
    "@type": ["SportsActivityLocation", "ExerciseGym"],
    "@id": `${SITE_URL}/#organizacao`,
    name: settings.name,
    description: `${settings.tagline}${modalities.length ? ` — ${modalities.join(", ")}` : ""}`,
    url: SITE_URL,
    logo: absoluteUrl(settings.logoUrl ?? LOGO_PNG),
    image: settings.ogImageUrl ? absoluteUrl(settings.ogImageUrl) : absoluteUrl("/opengraph-image"),
    telephone: settings.phone ?? settings.whatsapp ?? undefined,
    email: settings.email ?? undefined,
    address,
    geo: settings.latitude != null && settings.longitude != null ? { "@type": "GeoCoordinates", latitude: settings.latitude, longitude: settings.longitude } : undefined,
    areaServed: settings.city ? { "@type": "City", name: settings.city } : undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    sport: modalities,
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({ "@type": "ListItem", position: index + 1, name: item.name, item: absoluteUrl(item.path) })),
  };
}
