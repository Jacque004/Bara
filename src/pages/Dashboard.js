import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMutation, useQuery } from "@tanstack/react-query";
import { format, isBefore, parseISO, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { AlertTriangle, CheckCircle2, Clock, Flame, Play, Sparkles, Target, } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { EmptyState } from "@/components/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { fetchProfile, fetchStudyPlans, fetchStudySessions, fetchSubjects, fetchTasks, invokeSendAlertsEmail, } from "@/lib/api";
import { DAILY_STUDY_GOAL_MIN, computeStudyStreak, greetingForHour, minutesToday, } from "@/lib/engagement";
export function Dashboard() {
    const { user } = useAuth();
    const uid = user?.id;
    const [onboardingClosed, setOnboardingClosed] = useState(false);
    const { data: tasks = [] } = useQuery({
        queryKey: ["tasks", uid],
        queryFn: () => fetchTasks(uid),
        enabled: !!uid,
    });
    const { data: sessions = [] } = useQuery({
        queryKey: ["sessions", uid],
        queryFn: () => fetchStudySessions(uid),
        enabled: !!uid,
    });
    const { data: subjects = [] } = useQuery({
        queryKey: ["subjects", uid],
        queryFn: () => fetchSubjects(uid),
        enabled: !!uid,
    });
    const { data: profile } = useQuery({
        queryKey: ["profile", uid],
        queryFn: () => fetchProfile(uid),
        enabled: !!uid,
    });
    const { data: plans = [] } = useQuery({
        queryKey: ["plans", uid],
        queryFn: () => fetchStudyPlans(uid),
        enabled: !!uid,
    });
    const today = startOfDay(new Date());
    const todayISO = new Date().toISOString().slice(0, 10);
    const rows = tasks;
    const sessionRows = sessions;
    const notDone = rows.filter((t) => t.status !== "done");
    const overdue = notDone.filter((t) => isBefore(parseISO(t.deadline), today));
    const upcoming = notDone
        .filter((t) => !isBefore(parseISO(t.deadline), today))
        .slice(0, 5);
    const total = rows.length || 1;
    const doneCount = rows.filter((t) => t.status === "done").length;
    const progressPct = Math.round((doneCount / total) * 100);
    const studiedMin = sessionRows.reduce((a, s) => a + s.duration_minutes, 0);
    const todayMin = useMemo(() => minutesToday(sessionRows, todayISO), [sessionRows, todayISO]);
    const streak = useMemo(() => computeStudyStreak(sessionRows.map((s) => s.date), todayISO), [sessionRows, todayISO]);
    const dailyPct = Math.min(100, Math.round((todayMin / DAILY_STUDY_GOAL_MIN) * 100));
    const soon = notDone.filter((t) => {
        const d = parseISO(t.deadline);
        const diff = (d.getTime() - today.getTime()) / 86400000;
        return diff >= 0 && diff <= 2;
    });
    const firstName = profile?.first_name?.trim() ||
        user?.email?.split("@")[0] ||
        "étudiant";
    const greeting = greetingForHour();
    const nextTask = overdue[0] ?? soon[0] ?? upcoming[0] ?? null;
    useEffect(() => {
        if (!uid)
            return;
        const raw = localStorage.getItem(`bara-onboarding-closed:${uid}`);
        setOnboardingClosed(raw === "1");
    }, [uid]);
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
            done: plans.length > 0,
        },
        {
            label: "Lancer une session Focus",
            to: "/app/focus",
            done: sessions.length > 0,
        },
    ];
    const onboardingDone = onboardingClosed || onboardingSteps.every((step) => step.done);
    const closeOnboarding = () => {
        if (!uid)
            return;
        localStorage.setItem(`bara-onboarding-closed:${uid}`, "1");
        setOnboardingClosed(true);
    };
    const sendMailMut = useMutation({
        mutationFn: () => invokeSendAlertsEmail(uid),
    });
    return (_jsxs("div", { className: "space-y-6 bara-enter", children: [_jsxs("section", { className: "bara-enter relative overflow-hidden rounded-3xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-6 sm:p-8", children: [_jsx("div", { "aria-hidden": true, className: "pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-orange-500/15 blur-3xl bara-pulse-soft" }), _jsxs("div", { className: "relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between", children: [_jsxs("div", { className: "max-w-xl", children: [_jsxs("p", { className: "text-sm font-medium text-orange-600 dark:text-orange-400", children: [greeting, ", ", firstName] }), _jsx("h1", { className: "mt-2 text-3xl font-bold tracking-tight text-balance", children: nextTask
                                            ? "Une session, et tu avances."
                                            : "Ton espace d’étude est prêt." }), _jsx("p", { className: "mt-2 text-sm leading-relaxed text-[var(--color-bara-muted)]", children: nextTask
                                            ? `Prochaine priorité : ${nextTask.title}`
                                            : "Ajoute une tâche ou lance un Focus pour démarrer la journée." }), _jsxs("div", { className: "mt-5 flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:flex-wrap sm:gap-3", children: [_jsxs(Link, { to: "/app/focus", className: "bara-cta bara-touch inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-500", children: [_jsx(Play, { className: "h-4 w-4" }), "Lancer un Focus"] }), _jsx(Link, { to: nextTask ? "/app/taches" : "/app/matieres", className: "bara-cta bara-touch inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-bara-border)] px-5 py-3 text-sm font-semibold transition hover:bg-black/[0.03] dark:hover:bg-white/[0.05]", children: nextTask ? "Voir mes tâches" : "Créer une matière" })] })] }), _jsxs("div", { className: "grid w-full max-w-md grid-cols-2 gap-3", children: [_jsxs("div", { className: "rounded-2xl bg-orange-600/10 px-4 py-3", children: [_jsxs("div", { className: "flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-orange-700 dark:text-orange-300", children: [_jsx(Target, { className: "h-3.5 w-3.5" }), "Aujourd\u2019hui"] }), _jsxs("p", { className: "mt-2 text-2xl font-bold tabular-nums", children: [todayMin, _jsxs("span", { className: "text-sm font-medium text-[var(--color-bara-muted)]", children: [" ", "/ ", DAILY_STUDY_GOAL_MIN, " min"] })] }), _jsx("div", { className: "mt-2 h-1.5 overflow-hidden rounded-full bg-black/10 dark:bg-white/10", children: _jsx("div", { className: "bara-progress-fill h-full rounded-full bg-orange-600", style: { width: `${dailyPct}%` } }) })] }), _jsxs("div", { className: "rounded-2xl bg-black/[0.03] px-4 py-3 dark:bg-white/[0.05]", children: [_jsxs("div", { className: "flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-[var(--color-bara-muted)]", children: [_jsx(Flame, { className: "h-3.5 w-3.5 text-orange-600" }), "S\u00E9rie"] }), _jsxs("p", { className: "mt-2 text-2xl font-bold tabular-nums", children: [streak, _jsxs("span", { className: "text-sm font-medium text-[var(--color-bara-muted)]", children: [" ", "jour", streak > 1 ? "s" : ""] })] }), _jsx("p", { className: "mt-2 text-xs text-[var(--color-bara-muted)]", children: streak > 0
                                                    ? "Continue pour garder le rythme."
                                                    : "Une session Focus démarre ta série." })] })] })] })] }), !onboardingDone && (_jsxs("section", { className: "bara-enter-delay-1 rounded-2xl border border-orange-600/25 bg-orange-500/[0.08] p-4 sm:p-5", children: [_jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", children: [_jsxs("div", { children: [_jsxs("h2", { className: "flex items-center gap-2 font-semibold", children: [_jsx(Sparkles, { className: "h-4 w-4 text-orange-600" }), "Premiers pas"] }), _jsx("p", { className: "mt-1 text-sm text-[var(--color-bara-muted)]", children: "Quatre gestes pour activer tout le potentiel de BARA." })] }), _jsx("button", { type: "button", onClick: closeOnboarding, className: "rounded-lg border border-[var(--color-bara-border)] px-3 py-2 text-sm hover:bg-black/5", children: "Masquer" })] }), _jsx("div", { className: "mt-3 grid gap-2 sm:grid-cols-2", children: onboardingSteps.map((step) => (_jsxs(Link, { to: step.to, className: "flex items-center justify-between gap-3 rounded-xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] px-3 py-2.5 text-sm transition hover:border-orange-500/40 hover:bg-orange-500/[0.04]", children: [_jsx("span", { children: step.label }), _jsx("span", { className: step.done
                                        ? "text-xs font-medium text-green-700 dark:text-green-400"
                                        : "text-xs text-[var(--color-bara-muted)]", children: step.done ? "Fait" : "À faire" })] }, step.label))) })] })), _jsxs("div", { className: "bara-enter-delay-1 grid gap-3 sm:grid-cols-3", children: [_jsx(MiniStat, { icon: Clock, label: "Temps total", value: `${Math.floor(studiedMin / 60)}h ${studiedMin % 60}m` }), _jsx(MiniStat, { icon: CheckCircle2, label: "Progression", value: `${progressPct}%` }), _jsx(MiniStat, { icon: AlertTriangle, label: "En retard", value: String(overdue.length), tone: overdue.length > 0 ? "warn" : "ok" })] }), _jsxs("div", { className: "bara-enter-delay-2 grid gap-4 xl:grid-cols-3", children: [_jsxs("section", { className: "rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-6 xl:col-span-2", children: [_jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", children: [_jsxs("div", { children: [_jsx("h2", { className: "font-semibold", children: "Alertes & rappels" }), _jsx("p", { className: "mt-1 text-sm text-[var(--color-bara-muted)]", children: "Ce qui demande ton attention aujourd\u2019hui." })] }), _jsx("button", { type: "button", onClick: () => sendMailMut.mutate(), disabled: sendMailMut.isPending || !uid, className: "rounded-lg bg-orange-600 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-60", children: sendMailMut.isPending ? "Envoi..." : "Recevoir par mail" })] }), sendMailMut.isSuccess && (_jsx("p", { className: "mt-3 rounded-lg bg-green-500/10 px-3 py-2 text-sm text-green-700", children: "R\u00E9capitulatif envoy\u00E9 par mail." })), sendMailMut.isError && (_jsx("p", { className: "mt-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-700", children: sendMailMut.error?.message ??
                                    "Échec de l’envoi email. Vérifie la configuration de la fonction." })), overdue.length === 0 && soon.length === 0 ? (_jsx("div", { className: "mt-4", children: _jsx(EmptyState, { icon: CheckCircle2, title: "Rien d\u2019urgent", description: "Belle avance. Lance un Focus pour consolider, ou planifie la suite.", actionLabel: "Ouvrir le Focus", actionTo: "/app/focus" }) })) : (_jsxs("ul", { className: "mt-4 space-y-2", children: [overdue.map((t) => (_jsx("li", { children: _jsxs(Link, { to: "/app/taches", className: "flex items-center gap-2 rounded-xl bg-red-500/10 px-3 py-2.5 text-sm transition hover:bg-red-500/15", children: [_jsx(AlertTriangle, { className: "h-4 w-4 shrink-0 text-red-600 dark:text-red-400" }), _jsxs("span", { children: [_jsx("strong", { children: t.title }), ", en retard (", format(parseISO(t.deadline), "d MMM yyyy", { locale: fr }), ")"] })] }) }, t.id))), soon.map((t) => (_jsx("li", { children: _jsxs(Link, { to: "/app/taches", className: "flex items-center gap-2 rounded-xl bg-amber-500/10 px-3 py-2.5 text-sm transition hover:bg-amber-500/15", children: [_jsx(Clock, { className: "h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" }), _jsxs("span", { children: [_jsx("strong", { children: t.title }), ", bient\u00F4t (", format(parseISO(t.deadline), "d MMM", { locale: fr }), ")"] })] }) }, t.id)))] }))] }), _jsxs("section", { className: "rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-6", children: [_jsx("h2", { className: "font-semibold", children: "\u00C0 faire ensuite" }), upcoming.length === 0 ? (_jsx("div", { className: "mt-4", children: _jsx(EmptyState, { icon: Target, title: "File d\u2019attente vide", description: "Ajoute une \u00E9ch\u00E9ance pour que BARA te guide au quotidien.", actionLabel: "Ajouter une t\u00E2che", actionTo: "/app/taches" }) })) : (_jsx("ul", { className: "mt-4 space-y-3", children: upcoming.map((t) => (_jsx("li", { children: _jsxs(Link, { to: "/app/focus", className: "block rounded-xl border border-[var(--color-bara-border)] px-3 py-2.5 text-sm transition hover:border-orange-500/35", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "h-2 w-2 rounded-full", style: { background: t.subjects?.color ?? "#888" } }), _jsx("strong", { className: "truncate", children: t.title })] }), _jsxs("p", { className: "mt-1 text-xs text-[var(--color-bara-muted)]", children: ["\u00C9ch\u00E9ance :", " ", format(parseISO(t.deadline), "d MMM yyyy", { locale: fr }), " · ", "lancer un Focus"] })] }) }, t.id))) }))] })] })] }));
}
function MiniStat({ icon: Icon, label, value, tone = "neutral", }) {
    const toneClass = tone === "warn"
        ? "text-red-600 dark:text-red-400"
        : tone === "ok"
            ? "text-green-700 dark:text-green-400"
            : "";
    return (_jsxs("div", { className: "rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] px-4 py-3", children: [_jsxs("div", { className: "flex items-center gap-2 text-[var(--color-bara-muted)]", children: [_jsx(Icon, { className: "h-4 w-4" }), _jsx("span", { className: "text-xs font-medium uppercase tracking-wide", children: label })] }), _jsx("p", { className: `mt-1.5 text-xl font-bold tabular-nums ${toneClass}`, children: value })] }));
}
