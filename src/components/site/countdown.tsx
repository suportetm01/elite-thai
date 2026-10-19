"use client";

import { useEffect, useState } from "react";

/** Contagem regressiva — usada somente para eventos com data confirmada. */
export function Countdown({ target }: { target: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const end = new Date(target).getTime();
  if (now === null) return <div className="h-[58px]" aria-hidden />;
  const diff = Math.max(0, end - now);
  if (diff === 0) return <p className="eyebrow text-gold">É hoje!</p>;
  const parts = [
    { label: "dias", value: Math.floor(diff / 86_400_000) },
    { label: "h", value: Math.floor((diff / 3_600_000) % 24) },
    { label: "min", value: Math.floor((diff / 60_000) % 60) },
    { label: "s", value: Math.floor((diff / 1000) % 60) },
  ];
  return (
    <div className="flex gap-2" role="timer" aria-label={`Faltam ${parts[0]!.value} dias e ${parts[1]!.value} horas`}>
      {parts.map((p) => (
        <div key={p.label} className="min-w-14 border border-white/10 bg-black/40 px-2 py-1.5 text-center">
          <p className="stat text-3xl text-white tabular-nums" aria-hidden>
            {String(p.value).padStart(2, "0")}
          </p>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500" aria-hidden>
            {p.label}
          </p>
        </div>
      ))}
    </div>
  );
}
