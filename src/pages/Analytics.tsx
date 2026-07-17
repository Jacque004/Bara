import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useAuth } from "@/hooks/useAuth";
import { fetchStudySessions, fetchSubjects } from "@/lib/api";

type SessionRow = {
  duration_minutes: number;
  task_id: string;
  tasks: { title: string; subject_id: string } | { title: string; subject_id: string }[] | null;
};

function taskOf(
  t: SessionRow["tasks"]
): { title: string; subject_id: string } | null {
  if (!t) return null;
  return Array.isArray(t) ? t[0] ?? null : t;
}

export function Analytics() {
  const { user } = useAuth();
  const uid = user?.id;

  const { data: sessions = [] } = useQuery({
    queryKey: ["sessions", uid],
    queryFn: () => fetchStudySessions(uid!),
    enabled: !!uid,
  });

  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects", uid],
    queryFn: () => fetchSubjects(uid!),
    enabled: !!uid,
  });

  const bySubject = useMemo(() => {
    const map = new Map<string, number>();
    const subName = new Map(subjects.map((s) => [s.id, s.name]));
    for (const row of sessions as unknown as SessionRow[]) {
      const sid = taskOf(row.tasks)?.subject_id;
      if (!sid) continue;
      map.set(sid, (map.get(sid) ?? 0) + row.duration_minutes);
    }
    return [...map.entries()]
      .map(([id, min]) => ({
        id,
        name: subName.get(id) ?? "—",
        min,
      }))
      .sort((a, b) => b.min - a.min);
  }, [sessions, subjects]);

  const totalMin = bySubject.reduce((a, b) => a + b.min, 0);
  const sessionsCount = sessions.length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="mt-1 text-[var(--color-bara-muted)]">
          Temps par matière et vue d’ensemble de l’activité.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-4">
          <p className="text-xs font-medium uppercase text-[var(--color-bara-muted)]">
            Sessions
          </p>
          <p className="mt-1 text-2xl font-bold">{sessionsCount}</p>
        </div>
        <div className="rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-4">
          <p className="text-xs font-medium uppercase text-[var(--color-bara-muted)]">
            Temps total enregistré
          </p>
          <p className="mt-1 text-2xl font-bold">
            {Math.floor(totalMin / 60)}h {totalMin % 60}min
          </p>
        </div>
      </div>

      <section className="rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-6">
        <h2 className="font-semibold">Temps par matière</h2>
        {bySubject.length === 0 ? (
          <p className="mt-4 text-sm text-[var(--color-bara-muted)]">
            Aucune session avec tâche liée pour l’instant.
          </p>
        ) : (
          <ul className="mt-4 space-y-4">
            {bySubject.map((s) => {
              const pct = totalMin ? Math.round((s.min / totalMin) * 100) : 0;
              return (
                <li key={s.id}>
                  <div className="flex justify-between text-sm">
                    <span>{s.name}</span>
                    <span className="text-[var(--color-bara-muted)]">
                      {s.min} min ({pct}%)
                    </span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                    <div
                      className="h-full rounded-full bg-orange-600"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-6">
        <h2 className="font-semibold">Efficacité (indicateur simple)</h2>
        <p className="mt-2 text-sm text-[var(--color-bara-muted)]">
          Moyenne :{" "}
          {sessionsCount > 0 && totalMin > 0
            ? `${Math.round(totalMin / sessionsCount)} min par session`
            : "—"}
        </p>
      </section>
    </div>
  );
}
