import { useMutation, useQuery } from "@tanstack/react-query";
import { format, isBefore, parseISO, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { AlertTriangle, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { fetchStudySessions, fetchTasks, invokeSendAlertsEmail } from "@/lib/api";
import type { Task } from "@/types/database";

type TaskRow = Task & {
  subjects: { name: string; color: string } | null;
};

export function Dashboard() {
  const { user } = useAuth();
  const uid = user?.id;
  const [onboardingClosed, setOnboardingClosed] = useState(false);

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

  const today = startOfDay(new Date());
  const rows = tasks as TaskRow[];

  const notDone = rows.filter((t) => t.status !== "done");
  const overdue = notDone.filter((t) =>
    isBefore(parseISO(t.deadline), today)
  );
  const upcoming = notDone
    .filter((t) => !isBefore(parseISO(t.deadline), today))
    .slice(0, 5);

  const total = rows.length || 1;
  const doneCount = rows.filter((t) => t.status === "done").length;
  const progressPct = Math.round((doneCount / total) * 100);

  const studiedMin = (sessions as { duration_minutes: number }[]).reduce(
    (a, s) => a + s.duration_minutes,
    0
  );

  const soon = notDone.filter((t) => {
    const d = parseISO(t.deadline);
    const diff = (d.getTime() - today.getTime()) / 86400000;
    return diff >= 0 && diff <= 2;
  });

  useEffect(() => {
    if (!uid) return;
    const raw = localStorage.getItem(`bara-onboarding-closed:${uid}`);
    setOnboardingClosed(raw === "1");
  }, [uid]);

  const onboardingDone = onboardingClosed || (rows.length > 0 && sessions.length > 0);
  const onboardingSteps = [
    {
      label: "Créer une matière",
      to: "/app/matieres",
      done: rows.some(Boolean),
    },
    {
      label: "Ajouter au moins une tâche",
      to: "/app/taches",
      done: rows.length > 0,
    },
    {
      label: "Générer un premier planning",
      to: "/app/planning",
      done: false,
    },
    {
      label: "Lancer une session Focus",
      to: "/app/focus",
      done: sessions.length > 0,
    },
  ];

  const closeOnboarding = () => {
    if (!uid) return;
    localStorage.setItem(`bara-onboarding-closed:${uid}`, "1");
    setOnboardingClosed(true);
  };

  const sendMailMut = useMutation({
    mutationFn: () => invokeSendAlertsEmail(uid!),
  });

  return (
    <div className="space-y-6">
      {!onboardingDone && (
        <section className="rounded-2xl border border-orange-600/30 bg-orange-500/10 p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="font-semibold">Onboarding rapide</h2>
              <p className="mt-1 text-sm text-[var(--color-bara-muted)]">
                Configure ton espace en 4 actions pour profiter du planning intelligent.
              </p>
            </div>
            <button
              type="button"
              onClick={closeOnboarding}
              className="rounded-lg border border-[var(--color-bara-border)] px-3 py-2 text-sm hover:bg-black/5"
            >
              Masquer
            </button>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {onboardingSteps.map((step) => (
              <Link
                key={step.label}
                to={step.to}
                className="flex items-center justify-between gap-3 rounded-lg border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] px-3 py-2 text-sm hover:bg-black/5"
              >
                <span>{step.label}</span>
                <span
                  className={
                    step.done
                      ? "rounded-full bg-green-500/15 px-2 py-0.5 text-xs text-green-700"
                      : "rounded-full bg-black/10 px-2 py-0.5 text-xs text-[var(--color-bara-muted)]"
                  }
                >
                  {step.done ? "OK" : "À faire"}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Tableau de bord</h1>
            <p className="mt-1 text-sm text-[var(--color-bara-muted)]">
              Nouvelle vue synthétique : progression, alertes et prochaines actions.
            </p>
          </div>
          <div className="w-full max-w-md">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="text-[var(--color-bara-muted)]">Progression globale</span>
              <strong>{progressPct}%</strong>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
              <div
                className="h-full rounded-full bg-orange-600 transition-all"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-[var(--color-bara-muted)]">
              {doneCount} tâche(s) terminée(s) sur {rows.length}
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Clock}
          label="Temps étudié"
          value={`${Math.floor(studiedMin / 60)}h ${studiedMin % 60}min`}
          sub="Sessions enregistrées"
        />
        <StatCard
          icon={TrendingUp}
          label="Progression"
          value={`${progressPct}%`}
          sub={`${doneCount} / ${rows.length} tâches terminées`}
        />
        <StatCard
          icon={AlertTriangle}
          label="En retard"
          value={String(overdue.length)}
          sub="Échéance dépassée"
        />
        <StatCard
          icon={CheckCircle2}
          label="À venir"
          value={String(upcoming.length)}
          sub="Prochaines échéances"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <section className="rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-6 xl:col-span-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="font-semibold">Alertes & rappels</h2>
              <p className="mt-1 text-sm text-[var(--color-bara-muted)]">
                Priorité immédiate sur les tâches en retard puis celles proches de l’échéance.
              </p>
            </div>
            <button
              type="button"
              onClick={() => sendMailMut.mutate()}
              disabled={sendMailMut.isPending || !uid}
              className="rounded-lg bg-orange-600 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-60"
            >
              {sendMailMut.isPending ? "Envoi..." : "Recevoir par mail"}
            </button>
          </div>
          {sendMailMut.isSuccess && (
            <p className="mt-3 rounded-lg bg-green-500/10 px-3 py-2 text-sm text-green-700">
              Récapitulatif envoyé par mail.
            </p>
          )}
          {sendMailMut.isError && (
            <p className="mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-700">
              {(sendMailMut.error as Error)?.message ??
                "Échec de l’envoi email. Vérifie la configuration de la fonction."}
            </p>
          )}
          <ul className="mt-4 space-y-2">
            {overdue.length === 0 && soon.length === 0 && (
              <li className="rounded-lg bg-black/[0.03] px-3 py-2 text-sm text-[var(--color-bara-muted)] dark:bg-white/[0.04]">
                Aucune alerte pour le moment.
              </li>
            )}
            {overdue.map((t) => (
              <li
                key={t.id}
                className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm"
              >
                <AlertTriangle className="h-4 w-4 shrink-0 text-red-600 dark:text-red-400" />
                <span>
                  <strong>{t.title}</strong> — en retard (
                  {format(parseISO(t.deadline), "d MMM yyyy", { locale: fr })})
                </span>
              </li>
            ))}
            {soon.map((t) => (
              <li
                key={t.id}
                className="flex items-center gap-2 rounded-lg bg-amber-500/10 px-3 py-2 text-sm"
              >
                <Clock className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>
                  <strong>{t.title}</strong> — bientôt (
                  {format(parseISO(t.deadline), "d MMM", { locale: fr })})
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-6">
          <h2 className="font-semibold">À faire ensuite</h2>
          <ul className="mt-4 space-y-3">
            {upcoming.length === 0 ? (
              <li className="rounded-lg bg-black/[0.03] px-3 py-2 text-sm text-[var(--color-bara-muted)] dark:bg-white/[0.04]">
                Aucune tâche active à venir.
              </li>
            ) : (
              upcoming.map((t) => (
                <li
                  key={t.id}
                  className="rounded-lg border border-[var(--color-bara-border)] px-3 py-2 text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: t.subjects?.color ?? "#888" }}
                    />
                    <strong className="truncate">{t.title}</strong>
                  </div>
                  <p className="mt-1 text-xs text-[var(--color-bara-muted)]">
                    Échéance : {format(parseISO(t.deadline), "d MMM yyyy", { locale: fr })}
                  </p>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-4 shadow-sm">
      <div className="flex items-center gap-2 text-[var(--color-bara-muted)]">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-2 text-2xl font-bold">{value}</p>
      <p className="text-xs text-[var(--color-bara-muted)]">{sub}</p>
    </div>
  );
}
