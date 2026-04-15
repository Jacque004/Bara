import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import {
  createSubject,
  deleteSubject,
  fetchSubjects,
  updateSubject,
} from "@/lib/api";

const PRESETS = [
  "#6366f1",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
];

export function Subjects() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const uid = user?.id;
  const [name, setName] = useState("");
  const [color, setColor] = useState(PRESETS[0]);

  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects", uid],
    queryFn: () => fetchSubjects(uid!),
    enabled: !!uid,
  });

  const createMut = useMutation({
    mutationFn: () => createSubject(uid!, { name: name.trim(), color }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["subjects", uid] });
      setName("");
    },
  });

  const delMut = useMutation({
    mutationFn: deleteSubject,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subjects", uid] }),
  });

  const renMut = useMutation({
    mutationFn: ({ id, n }: { id: string; n: string }) =>
      updateSubject(id, { name: n }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subjects", uid] }),
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Matières</h1>
        <p className="mt-1 text-[var(--color-bara-muted)]">
          Organisez vos cours par matière et couleur.
        </p>
      </div>

      <form
        className="flex flex-col gap-3 rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-4 sm:flex-row sm:items-end"
        onSubmit={(e) => {
          e.preventDefault();
          if (!name.trim()) return;
          createMut.mutate();
        }}
      >
        <div className="min-w-0 flex-1">
          <label className="text-sm font-medium">Nouvelle matière</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex. Mathématiques"
            className="mt-1 w-full rounded-lg border border-[var(--color-bara-border)] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        <div>
          <label className="text-sm font-medium">Couleur</label>
          <div className="mt-1 flex flex-wrap gap-1">
            {PRESETS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`h-8 w-8 rounded-lg border-2 ${
                  color === c ? "border-orange-600" : "border-transparent"
                }`}
                style={{ background: c }}
                aria-label={`Couleur ${c}`}
              />
            ))}
          </div>
        </div>
        <button
          type="submit"
          disabled={createMut.isPending}
          className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-60"
        >
          Ajouter
        </button>
      </form>

      <ul className="space-y-2">
        {subjects.length === 0 && (
          <li className="text-sm text-[var(--color-bara-muted)]">
            Aucune matière pour l’instant.
          </li>
        )}
        {subjects.map((s) => (
          <li
            key={s.id}
            className="flex items-center gap-3 rounded-xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] px-4 py-3"
          >
            <span
              className="h-4 w-4 shrink-0 rounded-full"
              style={{ background: s.color }}
            />
            <input
              defaultValue={s.name}
              onBlur={(e) => {
                const n = e.target.value.trim();
                if (n && n !== s.name) renMut.mutate({ id: s.id, n });
              }}
              className="min-w-0 flex-1 border-none bg-transparent text-sm font-medium outline-none"
            />
            <button
              type="button"
              onClick={() => {
                if (confirm("Supprimer cette matière et ses tâches liées ?"))
                  delMut.mutate(s.id);
              }}
              className="rounded-lg p-2 text-red-600 hover:bg-red-500/10 dark:text-red-400"
              aria-label="Supprimer"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
