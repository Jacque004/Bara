import { useMutation, useQuery } from "@tanstack/react-query";
import { format, isBefore, parseISO, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  Flame,
  Play,
  Sparkles,
  Target,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import {
  fetchProfile,
  fetchStudySessions,
  fetchSubjects,
  fetchTasks,
  invokeSendAlertsEmail,
} from "@/lib/api";
import {
  DAILY_STUDY_GOAL_MIN,
  computeStudyStreak,
  greetingForHour,
  minutesToday,
} from "@/lib/engagement";
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

  const { data: subjects = [] } = useQuery({
    queryKey: ["subjects", uid],
    queryFn: () => fetchSubjects(uid!),
    enabled: !!uid,
  });

  const { data: profile } = useQuery({
    queryKey: ["profile", uid],
    queryFn: () => fetchProfile(uid!),
    enabled: !!uid,
  });

  const today = startOfDay(new Date());
  const todayISO = new Date().toISOString().slice(0, 10);
  const rows = tasks as TaskRow[];
  const sessionRows = sessions as { date: string; duration_minutes: number }[];

  const notDone = rows.filter((t) => t.status !== "done");
  const overdue = notDone.filter((t) => isBefore(parseISO(t.deadline), today));
  const upcoming = notDone
    .filter((t) => !isBefore(parseISO(t.deadline), today))
    .slice(0, 5);

  const total = rows.length || 1;
  const doneCount = rows.filter((t) => t.status === "done").length;
  const progressPct = Math.round((doneCount / total) * 100);

  const studiedMin = sessionRows.reduce((a, s) => a + s.duration_minutes, 0);
  const todayMin = useMemo(
    () => minutesToday(sessionRows, todayISO),
    [sessionRows, todayISO]
  );
  const streak = useMemo(
    () => computeStudyStreak(sessionRows.map((s) => s.date), todayISO),
    [sessionRows, todayISO]
  );
  const dailyPct = Math.min(
    100,
    Math.round((todayMin / DAILY_STUDY_GOAL_MIN) * 100)
  );

  const soon = notDone.filter((t) => {
    const d = parseISO(t.deadline);
    const diff = (d.getTime() - today.getTime()) / 86400000;
    return diff >= 0 && diff <= 2;
  });

  const firstName =
    profile?.first_name?.trim() ||
    user?.email?.split("@")[0] ||
    "étudiant";
  const greeting = greetingForHour();
  const nextTask = overdue[0] ?? soon[0] ?? upcoming[0] ?? null;

  useEffect(() => {
    if (!uid) return;
    const raw = localStorage.getItem(`bara-onboarding-closed:${uid}`);
    setOnboardingClosed(raw === "1");
  }, [uid]);

  const onboardingDone =
    onboardingClosed || (subjects.length > 0 && rows.length > 0 && sessions.length > 0);
  const onboardingSteps = [
    {
      label: "Créer une matière",
      to: "/app/matieres",
      done: subjects.length > 0,
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
    <div className="space-y-6 bara-enter">
      <section className="bara-enter relative overflow-hidden rounded-3xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-6 sm:p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-orange-500/15 blur-3xl bara-pulse-soft"
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
              {greeting}, {firstName}
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-balance">
              {nextTask
                ? "Une session, et tu avances."
                : "Ton espace d’étude est prêt."}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-[var(--color-bara-muted)]">
              {nextTask
                ? `Prochaine priorité : ${nextTask.title}`
                : "Ajoute une tâche ou lance un Focus pour démarrer la journée."}
            </p>
            <div className="mt-5 flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-3">
              <Link
                to="/app/focus"
                className="bara-cta bara-touch inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
              >
                <Play className="h-4 w-4" />
                Lancer un Focus
              </Link>
              <Link
                to={nextTask ? "/app/taches" : "/app/matieres"}
                className="bara-cta bara-touch inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-bara-border)] px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.03] dark:hover:bg-white/[0.05]"
              >
                {nextTask ? "Voir mes tâches" : "Créer une matière"}
              </Link>
            </div>
          </div>

          <div className="grid w-full max-w-md grid-cols-2 gap-3">
            <div className="rounded-2xl bg-orange-600/10 px-4 py-3">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-orange-700 dark:text-orange-300">
                <Target className="h-3.5 w-3.5" />
                Aujourd’hui
              </div>
              <p className="mt-2 text-2xl font-bold tabular-nums">
                {todayMin}
                <span className="text-sm font-medium text-[var(--color-bara-muted)]">
                  {" "}
                  / {DAILY_STUDY_GOAL_MIN} min
                </span>
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                <div
                  className="bara-progress-fill h-full rounded-full bg-orange-600"
                  style={{ width: `${dailyPct}%` }}
                />
              </div>
            </div>
            <div className="rounded-2xl bg-black/[0.03] px-4 py-3 dark:bg-white/[0.05]">
              <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[var(--color-bara-muted)]">
                <Flame className="h-3.5 w-3.5 text-orange-600" />
                Série
              </div>
              <p className="mt-2 text-2xl font-bold tabular-nums">
                {streak}
                <span className="text-sm font-medium text-[var(--color-bara-muted)]">
                  {" "}
                  jour{streak > 1 ? "s" : ""}
                </span>
              </p>
              <p className="mt-2 text-xs text-[var(--color-bara-muted)]">
                {streak > 0
                  ? "Continue pour garder le rythme."
                  : "Une session Focus démarre ta série."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {!onboardingDone && (
        <section className="bara-enter-delay-1 rounded-2xl border border-orange-600/25 bg-orange-500/[0.08] p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="flex items-center gap-2 font-semibold">
                <Sparkles className="h-4 w-4 text-orange-600" />
                Premiers pas
              </h2>
              <p className="mt-1 text-sm text-[var(--color-bara-muted)]">
                Quatre gestes pour activer tout le potentiel de BARA.
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
                className="flex items-center justify-between gap-3 rounded-xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] px-3 py-2.5 text-sm transition hover:border-orange-500/40 hover:bg-orange-500/[0.04]"
              >
                <span>{step.label}</span>
                <span
                  className={
                    step.done
                      ? "text-xs font-medium text-green-700 dark:text-green-400"
                      : "text-xs text-[var(--color-bara-muted)]"
                  }
                >
                  {step.done ? "Fait" : "À faire"}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="bara-enter-delay-1 grid gap-3 sm:grid-cols-3">
        <MiniStat
          icon={Clock}
          label="Temps total"
          value={`${Math.floor(studiedMin / 60)}h ${studiedMin % 60}m`}
        />
        <MiniStat icon={CheckCircle2} label="Progression" value={`${progressPct}%`} />
        <MiniStat
          icon={AlertTriangle}
          label="En retard"
          value={String(overdue.length)}
          tone={overdue.length > 0 ? "warn" : "ok"}
        />
      </div>

      <div className="bara-enter-delay-2 grid gap-4 xl:grid-cols-3">
        <section className="rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-6 xl:col-span-2">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="font-semibold">Alertes & rappels</h2>
              <p className="mt-1 text-sm text-[var(--color-bara-muted)]">
                Ce qui demande ton attention aujourd’hui.
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
          {overdue.length === 0 && soon.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                icon={CheckCircle2}
                title="Rien d’urgent"
                description="Belle avance. Lance un Focus pour consolider, ou planifie la suite."
                actionLabel="Ouvrir le Focus"
                actionTo="/app/focus"
              />
            </div>
          ) : (
            <ul className="mt-4 space-y-2">
              {overdue.map((t) => (
                <li
                  key={t.id}
                  className="flex items-center gap-2 rounded-xl bg-red-500/10 px-3 py-2.5 text-sm"
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
                  className="flex items-center gap-2 rounded-xl bg-amber-500/10 px-3 py-2.5 text-sm"
                >
                  <Clock className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>
                    <strong>{t.title}</strong> — bientôt (
                    {format(parseISO(t.deadline), "d MMM", { locale: fr })})
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-6">
          <h2 className="font-semibold">À faire ensuite</h2>
          {upcoming.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                icon={Target}
                title="File d’attente vide"
                description="Ajoute une échéance pour que BARA te guide au quotidien."
                actionLabel="Ajouter une tâche"
                actionTo="/app/taches"
              />
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {upcoming.map((t) => (
                <li
                  key={t.id}
                  className="rounded-xl border border-[var(--color-bara-border)] px-3 py-2.5 text-sm transition hover:border-orange-500/35"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: t.subjects?.color ?? "#888" }}
                    />
                    <strong className="truncate">{t.title}</strong>
                  </div>
                  <p className="mt-1 text-xs text-[var(--color-bara-muted)]">
                    Échéance :{" "}
                    {format(parseISO(t.deadline), "d MMM yyyy", { locale: fr })}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  label,
  value,
  tone = "neutral",
}: {
  icon: typeof Clock;
  label: string;
  value: string;
  tone?: "neutral" | "warn" | "ok";
}) {
  const toneClass =
    tone === "warn"
      ? "text-red-600 dark:text-red-400"
      : tone === "ok"
        ? "text-green-700 dark:text-green-400"
        : "";
  return (
    <div className="rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] px-4 py-3">
      <div className="flex items-center gap-2 text-[var(--color-bara-muted)]">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className={`mt-1.5 text-xl font-bold tabular-nums ${toneClass}`}>{value}</p>
    </div>
  );
}
