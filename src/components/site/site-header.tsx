"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Volume2, VolumeX, X } from "lucide-react";
import { motion } from "motion/react";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { BrandMark } from "@/components/brand/logo";
import { Wordmark } from "@/components/brand/emblem";
import { useSound } from "@/components/site/sound-provider";
import { NAV_ITEMS, TRIAL_PATH } from "@/lib/site";
import { cn } from "@/lib/utils";

type Props = { logoUrl: string | null; instagramUrl: string | null; whatsappHref: string | null };

/** Lê a rota atual (dado de URL) — fica dentro de <Suspense> no layout. */
export function SiteHeader(props: Props) {
  const pathname = usePathname();
  return <SiteHeaderShell {...props} pathname={pathname} />;
}

/** Cabeçalho em si; a página atual chega por `pathname` (destaque do menu). */
function SiteHeaderShell({ logoUrl, instagramUrl, whatsappHref, pathname }: Props & { pathname: string }) {
  const [scrolled, setScrolled] = useState(false);
  const { enabled, toggle } = useSound();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500",
        scrolled ? "border-b border-white/[0.06] bg-ink/80 backdrop-blur-xl" : "border-b border-transparent bg-gradient-to-b from-black/70 to-transparent",
      )}
    >
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[70] focus:bg-blood focus:px-4 focus:py-2 focus:text-white"
      >
        Pular para o conteúdo
      </a>
      <div className="container-site flex h-[72px] items-center justify-between gap-6">
        <Link href="/" className="group flex items-center gap-3" aria-label="Elite Thai — página inicial">
          <BrandMark logoUrl={logoUrl} className="size-11 transition-transform duration-500 group-hover:rotate-[-8deg]" priority />
          <Wordmark className="hidden sm:flex" />
        </Link>

        <nav aria-label="Principal" className="hidden xl:block">
          <ul className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "group relative px-3 py-2 font-[family-name:var(--font-barlow)] text-[0.95rem] font-semibold uppercase tracking-[0.14em] transition-colors",
                    isActive(item.href) ? "text-white" : "text-zinc-400 hover:text-white",
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      "absolute inset-x-3 -bottom-0.5 h-[2px] origin-left bg-blood transition-transform duration-500 ease-[var(--ease-cinematic)]",
                      isActive(item.href) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                    )}
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-pressed={enabled}
            aria-label={enabled ? "Desativar som" : "Ativar som"}
            title={enabled ? "Desativar som" : "Ativar som"}
            className="grid size-10 place-items-center rounded-full border border-white/10 text-zinc-300 transition-colors hover:border-gold/60 hover:text-gold"
          >
            {enabled ? <Volume2 className="size-[18px]" /> : <VolumeX className="size-[18px]" />}
          </button>
          <Link href={TRIAL_PATH} className="btn-blood hidden px-5 py-2.5 text-[0.85rem] md:inline-flex">
            Aula experimental
          </Link>
          <MobileMenu pathname={pathname} instagramUrl={instagramUrl} whatsappHref={whatsappHref} />
        </div>
      </div>
    </header>
  );
}

function MobileMenu({ pathname, instagramUrl, whatsappHref }: { pathname: string; instagramUrl: string | null; whatsappHref: string | null }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="grid size-10 place-items-center rounded-full border border-white/10 text-white xl:hidden"
          aria-label="Abrir menu"
        >
          <Menu className="size-5" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" showCloseButton={false} className="w-full max-w-none border-l-0 bg-ink p-0 data-[side=right]:w-full sm:data-[side=right]:max-w-md">
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <SheetDescription className="sr-only">Navegação principal do site Elite Thai</SheetDescription>
        <div className="flex h-[72px] items-center justify-between px-5">
          <Wordmark />
          <SheetClose asChild>
            <button type="button" aria-label="Fechar menu" className="grid size-10 place-items-center rounded-full border border-white/10">
              <X className="size-5" />
            </button>
          </SheetClose>
        </div>
        <nav aria-label="Menu móvel" className="flex-1 overflow-y-auto px-5 pb-6">
          <ul className="divide-y divide-white/[0.06] border-y border-white/[0.06]">
            {[{ href: "/", label: "Início" }, ...NAV_ITEMS].map((item, i) => (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, x: 24 }}
                animate={open ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.04 * i, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className="flex items-center justify-between py-4"
                >
                  <span className={cn("display text-[2.6rem]", pathname === item.href ? "text-blood" : "text-white")}>{item.label}</span>
                  <span className="eyebrow text-zinc-600">{String(i + 1).padStart(2, "0")}</span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </nav>
        <div className="grid gap-3 border-t border-white/[0.06] p-5">
          <Link href={TRIAL_PATH} onClick={() => setOpen(false)} className="btn-blood w-full py-4">
            Agendar aula experimental
          </Link>
          <div className="grid grid-cols-2 gap-3">
            {whatsappHref && (
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn-ghost-line py-3 text-sm">
                WhatsApp
              </a>
            )}
            {instagramUrl && (
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className={cn("btn-ghost-line py-3 text-sm", !whatsappHref && "col-span-2")}>
                Instagram
              </a>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
