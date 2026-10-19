import type { Metadata } from "next";
import Link from "next/link";
import { Emblem } from "@/components/brand/emblem";

export const metadata: Metadata = { title: "Página não encontrada" };

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-ink px-6 text-center">
      <div>
        <Emblem className="mx-auto size-28 opacity-80" />
        <p className="stat mt-8 text-[9rem] leading-none text-blood">404</p>
        <h1 className="display mt-2 text-5xl text-white">Golpe fora do alvo</h1>
        <p className="mx-auto mt-4 max-w-md text-zinc-400">A página que você procura não existe ou foi movida.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-blood">Voltar ao início</Link>
          <Link href="/aula-experimental" className="btn-ghost-line">Aula experimental</Link>
        </div>
      </div>
    </main>
  );
}
