import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { InstagramIcon, WhatsappIcon } from "@/components/brand/social-icons";
import { BrandMark } from "@/components/brand/logo";
import { getSettings } from "@/lib/data/public";
import { formatPhone, instagramHandle, whatsappLink } from "@/lib/format";
import { NAV_ITEMS, TRIAL_PATH } from "@/lib/site";

export async function SiteFooter() {
  const s = await getSettings();
  const year = new Date().getFullYear();
  const wa = whatsappLink(s.whatsapp, "Olá! Vim pelo site da Elite Thai.");
  const location = [s.addressStreet, s.neighborhood, [s.city, s.state].filter(Boolean).join("/")].filter(Boolean).join(" • ");

  return (
    <footer className="relative border-t border-white/[0.06] bg-[#050505] pb-28 pt-20 md:pb-12">
      <div className="hairline-gold absolute inset-x-0 top-0 opacity-40" />
      <div className="container-site grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-4">
            <BrandMark logoUrl={s.logoUrl} className="size-16" />
            <div>
              <p className="display text-4xl text-white">
                {s.name.split(" ")[0]} <span className="text-blood">{s.name.split(" ").slice(1).join(" ")}</span>
              </p>
              <p className="eyebrow text-gold">{s.tagline}</p>
            </div>
          </div>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-zinc-400">{s.subheadline}</p>
          <Link href={TRIAL_PATH} className="btn-blood mt-8">
            Agendar aula experimental
          </Link>
        </div>

        <nav aria-label="Rodapé">
          <p className="eyebrow mb-5 text-zinc-500">Navegação</p>
          <ul className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm lg:grid-cols-1">
            {[{ href: "/", label: "Início" }, ...NAV_ITEMS, { href: TRIAL_PATH, label: "Aula experimental" }].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-zinc-300 transition-colors hover:text-gold">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <address className="not-italic">
          <p className="eyebrow mb-5 text-zinc-500">Contato</p>
          <ul className="space-y-4 text-sm text-zinc-300">
            {location && (
              <li className="flex gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-blood" aria-hidden />
                {s.mapsUrl ? (
                  <a href={s.mapsUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                    {location}
                  </a>
                ) : (
                  <span>{location}</span>
                )}
              </li>
            )}
            {wa && (
              <li className="flex gap-3">
                <WhatsappIcon className="mt-0.5 size-4 shrink-0 text-blood" />
                <a href={wa} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                  WhatsApp {formatPhone(s.whatsapp)}
                </a>
              </li>
            )}
            {s.phone && (
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-blood" aria-hidden />
                <a href={`tel:${s.phone.replace(/\D/g, "")}`} className="hover:text-gold">
                  {formatPhone(s.phone)}
                </a>
              </li>
            )}
            {s.email && (
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-blood" aria-hidden />
                <a href={`mailto:${s.email}`} className="hover:text-gold">
                  {s.email}
                </a>
              </li>
            )}
            {s.instagramUrl && (
              <li className="flex gap-3">
                <InstagramIcon className="mt-0.5 size-4 shrink-0 text-blood" />
                <a href={s.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-gold">
                  {instagramHandle(s.instagramUrl)}
                </a>
              </li>
            )}
          </ul>
          {s.openingHours && <p className="mt-6 whitespace-pre-line text-sm text-zinc-500">{s.openingHours}</p>}
        </address>
      </div>

      <div className="container-site mt-16 flex flex-col gap-4 border-t border-white/[0.06] pt-8 text-xs text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {s.name} — {s.tagline}. Todos os direitos reservados.
        </p>
        <Link href="/privacidade" className="hover:text-zinc-300">
          Privacidade e LGPD
        </Link>
      </div>
    </footer>
  );
}
