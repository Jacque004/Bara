import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  createTask,
  deleteTask,
  fetchSubjects,
  fetchTasks,
  updateTask,
} from "@/lib/api";
import type { TaskStatus, TaskType } from "@/types/database";

const types: { v: TaskType; l: string }[] = [
  { v: "homework", l: "Devoir" },
  { v: "revision", l: "Révision" },
  { v: "exam", l: "Examen" },
];

const statuses: { v: TaskStatus; l: string }[] = [
  { v: "todo", l: "À faire" },
  { v: "doing", l: "En cours" },
  { v: "done", l: "Terminé" },
];

export function Tasks() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const uid = user?.id;

  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects", uid],
    queryFn: () => fetchSubjects(uid!),
    enabled: !!uid,
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks", uid],
    queryFn: () => fetchTasks(uid!),
    enabled: !!uid,
  });

  const [subjectId, setSubjectId] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState<TaskType>("homework");
  const [deadline, setDeadline] = useState(
    () => new Date().toISOString().slice(0, 10)
  );
  const [hours, setHours] = useState(1);
  const [difficulty, setDifficulty] = useState(3);

  const createMut = useMutation({
    mutationFn: () =>
      createTask(uid!, {
        subject_id: subjectId,
        title: title.trim(),
        type,
        deadline,
        estimated_hours: hours,
        difficulty,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["tasks", uid] });
      setTitle("");
    },
  });

  const patchMut = useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string;
      patch: Parameters<typeof updateTask>[1];
    }) => updateTask(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks", uid] }),
  });

  const delMut = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks", uid] }),
  });

  const firstSubject = subjects[0]?.id ?? "";
  const sid = subjectId || firstSubject;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Tâches</h1>
        <p className="mt-1 text-[var(--color-bara-muted)]">
          Créez des tâches, associez une matière et une échéance.
        </p>
      </div>

      <form
        className="grid gap-3 rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-4 md:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!sid || !title.trim()) return;
          setSubjectId(sid);
          createMut.mutate();
        }}
      >
        <div className="md:col-span-2">
          <label className="text-sm font-medium">Titre</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--color-bara-border)] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Matière</label>
          <select
            value={sid}
            onChange={(e) => setSubjectId(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
          >
            {subjects.length === 0 ? (
              <option value="">Créez une matière d’abord</option>
            ) : (
              subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))
            )}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as TaskType)}
            className="mt-1 w-full rounded-lg border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
          >
            {types.map((t) => (
              <option key={t.v} value={t.v}>
                {t.l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium">Échéance</label>
          <input
            type="date"
            required
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="mt-1 w-full rounded-lg border border-[var(--color-bara-border)] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Temps estimé (h)</label>
          <input
            type="number"
            min={0}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-[var(--color-bara-border)] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Difficulté (1–5)</label>
          <input
            type="range"
            min={1}
            max={5}
            value={difficulty}
            onChange={(e) => setDifficulty(Number(e.target.value))}
            className="mt-3 w-full"
          />
          <p className="text-xs text-[var(--color-bara-muted)]">{difficulty}</p>
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={!sid || createMut.isPending}
            className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-60"
          >
            Créer la tâche
          </button>
        </div>
      </form>

      <div className="overflow-x-auto rounded-2xl border border-[var(--color-bara-border)]">
        <table className="w-full min-w-[640px] text-left text-sm">
          <thead className="border-b border-[var(--color-bara-border)] bg-black/[0.02] dark:bg-white/[0.03]">
            <tr>
              <th className="px-4 py-3 font-medium">Tâche</th>
              <th className="px-4 py-3 font-medium">Matière</th>
              <th className="px-4 py-3 font-medium">Échéance</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="w-10 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(tasks as { id: string; title: string; deadline: string; status: TaskStatus; subjects: { name: string; color: string } | null }[]).map(
              (t) => (
                <tr
                  key={t.id}
                  className="border-b border-[var(--color-bara-border)] last:border-0"
                >
                  <td className="px-4 py-3 font-medium">{t.title}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: t.subjects?.color ?? "#888" }}
                      />
                      {t.subjects?.name ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-bara-muted)]">
                    {format(parseISO(t.deadline), "d MMM yyyy", { locale: fr })}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={t.status}
                      onChange={(e) =>
                        patchMut.mutate({
                          id: t.id,
                          patch: { status: e.target.value as TaskStatus },
                        })
                      }
                      className="rounded border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] px-2 py-1 text-xs"
                    >
                      {statuses.map((s) => (
                        <option key={s.v} value={s.v}>
                          {s.l}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm("Supprimer cette tâche ?"))
                          delMut.mutate(t.id);
                      }}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
