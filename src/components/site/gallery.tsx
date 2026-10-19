"use client";

import Image from "@/components/site/smart-image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { MEDIA_CATEGORY_LABEL, youtubeEmbedUrl } from "@/lib/format";
import { cn } from "@/lib/utils";

export type GalleryMedia = {
  id: string;
  type: "IMAGE" | "VIDEO" | "EMBED";
  url: string;
  thumbUrl: string | null;
  posterUrl: string | null;
  width: number | null;
  height: number | null;
  blurDataUrl: string | null;
  alt: string;
  caption: string | null;
  category: keyof typeof MEDIA_CATEGORY_LABEL;
  album?: { name: string; key: string } | null;
};

/** Galeria em alvenaria (masonry) com filtros, lightbox, teclado e gestos de deslizar. */
export function Gallery({ items, filters = true }: { items: GalleryMedia[]; filters?: boolean }) {
  const [category, setCategory] = useState<string>("all");
  const [album, setAlbum] = useState<string>("all");
  const [open, setOpen] = useState<number | null>(null);

  const categories = useMemo(() => [...new Set(items.map((i) => i.category))], [items]);
  const albums = useMemo(() => {
    const map = new Map<string, string>();
    items.forEach((i) => i.album && map.set(i.album.key, i.album.name));
    return [...map.entries()];
  }, [items]);
  const visible = useMemo(
    () => items.filter((i) => (category === "all" || i.category === category) && (album === "all" || i.album?.key === album)),
    [items, category, album],
  );

  return (
    <div>
      {filters && (categories.length > 1 || albums.length > 0) && (
        <div className="mb-8 space-y-4">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoria">
            {[["all", "Tudo"] as const, ...categories.map((c) => [c, MEDIA_CATEGORY_LABEL[c]] as const)].map(([value, label]) => (
              <button
                key={value}
                type="button"
                aria-pressed={category === value}
                onClick={() => setCategory(value)}
                className={cn(
                  "min-h-10 border px-4 font-[family-name:var(--font-barlow)] text-sm font-semibold uppercase tracking-wider transition-colors",
                  category === value ? "border-blood bg-blood text-white" : "border-white/12 text-zinc-400 hover:text-white",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          {albums.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <label htmlFor="album" className="eyebrow text-[0.7rem] text-zinc-500">
                Galeria do evento
              </label>
              <select id="album" value={album} onChange={(e) => setAlbum(e.target.value)} className="min-h-10 border border-white/12 bg-coal px-3 text-sm text-white">
                <option value="all">Todos os eventos</option>
                {albums.map(([key, name]) => (
                  <option key={key} value={key}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}

      <ul className="columns-2 gap-3 md:columns-3 xl:columns-4">
        {visible.map((item, index) => (
          <li key={item.id} className="mb-3 break-inside-avoid">
            <button type="button" onClick={() => setOpen(index)} className="group relative block w-full overflow-hidden bg-coal text-left" aria-label={`Abrir: ${item.alt}`}>
              {item.type === "IMAGE" || item.thumbUrl || item.posterUrl ? (
                <Image
                  src={item.thumbUrl ?? item.posterUrl ?? item.url}
                  alt={item.alt}
                  width={item.width ?? 800}
                  height={item.height ?? (item.type === "IMAGE" ? 1000 : 450)}
                  sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
                  placeholder={item.blurDataUrl ? "blur" : "empty"}
                  blurDataURL={item.blurDataUrl ?? undefined}
                  className="h-auto w-full transition-[transform,filter] duration-700 ease-[var(--ease-cinematic)] group-hover:scale-105 group-hover:brightness-110"
                />
              ) : (
                <div className="grid aspect-video place-items-center bg-[radial-gradient(circle,#2a0d10,#0b0b0b)]">
                  <Play className="size-10 text-white/70" />
                </div>
              )}
              {item.type !== "IMAGE" && (
                <span className="absolute left-3 top-3 grid size-9 place-items-center rounded-full bg-black/60 backdrop-blur">
                  <Play className="size-4 fill-white text-white" aria-hidden />
                </span>
              )}
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              {item.caption && (
                <span className="pointer-events-none absolute inset-x-3 bottom-3 translate-y-2 text-sm text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  {item.caption}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
      {visible.length === 0 && <p className="text-zinc-500">Nenhum item nesta categoria.</p>}

      <Lightbox items={visible} index={open} onClose={() => setOpen(null)} onIndex={setOpen} />
    </div>
  );
}

function Lightbox({ items, index, onClose, onIndex }: { items: GalleryMedia[]; index: number | null; onClose: () => void; onIndex: (i: number) => void }) {
  const item = index !== null ? items[index] : null;
  const touch = useRef<{ x: number; y: number } | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restore = useRef<HTMLElement | null>(null);

  const go = useCallback((dir: 1 | -1) => index !== null && onIndex((index + dir + items.length) % items.length), [index, items.length, onIndex]);

  useEffect(() => {
    if (index === null) return;
    restore.current = document.activeElement as HTMLElement;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      restore.current?.focus();
    };
  }, [index, go, onClose]);

  const embed = item?.type === "EMBED" ? youtubeEmbedUrl(item.url) : null;

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={item.alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex flex-col bg-black/95 backdrop-blur"
          onTouchStart={(e) => (touch.current = { x: e.touches[0]!.clientX, y: e.touches[0]!.clientY })}
          onTouchEnd={(e) => {
            if (!touch.current) return;
            const dx = e.changedTouches[0]!.clientX - touch.current.x;
            const dy = e.changedTouches[0]!.clientY - touch.current.y;
            if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
            else if (dy > 90) onClose();
            touch.current = null;
          }}
        >
          <div className="flex items-center justify-between p-4">
            <span className="stat text-xl text-zinc-500">
              {index! + 1} / {items.length}
            </span>
            <button ref={closeRef} type="button" onClick={onClose} className="grid size-11 place-items-center rounded-full border border-white/15 text-white" aria-label="Fechar">
              <X className="size-5" />
            </button>
          </div>
          <div className="relative flex flex-1 items-center justify-center px-4 pb-4 md:px-20">
            <motion.div key={item.id} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.35 }} className="relative flex h-full w-full items-center justify-center">
              {item.type === "IMAGE" && (
                <Image src={item.url} alt={item.alt} fill sizes="100vw" className="object-contain" priority />
              )}
              {item.type === "VIDEO" && (
                <video src={item.url} poster={item.posterUrl ?? undefined} controls playsInline preload="metadata" className="max-h-full max-w-full" />
              )}
              {item.type === "EMBED" &&
                (embed ? (
                  <iframe src={embed} title={item.alt} allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen className="aspect-video w-full max-w-5xl" />
                ) : (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="btn-blood">
                    Assistir na plataforma original
                  </a>
                ))}
            </motion.div>
            {items.length > 1 && (
              <>
                <button type="button" onClick={() => go(-1)} className="absolute left-2 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/50 text-white md:grid" aria-label="Anterior">
                  <ChevronLeft className="size-6" />
                </button>
                <button type="button" onClick={() => go(1)} className="absolute right-2 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-black/50 text-white md:grid" aria-label="Próxima">
                  <ChevronRight className="size-6" />
                </button>
              </>
            )}
          </div>
          {item.caption && <p className="px-6 pb-6 text-center text-sm text-zinc-300">{item.caption}</p>}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
