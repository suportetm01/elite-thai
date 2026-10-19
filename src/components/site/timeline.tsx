"use client";

import Image from "@/components/site/smart-image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { Trophy } from "lucide-react";
import { youtubeEmbedUrl } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useReducedMotionSafe } from "@/lib/use-reduced-motion-safe";

export type TimelineItem = {
  id: string;
  year: number;
  month: number | null;
  title: string;
  description: string | null;
  coverUrl: string | null;
  videoUrl: string | null;
  championship: { name: string; slug: string } | null;
  media: { id: string; url: string; thumbUrl: string | null; alt: string }[];
};

const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/** Linha do tempo com revelação progressiva e navegação por ano. */
export function Timeline({ items }: { items: TimelineItem[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionSafe();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 70%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [active, setActive] = useState(items[0]?.id);
  const years = [...new Set(items.map((i) => i.year))];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id.replace("marco-", ""));
      },
      { rootMargin: "-40% 0px -50% 0px" },
    );
    document.querySelectorAll("[data-timeline-entry]").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const activeYear = items.find((i) => i.id === active)?.year;

  return (
    <div className="grid gap-12 lg:grid-cols-[180px_1fr]">
      <nav aria-label="Anos" className="hidden lg:block">
        <ol className="sticky top-32 space-y-1">
          {years.map((year) => (
            <li key={year}>
              <a
                href={`#marco-${items.find((i) => i.year === year)!.id}`}
                className={cn("stat block py-1 text-4xl transition-colors", year === activeYear ? "text-blood" : "text-zinc-700 hover:text-zinc-400")}
              >
                {year}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div ref={ref} className="relative">
        <div className="absolute bottom-0 left-[7px] top-0 w-px bg-white/10 md:left-[11px]" aria-hidden />
        <motion.div
          className="absolute left-[7px] top-0 w-px origin-top bg-gradient-to-b from-blood to-gold md:left-[11px]"
          style={reduce ? { height: "100%" } : { height: "100%", scaleY: progress }}
          aria-hidden
        />
        <ol className="space-y-20">
          {items.map((item) => {
            const video = youtubeEmbedUrl(item.videoUrl);
            return (
              <motion.li
                key={item.id}
                id={`marco-${item.id}`}
                data-timeline-entry
                initial={reduce ? { opacity: 0 } : { opacity: 0, x: 40 }}
                whileInView={reduce ? { opacity: 1 } : { opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "0px 0px -15% 0px" }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="relative scroll-mt-32 pl-10 md:pl-14"
              >
                <span className="absolute left-0 top-3 size-[15px] rotate-45 border-2 border-blood bg-ink md:size-[23px]" aria-hidden />
                <p className="stat text-6xl text-gold md:text-7xl">
                  {item.year}
                  {item.month ? <span className="ml-3 text-2xl text-zinc-500">{MONTHS[item.month - 1]}</span> : null}
                </p>
                <h3 className="display mt-2 text-4xl text-white md:text-5xl">{item.title}</h3>
                {item.description && <p className="mt-4 max-w-2xl whitespace-pre-line leading-relaxed text-zinc-400">{item.description}</p>}
                {item.championship && (
                  <Link href={`/campeonatos/${item.championship.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm text-gold hover:underline">
                    <Trophy className="size-4" aria-hidden /> {item.championship.name}
                  </Link>
                )}
                {item.coverUrl && (
                  <div className="relative mt-6 aspect-[16/9] max-w-3xl overflow-hidden border border-white/[0.07]">
                    <Image src={item.coverUrl} alt={item.title} fill sizes="(min-width: 1024px) 60vw, 100vw" className="object-cover" />
                  </div>
                )}
                {item.media.length > 0 && (
                  <ul className="mt-4 grid max-w-3xl grid-cols-3 gap-2 md:grid-cols-6">
                    {item.media.map((m) => (
                      <li key={m.id} className="relative aspect-square overflow-hidden">
                        <Image src={m.thumbUrl ?? m.url} alt={m.alt} fill sizes="120px" className="object-cover" />
                      </li>
                    ))}
                  </ul>
                )}
                {video && (
                  <div className="relative mt-6 aspect-video max-w-3xl overflow-hidden border border-white/[0.07]">
                    <iframe src={video} title={item.title} loading="lazy" allow="encrypted-media; picture-in-picture" allowFullScreen className="absolute inset-0 size-full" />
                  </div>
                )}
              </motion.li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
