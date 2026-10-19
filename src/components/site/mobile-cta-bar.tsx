"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { TRIAL_PATH } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Barra fixa de conversão no celular — aparece depois que o visitante começa a rolar. */
export function MobileCtaBar({ whatsappHref }: { whatsappHref: string | null }) {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.55);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname.startsWith(TRIAL_PATH)) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-ink/90 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 backdrop-blur-xl transition-transform duration-500 ease-[var(--ease-cinematic)] md:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
      aria-hidden={!visible}
    >
      <div className="flex gap-3">
        <Link href={TRIAL_PATH} tabIndex={visible ? 0 : -1} className="btn-blood flex-1 py-3.5 text-[0.9rem]">
          Agendar aula experimental
        </Link>
        {whatsappHref && (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={visible ? 0 : -1}
           
            aria-label="Conversar no WhatsApp"
            className="grid w-14 place-items-center border border-white/20 text-white"
          >
            <MessageCircle className="size-5" />
          </a>
        )}
      </div>
    </div>
  );
}
