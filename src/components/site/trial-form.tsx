"use client";

import { useEffect, useRef, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { WhatsappIcon } from "@/components/brand/social-icons";
import { whatsappLink } from "@/lib/format";
import { AGE_RANGES, EXPERIENCE, MINOR_RANGES, PREFERRED_TIMES, trialMessage, validateTrial, type TrialErrors } from "@/lib/trial";
import { cn } from "@/lib/utils";

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-sm text-[#ff6b77]" role="alert">
      {message}
    </p>
  );
}

function ChoiceGroup({ name, legend, options, error, onChange }: { name: string; legend: string; options: readonly string[]; error?: string; onChange?: (v: string) => void }) {
  return (
    <fieldset aria-invalid={Boolean(error)} aria-describedby={error ? `${name}-error` : undefined}>
      <legend className="eyebrow mb-3 text-[0.72rem] text-zinc-400">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option} className="relative cursor-pointer">
            <input type="radio" name={name} value={option} className="peer sr-only" onChange={() => onChange?.(option)} />
            <span className="flex min-h-11 items-center border border-white/12 bg-black/30 px-4 text-sm text-zinc-300 transition-colors peer-checked:border-blood peer-checked:bg-blood/15 peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-gold hover:border-white/30">
              {option}
            </span>
          </label>
        ))}
      </div>
      <FieldError id={`${name}-error`} message={error} />
    </fieldset>
  );
}

const inputClass =
  "w-full border border-white/12 bg-black/30 px-4 py-3.5 text-base text-white placeholder:text-zinc-600 transition-colors focus:border-gold focus:outline-none aria-[invalid=true]:border-[#ff6b77]";

/**
 * Pedido de aula experimental pelo WhatsApp: o visitante preenche os dados e, ao enviar,
 * abre a conversa com a academia com a mensagem já escrita. Nada é guardado no site.
 */
export function TrialForm({ modalities, whatsapp, academy }: { modalities: string[]; whatsapp: string | null; academy: string }) {
  const [errors, setErrors] = useState<TrialErrors>({});
  const [ageRange, setAgeRange] = useState("");
  const [sent, setSent] = useState<{ href: string; firstName: string } | null>(null);
  const minor = MINOR_RANGES.includes(ageRange);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sent || !successRef.current) return;
    successRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    successRef.current.focus({ preventScroll: true });
  }, [sent]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const data = {
      name: String(form.get("name") ?? ""),
      ageRange: String(form.get("ageRange") ?? ""),
      experience: String(form.get("experience") ?? ""),
      preferredTime: String(form.get("preferredTime") ?? ""),
      modalityInterest: String(form.get("modalityInterest") ?? ""),
      message: String(form.get("message") ?? ""),
      guardian: form.get("guardian") === "on",
    };
    const found = validateTrial(data);
    setErrors(found);
    if (Object.keys(found).length) return;
    const href = whatsappLink(whatsapp, trialMessage(data, academy));
    if (!href) return;
    window.open(href, "_blank", "noopener,noreferrer");
    setSent({ href, firstName: data.name.trim().split(" ")[0] });
  };

  if (sent) {
    return (
      <div ref={successRef} tabIndex={-1} className="panel cut-corner-br p-8 outline-none md:p-10" role="status" aria-live="polite">
        <CheckCircle2 className="size-10 text-gold" aria-hidden />
        <h2 className="display mt-5 text-5xl text-white">Quase lá, {sent.firstName}!</h2>
        <p className="mt-4 max-w-xl leading-relaxed text-zinc-300">
          Abrimos o WhatsApp da {academy} com o seu pedido já escrito. É só <strong className="text-white">enviar a mensagem</strong> — a equipe
          confirma com você a turma e o horário. A aula fica garantida após essa confirmação.
        </p>
        <a href={sent.href} target="_blank" rel="noopener noreferrer" className="btn-blood mt-8">
          <WhatsappIcon className="size-5" />
          Abrir o WhatsApp de novo
        </a>
        <button type="button" onClick={() => setSent(null)} className="mt-4 block text-sm text-zinc-400 underline underline-offset-4 hover:text-white">
          Corrigir os dados
        </button>
      </div>
    );
  }

  const hasErrors = Object.keys(errors).length > 0;
  return (
    <form onSubmit={onSubmit} className="panel cut-corner-br grid gap-8 p-6 md:p-10" noValidate>
      {hasErrors && (
        <p className="border-l-2 border-[#ff6b77] bg-[#ff6b77]/10 px-4 py-3 text-sm text-[#ffb3ba]" role="alert">
          Revise os campos destacados.
        </p>
      )}

      <div>
        <label htmlFor="name" className="eyebrow mb-3 block text-[0.72rem] text-zinc-400">
          Nome completo
        </label>
        <input id="name" name="name" autoComplete="name" required className={inputClass} aria-invalid={Boolean(errors.name)} aria-describedby={errors.name ? "name-error" : undefined} />
        <FieldError id="name-error" message={errors.name} />
      </div>

      <ChoiceGroup name="ageRange" legend="Idade ou faixa etária" options={AGE_RANGES} error={errors.ageRange} onChange={setAgeRange} />
      <ChoiceGroup name="experience" legend="Experiência anterior" options={EXPERIENCE} error={errors.experience} />
      <ChoiceGroup name="preferredTime" legend="Horário preferido" options={PREFERRED_TIMES} error={errors.preferredTime} />

      <div className="grid gap-6 md:grid-cols-2">
        {modalities.length > 0 && (
          <div>
            <label htmlFor="modalityInterest" className="eyebrow mb-3 block text-[0.72rem] text-zinc-400">
              Modalidade de interesse (opcional)
            </label>
            <select id="modalityInterest" name="modalityInterest" className={cn(inputClass, "appearance-none")} defaultValue="">
              <option value="">Ainda não sei</option>
              {modalities.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className={cn(modalities.length === 0 && "md:col-span-2")}>
          <label htmlFor="message" className="eyebrow mb-3 block text-[0.72rem] text-zinc-400">
            Observações (opcional)
          </label>
          <textarea id="message" name="message" rows={3} maxLength={600} className={inputClass} placeholder="Objetivos, restrições, dúvidas…" aria-invalid={Boolean(errors.message)} />
          <FieldError id="message-error" message={errors.message} />
        </div>
      </div>

      {minor && (
        <div>
          <label className="flex cursor-pointer gap-3 text-sm text-zinc-300">
            <input type="checkbox" name="guardian" className="mt-0.5 size-5 shrink-0 accent-[#e32636]" aria-labelledby="guardian-label" aria-describedby={errors.guardian ? "guardian-error" : undefined} />
            <span id="guardian-label">Sou o pai, mãe ou responsável legal e estou fazendo esta solicitação pelo(a) menor.</span>
          </label>
          <FieldError id="guardian-error" message={errors.guardian} />
        </div>
      )}

      <div className="grid gap-3">
        <button type="submit" disabled={!whatsapp} className="btn-blood w-full py-4 text-base disabled:opacity-60 md:w-auto md:justify-self-start">
          <WhatsappIcon className="size-5" />
          Enviar pelo WhatsApp
        </button>
        <p className="text-xs leading-relaxed text-zinc-500">O WhatsApp abre com a mensagem pronta para você enviar. Nenhum dado fica guardado neste site.</p>
      </div>
    </form>
  );
}
