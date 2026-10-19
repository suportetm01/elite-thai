"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

/**
 * Mapa carregado somente após o clique: o Google Maps define cookies de terceiros,
 * então o visitante decide (boa prática de LGPD) e a página não paga esse custo à toa.
 */
export function MapEmbed({ query, latitude, longitude }: { query: string; latitude: number | null; longitude: number | null }) {
  const [load, setLoad] = useState(false);
  const q = latitude != null && longitude != null ? `${latitude},${longitude}` : query;
  const src = `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=16&output=embed`;
  return (
    <div className="relative min-h-[360px] overflow-hidden border border-white/[0.07] bg-coal">
      {load ? (
        <iframe title="Mapa de localização da academia" src={src} className="absolute inset-0 size-full grayscale-[60%] invert-[92%] hue-rotate-180" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
      ) : (
        <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_45%,#1d0a0c,#0b0b0b_65%)] p-6 text-center">
          <div>
            <span className="relative mx-auto mb-5 grid size-16 place-items-center">
              <span className="absolute inset-0 animate-[pulse-ring_2.4s_ease-out_infinite] rounded-full border border-blood/60" />
              <MapPin className="size-7 text-blood" aria-hidden />
            </span>
            <p className="text-sm text-zinc-400">O mapa é fornecido pelo Google e só é carregado com sua permissão.</p>
            <button type="button" onClick={() => setLoad(true)} className="btn-ghost-line mt-5">
              Carregar mapa
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
