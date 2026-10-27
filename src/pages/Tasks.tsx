import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, isBefore, parseISO, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { useMemo, useState } from "react";
import { CheckSquare, Plus, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
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

const filters: { id: "all" | TaskStatus; label: string }[] = [
  { id: "all", label: "Toutes" },
  { id: "todo", label: "À faire" },
  { id: "doing", label: "En cours" },
  { id: "done", label: "Terminées" },
];

type TaskView = {
  id: string;
  title: string;
  type: TaskType;
  deadline: string;
  status: TaskStatus;
  subjects: { name: string; color: string } | null;
};

function isLate(task: Pick<TaskView, "deadline" | "status">) {
  if (task.status === "done") return false;
  return isBefore(parseISO(task.deadline), startOfDay(new Date()));
}

export function Tasks() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const uid = user?.id;

  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects", uid],
    queryFn: () => fetchSubjects(uid!),
    enabled: !!uid,
  });

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", uid],
    queryFn: () => fetchTasks(uid!),
    enabled: !!uid,
  });

  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [formPref, setFormPref] = useState<boolean | null>(null);

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
  const rows = tasks as TaskView[];
  const showForm = formPref ?? (!isLoading && rows.length === 0);
  const visible = useMemo(() => {
    return rows
      .filter((task) => filter === "all" || task.status === filter)
      .sort((a, b) => {
        const late = Number(isLate(b)) - Number(isLate(a));
        if (late !== 0) return late;
        return a.deadline.localeCompare(b.deadline);
      });
  }, [rows, filter]);

  return (
    <div className="space-y-8 bara-enter">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tâches</h1>
          <p className="mt-1 text-[var(--color-bara-muted)]">
            Filtre tes échéances, puis enchaîne en Focus.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setFormPref(!showForm)}
          className="bara-cta bara-touch inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-500"
        >
          <Plus className="h-4 w-4" />
          {showForm ? "Masquer le formulaire" : "Nouvelle tâche"}
        </button>
      </div>

      {showForm && (
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
            placeholder="Ex. Réviser le chapitre 3"
            className="bara-field mt-1 w-full"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Matière</label>
          <select
            value={sid}
            onChange={(e) => setSubjectId(e.target.value)}
            className="bara-field mt-1 w-full bg-[var(--color-bara-surface)]"
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
            className="bara-field mt-1 w-full bg-[var(--color-bara-surface)]"
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
            className="bara-field mt-1 w-full"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Temps estimé (h)</label>
          <input
            type="number"
            min={0}
            value={hours}
            onChange={(e) => setHours(Number(e.target.value))}
            className="bara-field mt-1 w-full"
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
        <div className="md:col-span-2 space-y-2">
          {subjects.length === 0 && (
            <p className="text-sm text-[var(--color-bara-muted)]">
              Crée d’abord une matière pour pouvoir ajouter une tâche.
            </p>
          )}
          {createMut.isError && (
            <p className="text-sm text-red-600" role="alert">
              Impossible d’enregistrer la tâche. Réessaie dans un instant.
            </p>
          )}
          <button
            type="submit"
            disabled={!sid || createMut.isPending}
            className="rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-60"
          >
            {createMut.isPending ? "Enregistrement…" : "Créer la tâche"}
          </button>
        </div>
      </form>
      )}

      {rows.length > 0 && (
        <div className="flex gap-2 overflow-x-auto scrollbar-none" aria-label="Filtrer les tâches">
          {filters.map((item) => {
            const count =
              item.id === "all"
                ? rows.length
                : rows.filter((task) => task.status === item.id).length;
            const active = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(item.id)}
                className={[
                  "bara-touch shrink-0 rounded-full px-3 text-sm font-medium transition",
                  active
                    ? "bg-orange-600 text-white"
                    : "border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] text-[var(--color-bara-muted)]",
                ].join(" ")}
              >
                {item.label}
                <span className="ml-1.5 tabular-nums opacity-80">{count}</span>
              </button>
            );
          })}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-3" aria-hidden>
          <div className="h-24 animate-pulse rounded-2xl bg-black/5 dark:bg-white/5" />
          <div className="h-24 animate-pulse rounded-2xl bg-black/5 dark:bg-white/5" />
        </div>
      ) : rows.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="Pas encore de tâches"
          description={
            subjects.length === 0
              ? "Créez d’abord une matière, puis ajoutez votre première échéance."
              : "Ajoutez une tâche ci-dessus pour alimenter le planning et le Focus."
          }
          actionLabel={subjects.length === 0 ? "Créer une matière" : undefined}
          actionTo={subjects.length === 0 ? "/app/matieres" : undefined}
        />
      ) : visible.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-[var(--color-bara-border)] px-4 py-8 text-center text-sm text-[var(--color-bara-muted)]">
          Aucune tâche dans ce filtre.
        </p>
      ) : (
        <>
          <ul className="space-y-3 md:hidden">
            {visible.map((t) => (
              <li
                key={t.id}
                className={[
                  "rounded-2xl border bg-[var(--color-bara-surface)] p-4",
                  isLate(t)
                    ? "border-red-500/40"
                    : "border-[var(--color-bara-border)]",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold leading-snug">{t.title}</p>
                    <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--color-bara-muted)]">
                      <span
                        className="h-2 w-2 shrink-0 rounded-full"
                        style={{ background: t.subjects?.color ?? "#888" }}
                      />
                      <span className="truncate">{t.subjects?.name ?? "Sans matière"}</span>
                      <span>·</span>
                      <span>{types.find((item) => item.v === t.type)?.l ?? t.type}</span>
                      <span>·</span>
                      <span className={isLate(t) ? "font-medium text-red-600 dark:text-red-400" : ""}>
                        {isLate(t) ? "En retard · " : ""}
                        {format(parseISO(t.deadline), "d MMM yyyy", { locale: fr })}
                      </span>
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("Supprimer cette tâche ?")) delMut.mutate(t.id);
                    }}
                    className="bara-touch shrink-0 rounded-lg p-2 text-red-600 hover:bg-red-500/10"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <label className="mt-3 block text-xs font-medium text-[var(--color-bara-muted)]">
                  Statut
                </label>
                <select
                  value={t.status}
                  onChange={(e) =>
                    patchMut.mutate({
                      id: t.id,
                      patch: { status: e.target.value as TaskStatus },
                    })
                  }
                  className="mt-1 w-full rounded-xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] px-3 py-2.5 text-sm"
                >
                  {statuses.map((s) => (
                    <option key={s.v} value={s.v}>
                      {s.l}
                    </option>
                  ))}
                </select>
              </li>
            ))}
          </ul>

          {/* Tableau desktop */}
          <div className="hidden overflow-x-auto rounded-2xl border border-[var(--color-bara-border)] md:block">
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
                {visible.map((t) => (
                  <tr
                    key={t.id}
                    className="border-b border-[var(--color-bara-border)] transition last:border-0 hover:bg-orange-500/[0.03]"
                  >
                    <td className="px-4 py-3 font-medium">
                      <span>{t.title}</span>
                      <span className="mt-0.5 block text-xs font-normal text-[var(--color-bara-muted)]">
                        {types.find((item) => item.v === t.type)?.l ?? t.type}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ background: t.subjects?.color ?? "#888" }}
                        />
                        {t.subjects?.name ?? "Sans matière"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-bara-muted)]">
                      <span className={isLate(t) ? "font-medium text-red-600 dark:text-red-400" : ""}>
                        {isLate(t) ? "En retard · " : ""}
                        {format(parseISO(t.deadline), "d MMM yyyy", { locale: fr })}
                      </span>
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
                          if (confirm("Supprimer cette tâche ?")) delMut.mutate(t.id);
                        }}
                        className="rounded-lg p-2 text-red-600 hover:bg-red-500/10"
                        aria-label={`Supprimer ${t.title}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
