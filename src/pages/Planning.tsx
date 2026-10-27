import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarDays, Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { fetchStudyPlans, invokeGenerateStudyPlan } from "@/lib/api";
import { PLANNING_SETTINGS_KEY } from "@/lib/gdpr";

type PlanRow = {
  id: string;
  planned_date: string;
  duration_minutes: number;
  priority_score: number;
  task_id: string;
  tasks: { title: string; subject_id: string } | { title: string; subject_id: string }[] | null;
};

function taskTitle(
  t: PlanRow["tasks"]
): { title: string; subject_id: string } | null {
  if (!t) return null;
  return Array.isArray(t) ? t[0] ?? null : t;
}

type PlanningSettings = {
  session_minutes: number;
  daily_minutes_limit: number;
  start_date: string;
};

function defaultSettings(): PlanningSettings {
  return {
    session_minutes: 25,
    daily_minutes_limit: 120,
    start_date: new Date().toISOString().slice(0, 10),
  };
}

function normalizeStep5Min(value: number, min = 25): number {
  const safe = Number.isFinite(value) ? value : min;
  return Math.max(min, Math.round(safe / 5) * 5);
}

export function Planning() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const uid = user?.id;
  const [settings, setSettings] = useState<PlanningSettings>(defaultSettings);

  useEffect(() => {
    const raw = localStorage.getItem(PLANNING_SETTINGS_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as Partial<PlanningSettings>;
      setSettings((prev) => ({
        session_minutes:
          typeof parsed.session_minutes === "number" ? parsed.session_minutes : prev.session_minutes,
        daily_minutes_limit:
          typeof parsed.daily_minutes_limit === "number"
            ? parsed.daily_minutes_limit
            : prev.daily_minutes_limit,
        start_date: typeof parsed.start_date === "string" ? parsed.start_date : prev.start_date,
      }));
    } catch {
      setSettings(defaultSettings());
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(PLANNING_SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ["plans", uid],
    queryFn: () => fetchStudyPlans(uid!),
    enabled: !!uid,
  });

  const genMut = useMutation({
    mutationFn: () => invokeGenerateStudyPlan(uid!, settings),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["plans", uid] }),
  });

  const rows = plans as unknown as PlanRow[];
  const byDate = rows.reduce<Record<string, PlanRow[]>>((acc, p) => {
    const k = p.planned_date;
    if (!acc[k]) acc[k] = [];
    acc[k].push(p);
    return acc;
  }, {});
  const dates = Object.keys(byDate).sort();

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Planning intelligent
          </h1>
          <p className="mt-1 max-w-xl text-[var(--color-bara-muted)]">
            BARA répartit tes tâches ouvertes en créneaux, en commençant par ce qui
            est urgent ou difficile.
          </p>
        </div>
        <button
          type="button"
          onClick={() => genMut.mutate()}
          disabled={genMut.isPending}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-60"
        >
          {genMut.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4" />
          )}
          Générer le planning
        </button>
      </div>

      <section className="rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-4 sm:p-5">
        <h2 className="font-semibold">Paramètres du planning</h2>
        <p className="mt-1 text-sm text-[var(--color-bara-muted)]">
          Ces paramètres pilotent la génération automatique et sont sauvegardés sur cet appareil.
        </p>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <label className="text-sm">
            <span className="mb-1 block text-[var(--color-bara-muted)]">Durée d’une session (min)</span>
            <input
              type="number"
              min={25}
              step={5}
              value={settings.session_minutes}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  session_minutes: normalizeStep5Min(Number(e.target.value), 25),
                }))
              }
              className="w-full rounded-lg border border-[var(--color-bara-border)] bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500/30"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-[var(--color-bara-muted)]">Temps max par jour (min)</span>
            <input
              type="number"
              min={25}
              step={5}
              value={settings.daily_minutes_limit}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  daily_minutes_limit: normalizeStep5Min(Number(e.target.value), 25),
                }))
              }
              className="w-full rounded-lg border border-[var(--color-bara-border)] bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500/30"
            />
          </label>
          <label className="text-sm">
            <span className="mb-1 block text-[var(--color-bara-muted)]">Date de démarrage</span>
            <input
              type="date"
              value={settings.start_date}
              onChange={(e) =>
                setSettings((s) => ({
                  ...s,
                  start_date: e.target.value || s.start_date,
                }))
              }
              className="w-full rounded-lg border border-[var(--color-bara-border)] bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500/30"
            />
          </label>
        </div>
      </section>

      {genMut.isError && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-3 text-sm text-red-700">
          <p className="font-medium">La génération du planning a échoué.</p>
          <p className="mt-1">
            {(genMut.error as Error)?.message ??
              "Réessaie dans un instant. Si le problème continue, vérifie ta connexion."}
          </p>
        </div>
      )}
      {genMut.isSuccess &&
        typeof genMut.data === "object" &&
        genMut.data &&
        "inserted" in genMut.data && (
          <p className="text-sm text-green-700 dark:text-green-400">
            {Number(genMut.data.inserted)} créneaux planifiés.
          </p>
        )}

      {isLoading ? (
        <div className="h-36 animate-pulse rounded-2xl bg-black/5 dark:bg-white/5" aria-hidden />
      ) : dates.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Aucun créneau pour l’instant"
          description="Ajoute des tâches encore ouvertes, puis génère un planning pour voir ta semaine."
          actionLabel="Ajouter une tâche"
          actionTo="/app/taches"
        />
      ) : (
        <div className="space-y-6">
          {dates.map((d) => (
            <section
              key={d}
              className="rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-4"
            >
              <h2 className="font-semibold">
                {format(parseISO(d), "EEEE d MMMM", { locale: fr })}
              </h2>
              <ul className="mt-3 space-y-2">
                {byDate[d].map((p) => (
                  <li
                    key={p.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-black/[0.03] px-3 py-2 text-sm dark:bg-white/[0.05]"
                  >
                    <span>{taskTitle(p.tasks)?.title ?? "Tâche"}</span>
                    <span className="text-[var(--color-bara-muted)]">
                      {p.duration_minutes} min
                      {p.priority_score >= 8 ? " · prioritaire" : ""}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
