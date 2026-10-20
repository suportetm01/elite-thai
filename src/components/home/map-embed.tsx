import { MapPin } from "lucide-react";

/**
 * Mapa do Google que abre sozinho: o iframe usa carregamento preguiçoso do navegador, então
 * só baixa quando o visitante se aproxima da seção (a abertura da página não fica mais lenta).
 * Enquanto carrega, aparece o marcador por baixo.
 */
export function MapEmbed({ query, latitude, longitude }: { query: string; latitude: number | null; longitude: number | null }) {
  const q = latitude != null && longitude != null ? `${latitude},${longitude}` : query;
  const src = `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=16&output=embed`;
  return (
    <div className="relative min-h-[360px] overflow-hidden border border-white/[0.07] bg-coal">
      <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_45%,#1d0a0c,#0b0b0b_65%)]" aria-hidden>
        <span className="relative grid size-16 place-items-center">
          <span className="absolute inset-0 animate-[pulse-ring_2.4s_ease-out_infinite] rounded-full border border-blood/60" />
          <MapPin className="size-7 text-blood" />
        </span>
      </div>
      <iframe
        title="Mapa de localização da academia"
        src={src}
        className="absolute inset-0 size-full grayscale-[60%] invert-[92%] hue-rotate-180"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
