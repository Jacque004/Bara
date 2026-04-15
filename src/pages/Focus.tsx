import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
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

  const mm = Math.floor(Math.max(0, left) / 60);
  const ss = Math.max(0, left) % 60;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Mode Focus</h1>
        <p className="mt-1 text-[var(--color-bara-muted)]">
          Pomodoro 25 / 5 — le temps de travail est enregistré automatiquement.
        </p>
      </div>

      <div className="mx-auto max-w-md rounded-3xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-8 text-center shadow-sm">
        <p className="text-sm font-medium uppercase tracking-widest text-[var(--color-bara-muted)]">
          {phase === "work" ? "Travail" : "Pause"}
        </p>
        <p className="mt-4 font-mono text-6xl font-bold tabular-nums">
          {String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
        </p>

        <div className="mt-6 text-left">
          <label className="text-sm font-medium">Tâche associée</label>
          <select
            value={taskId}
            onChange={(e) => setTaskId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] px-3 py-2 text-sm"
          >
            {open.length === 0 ? (
              <option value="">Aucune tâche ouverte</option>
            ) : (
              open.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="mt-6 flex justify-center gap-3">
          <button
            type="button"
            onClick={() => setRunning((r) => !r)}
            disabled={phase === "work" && !taskId}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-orange-600 text-white hover:bg-orange-500 disabled:opacity-50"
          >
            {running ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 pl-0.5" />}
          </button>
          <button
            type="button"
            onClick={() => {
              setRunning(false);
              setPhase("work");
              setLeft(WORK);
            }}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[var(--color-bara-border)] hover:bg-black/5 dark:hover:bg-white/5"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
