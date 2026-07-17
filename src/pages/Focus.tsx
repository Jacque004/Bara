import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, CheckSquare, Pause, Play, RotateCcw } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { fetchTasks, insertStudySession } from "@/lib/api";

const WORK = 25 * 60;
const BREAK = 5 * 60;

export function Focus() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const uid = user?.id;

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks", uid],
    queryFn: () => fetchTasks(uid!),
    enabled: !!uid,
  });

  const [taskId, setTaskId] = useState("");
  const [phase, setPhase] = useState<"work" | "break">("work");
  const [left, setLeft] = useState(WORK);
  const [running, setRunning] = useState(false);
  const [justCompleted, setJustCompleted] = useState(false);
  const handledZero = useRef(false);

  const saveMut = useMutation({
    mutationFn: (minutes: number) =>
      insertStudySession({
        user_id: uid!,
        task_id: taskId,
        date: new Date().toISOString().slice(0, 10),
        duration_minutes: minutes,
        completed: true,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sessions", uid] });
      setJustCompleted(true);
      window.setTimeout(() => setJustCompleted(false), 4200);
    },
  });

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setLeft((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  useEffect(() => {
    if (left > 0) handledZero.current = false;
    if (!running || left !== 0 || handledZero.current) return;
    handledZero.current = true;
    setRunning(false);
    if (phase === "work" && taskId) {
      saveMut.mutate(25);
      setPhase("break");
      setLeft(BREAK);
    } else {
      setPhase("work");
      setLeft(WORK);
    }
  }, [left, running, phase, taskId, saveMut]);

  const open = tasks.filter(
    (t: { status: string }) => t.status !== "done"
  ) as { id: string; title: string }[];

  useEffect(() => {
    if (!taskId && open[0]) setTaskId(open[0].id);
  }, [open, taskId]);

  const total = phase === "work" ? WORK : BREAK;
  const progress = 1 - left / total;
  const radius = 108;
  const circ = 2 * Math.PI * radius;
  const dashOffset = circ * (1 - progress);

  const mm = Math.floor(Math.max(0, left) / 60);
  const ss = Math.max(0, left) % 60;

  const selectedTitle = useMemo(
    () => open.find((t) => t.id === taskId)?.title,
    [open, taskId]
  );

  return (
    <div className="space-y-8 bara-enter">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mode Focus</h1>
        <p className="mt-1 text-[var(--color-bara-muted)]">
          Une bulle de 25 minutes. Le temps est enregistré automatiquement.
        </p>
      </div>

      {open.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="Choisis d’abord une tâche"
          description="Le Focus s’attache à une tâche ouverte pour mesurer ta progression."
          actionLabel="Créer une tâche"
          actionTo="/app/taches"
        />
      ) : (
        <div
          className={[
            "bara-focus-stage mx-auto max-w-md rounded-3xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-5 text-center sm:p-8",
            running ? "is-running" : "",
          ].join(" ")}
        >
          {justCompleted && (
            <div className="bara-celebrate mb-5 flex items-center justify-center gap-2 rounded-xl bg-green-500/12 px-3 py-2 text-sm font-medium text-green-700 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              Session enregistrée — belle avance.
            </div>
          )}

          <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-bara-muted)]">
            {phase === "work" ? "Travail" : "Pause"}
          </p>

          <div className="relative mx-auto mt-4 h-52 w-52 sm:mt-5 sm:h-60 sm:w-60">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 240 240" aria-hidden>
              <circle
                cx="120"
                cy="120"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                className="text-black/10 dark:text-white/10"
              />
              <circle
                cx="120"
                cy="120"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circ}
                strokeDashoffset={dashOffset}
                className={
                  phase === "work"
                    ? "text-orange-600 transition-[stroke-dashoffset] duration-1000 linear"
                    : "text-emerald-500 transition-[stroke-dashoffset] duration-1000 linear"
                }
                style={
                  {
                    "--bara-ring-circ": circ,
                  } as CSSProperties
                }
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="font-mono text-4xl font-bold tabular-nums tracking-tight sm:text-5xl">
                {String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
              </p>
              {selectedTitle && (
                <p className="mt-2 max-w-[11rem] truncate text-xs text-[var(--color-bara-muted)]">
                  {selectedTitle}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6 text-left">
            <label className="text-sm font-medium">Tâche associée</label>
            <select
              value={taskId}
              onChange={(e) => setTaskId(e.target.value)}
              disabled={running}
              className="mt-1 w-full rounded-lg border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] px-3 py-3 text-sm disabled:opacity-60 sm:py-2"
            >
              {open.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <button
              type="button"
              onClick={() => setRunning((r) => !r)}
              disabled={phase === "work" && !taskId}
              className="bara-cta bara-touch inline-flex h-14 w-14 items-center justify-center rounded-full bg-orange-600 text-white transition hover:bg-orange-500 disabled:opacity-50"
              aria-label={running ? "Pause" : "Démarrer"}
            >
              {running ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 pl-0.5" />
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setRunning(false);
                setPhase("work");
                setLeft(WORK);
                setJustCompleted(false);
              }}
              className="bara-cta bara-touch inline-flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-bara-border)] transition hover:bg-black/5 dark:hover:bg-white/5"
              aria-label="Réinitialiser"
            >
              <RotateCcw className="h-5 w-5" />
            </button>
          </div>

          <p className="mt-5 text-xs text-[var(--color-bara-muted)]">
            Astuce : reste sur cet écran — chaque session alimente ta série du jour.
          </p>
          <Link
            to="/app"
            className="mt-3 inline-block text-xs font-medium text-orange-600 hover:underline dark:text-orange-400"
          >
            Voir ma progression
          </Link>
        </div>
      )}
    </div>
  );
}
