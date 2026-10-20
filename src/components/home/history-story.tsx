import { Emblem } from "@/components/brand/emblem";
import { Reveal } from "@/components/site/reveal";
import type { HistoryStory as Story } from "@/content/types";

/** Depois de qual parágrafo entra a frase em destaque (no meio do texto, longe de onde ela aparece). */
const QUOTE_AFTER = 3;

/**
 * História completa (página Nossa história): à esquerda o título e os marcos citados no
 * texto, fixos ao rolar no computador; à direita o texto corrido, com letra capitular, uma
 * frase em destaque e a assinatura da academia.
 */
export function HistoryStory({ story }: { story: Story }) {
  const [lead, ...rest] = story.title.split(". ").map((part, i, all) => (i < all.length - 1 ? `${part}.` : part));
  return (
    <section aria-labelledby="historia-completa" className="relative border-t border-white/[0.06] py-24 md:py-32">
      <div className="container-site grid gap-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <p className="eyebrow flex items-center gap-3 text-gold">
              <span className="h-px w-12 bg-gold/50" aria-hidden />A trajetória
            </p>
            <h2 id="historia-completa" className="display mt-6 text-[clamp(2.8rem,6vw,5.2rem)] leading-[0.92] text-white">
              {lead}
              {rest.length > 0 && <span className="block text-blood">{rest.join(" ")}</span>}
            </h2>
          </Reveal>
          {story.highlights.length > 0 && (
            <Reveal delay={0.1}>
              <dl className="mt-10 grid grid-cols-2 gap-px border border-white/[0.07] bg-white/[0.07]">
                {story.highlights.map((h) => (
                  <div key={h.label} className="flex flex-col-reverse bg-ink p-5 md:p-6">
                    <dt className="mt-2 font-mono text-[10px] uppercase leading-relaxed tracking-[0.24em] text-zinc-500">{h.label}</dt>
                    <dd className="stat text-[clamp(2rem,3.4vw,2.8rem)] leading-none text-gold">{h.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}
        </div>

        <article className="max-w-2xl">
          {story.paragraphs.map((text, i) => (
            <Reveal key={i} y={18}>
              <p
                className={
                  i === 0
                    ? "text-xl leading-relaxed text-zinc-100 first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-[family-name:var(--font-bebas)] first-letter:text-[4.8rem] first-letter:leading-[0.78] first-letter:text-blood"
                    : i === story.paragraphs.length - 1
                      ? "mt-6 text-lg leading-relaxed text-white"
                      : "mt-6 text-lg leading-relaxed text-zinc-400"
                }
              >
                {text}
              </p>
              {story.quote && i === QUOTE_AFTER && (
                <blockquote className="my-12 border-l-2 border-blood pl-6 md:pl-8">
                  <p className="display text-[clamp(2.2rem,4.4vw,3.6rem)] leading-[0.95] text-white">“{story.quote}”</p>
                </blockquote>
              )}
            </Reveal>
          ))}

          <Reveal y={18}>
            <footer className="mt-14 flex items-center gap-5 border-t border-white/10 pt-8">
              <Emblem className="size-16" />
              <div>
                <p className="font-[family-name:var(--font-barlow)] text-lg font-bold uppercase tracking-wide text-white">{story.signature}</p>
                {story.motto && <p className="eyebrow mt-1 text-[0.72rem] text-gold">{story.motto}</p>}
              </div>
            </footer>
          </Reveal>
        </article>
      </div>
    </section>
  );
}
