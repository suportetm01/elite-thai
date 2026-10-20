import { WEEKDAYS } from "@/lib/format";
import type { getSchedules } from "@/lib/data/public";

type Schedules = Awaited<ReturnType<typeof getSchedules>>;

/** Grade semanal de horários (somente o que estiver em src/content/team.ts). */
export function ScheduleTable({ schedules }: { schedules: Schedules }) {
  const days = [1, 2, 3, 4, 5, 6, 0].filter((d) => schedules.some((s) => s.weekday === d));
  return (
    <div className="grid gap-px overflow-hidden border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {days.map((day) => (
        <div key={day} className="bg-coal p-5">
          <p className="eyebrow text-gold">{WEEKDAYS[day]}</p>
          <ul className="mt-4 space-y-4">
            {schedules
              .filter((s) => s.weekday === day)
              .map((s) => (
                <li key={s.id}>
                  <p className="stat text-2xl text-white">
                    {s.startTime}
                    {s.endTime && <span className="text-zinc-600"> – {s.endTime}</span>}
                  </p>
                  <p className="font-[family-name:var(--font-barlow)] text-sm font-semibold uppercase tracking-wide text-zinc-300">{s.modality.name}</p>
                  {(s.audience || s.level) && <p className="text-xs text-zinc-500">{[s.audience, s.level].filter(Boolean).join(" · ")}</p>}
                  {s.instructor && <p className="text-xs text-zinc-500">Prof. {s.instructor.name}</p>}
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
