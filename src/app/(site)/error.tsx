"use client";

import { useEffect } from "react";

export default function SiteError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);
  return (
    <div className="container-site grid min-h-[70vh] place-items-center py-40 text-center">
      <div>
        <p className="eyebrow text-gold">Algo saiu do lugar</p>
        <h1 className="display mt-3 text-6xl text-white">Não foi possível carregar</h1>
        <p className="mx-auto mt-4 max-w-md text-zinc-400">Tente novamente em instantes. Se o problema continuar, fale com a equipe pelos canais oficiais.</p>
        <button type="button" onClick={() => retry()} className="btn-blood mt-8">
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
