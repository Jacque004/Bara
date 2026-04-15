import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { useEffect, useState } from "react";
import { Mail, ShieldCheck, Timer, UserCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { fetchProfile, fetchStudySessions, fetchTasks, upsertProfile } from "@/lib/api";

export function Profile() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const uid = user?.id;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  const { data: tasks = [] } = useQuery({
    queryKey: ["tasks", uid],
    queryFn: () => fetchTasks(uid!),
    enabled: !!uid,
  });

  const { data: sessions = [] } = useQuery({
    queryKey: ["sessions", uid],
    queryFn: () => fetchStudySessions(uid!),
    enabled: !!uid,
  });

  const { data: profile } = useQuery({
    queryKey: ["profile", uid],
    queryFn: () => fetchProfile(uid!),
    enabled: !!uid,
  });

  useEffect(() => {
    setFirstName(profile?.first_name ?? "");
    setLastName(profile?.last_name ?? "");
    setAvatarUrl(profile?.avatar_url ?? "");
  }, [profile]);

  const saveMutation = useMutation({
    mutationFn: () =>
      upsertProfile({
        user_id: uid!,
        first_name: firstName.trim() || null,
        last_name: lastName.trim() || null,
        avatar_url: avatarUrl.trim() || null,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["profile", uid] });
    },
  });

  const doneTasks = tasks.filter((t: { status: string }) => t.status === "done").length;
  const totalTasks = tasks.length;
  const studiedMin = (sessions as { duration_minutes: number }[]).reduce(
    (acc, s) => acc + s.duration_minutes,
    0
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profil</h1>
        <p className="mt-1 text-[var(--color-bara-muted)]">
          Informations de votre compte et aperçu de votre activité.
        </p>
      </div>

      <section className="rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-6">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-orange-600/15 p-3 text-orange-600 dark:text-orange-400">
            <UserCircle2 className="h-8 w-8" />
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold">Compte étudiant</h2>
            <p className="mt-1 text-sm text-[var(--color-bara-muted)]">
              UID: <span className="font-mono text-xs">{user?.id}</span>
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <InfoRow icon={Mail} label="E-mail" value={user?.email ?? "—"} />
          <InfoRow
            icon={ShieldCheck}
            label="Créé le"
            value={
              user?.created_at
                ? format(parseISO(user.created_at), "d MMMM yyyy", { locale: fr })
                : "—"
            }
          />
          <InfoRow
            icon={Timer}
            label="Temps étudié"
            value={`${Math.floor(studiedMin / 60)}h ${studiedMin % 60}min`}
          />
          <InfoRow
            icon={ShieldCheck}
            label="Tâches terminées"
            value={`${doneTasks} / ${totalTasks}`}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-6">
        <h2 className="font-semibold">Informations personnelles</h2>
        <p className="mt-2 text-sm text-[var(--color-bara-muted)]">
          Modifiez les informations visibles dans votre espace.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Prénom</label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Ex. Jacques"
              className="mt-1 w-full rounded-lg border border-[var(--color-bara-border)] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Nom</label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Ex. Loemba"
              className="mt-1 w-full rounded-lg border border-[var(--color-bara-border)] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
        <div className="mt-3">
          <label className="text-sm font-medium">Avatar URL (optionnel)</label>
          <input
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
            placeholder="https://..."
            className="mt-1 w-full rounded-lg border border-[var(--color-bara-border)] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
        {saveMutation.isError && (
          <p className="mt-3 text-sm text-red-600">
            {(saveMutation.error as Error)?.message ?? "Erreur lors de la sauvegarde."}
          </p>
        )}
        {saveMutation.isSuccess && (
          <p className="mt-3 text-sm text-green-600 dark:text-green-400">
            Profil mis à jour.
          </p>
        )}
        <button
          type="button"
          disabled={!uid || saveMutation.isPending}
          onClick={() => saveMutation.mutate()}
          className="mt-4 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-60"
        >
          {saveMutation.isPending ? "Sauvegarde..." : "Enregistrer le profil"}
        </button>
      </section>

      <section className="rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-6">
        <h2 className="font-semibold">Sécurité</h2>
        <p className="mt-2 text-sm text-[var(--color-bara-muted)]">
          Pour changer votre mot de passe, utilisez la page{" "}
          <span className="font-medium">Mot de passe oublié</span> depuis l’écran de connexion.
        </p>
      </section>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-[var(--color-bara-border)] bg-black/[0.02] p-3 dark:bg-white/[0.03]">
      <div className="flex items-center gap-2 text-xs text-[var(--color-bara-muted)]">
        <Icon className="h-3.5 w-3.5" />
        <span className="uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-1 break-all text-sm font-medium">{value}</p>
    </div>
  );
}
