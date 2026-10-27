import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { CalendarDays, Loader2, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { EmptyState } from "@/components/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { fetchStudyPlans, invokeGenerateStudyPlan } from "@/lib/api";
function taskTitle(t) {
    if (!t)
        return null;
    return Array.isArray(t) ? t[0] ?? null : t;
}
const SETTINGS_KEY = "bara-planning-settings";
function defaultSettings() {
    return {
        session_minutes: 25,
        daily_minutes_limit: 120,
        start_date: new Date().toISOString().slice(0, 10),
    };
}
function normalizeStep5Min(value, min = 25) {
    const safe = Number.isFinite(value) ? value : min;
    return Math.max(min, Math.round(safe / 5) * 5);
}
export function Planning() {
    const { user } = useAuth();
    const qc = useQueryClient();
    const uid = user?.id;
    const [settings, setSettings] = useState(defaultSettings);
    useEffect(() => {
        const raw = localStorage.getItem(SETTINGS_KEY);
        if (!raw)
            return;
        try {
            const parsed = JSON.parse(raw);
            setSettings((prev) => ({
                session_minutes: typeof parsed.session_minutes === "number" ? parsed.session_minutes : prev.session_minutes,
                daily_minutes_limit: typeof parsed.daily_minutes_limit === "number"
                    ? parsed.daily_minutes_limit
                    : prev.daily_minutes_limit,
                start_date: typeof parsed.start_date === "string" ? parsed.start_date : prev.start_date,
            }));
        }
        catch {
            setSettings(defaultSettings());
        }
    }, []);
    useEffect(() => {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }, [settings]);
    const { data: plans = [], isLoading } = useQuery({
        queryKey: ["plans", uid],
        queryFn: () => fetchStudyPlans(uid),
        enabled: !!uid,
    });
    const genMut = useMutation({
        mutationFn: () => invokeGenerateStudyPlan(uid, settings),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["plans", uid] }),
    });
    const rows = plans;
    const byDate = rows.reduce((acc, p) => {
        const k = p.planned_date;
        if (!acc[k])
            acc[k] = [];
        acc[k].push(p);
        return acc;
    }, {});
    const dates = Object.keys(byDate).sort();
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Planning intelligent" }), _jsx("p", { className: "mt-1 max-w-xl text-[var(--color-bara-muted)]", children: "BARA r\u00E9partit tes t\u00E2ches ouvertes en cr\u00E9neaux, en commen\u00E7ant par ce qui est urgent ou difficile." })] }), _jsxs("button", { type: "button", onClick: () => genMut.mutate(), disabled: genMut.isPending, className: "inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-60", children: [genMut.isPending ? (_jsx(Loader2, { className: "h-4 w-4 animate-spin" })) : (_jsx(Sparkles, { className: "h-4 w-4" })), "G\u00E9n\u00E9rer le planning"] })] }), _jsxs("section", { className: "rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-4 sm:p-5", children: [_jsx("h2", { className: "font-semibold", children: "Param\u00E8tres du planning" }), _jsx("p", { className: "mt-1 text-sm text-[var(--color-bara-muted)]", children: "Ces param\u00E8tres pilotent la g\u00E9n\u00E9ration automatique et sont sauvegard\u00E9s sur cet appareil." }), _jsxs("div", { className: "mt-4 grid gap-3 md:grid-cols-3", children: [_jsxs("label", { className: "text-sm", children: [_jsx("span", { className: "mb-1 block text-[var(--color-bara-muted)]", children: "Dur\u00E9e d\u2019une session (min)" }), _jsx("input", { type: "number", min: 25, step: 5, value: settings.session_minutes, onChange: (e) => setSettings((s) => ({
                                            ...s,
                                            session_minutes: normalizeStep5Min(Number(e.target.value), 25),
                                        })), className: "w-full rounded-lg border border-[var(--color-bara-border)] bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500/30" })] }), _jsxs("label", { className: "text-sm", children: [_jsx("span", { className: "mb-1 block text-[var(--color-bara-muted)]", children: "Temps max par jour (min)" }), _jsx("input", { type: "number", min: 25, step: 5, value: settings.daily_minutes_limit, onChange: (e) => setSettings((s) => ({
                                            ...s,
                                            daily_minutes_limit: normalizeStep5Min(Number(e.target.value), 25),
                                        })), className: "w-full rounded-lg border border-[var(--color-bara-border)] bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500/30" })] }), _jsxs("label", { className: "text-sm", children: [_jsx("span", { className: "mb-1 block text-[var(--color-bara-muted)]", children: "Date de d\u00E9marrage" }), _jsx("input", { type: "date", value: settings.start_date, onChange: (e) => setSettings((s) => ({
                                            ...s,
                                            start_date: e.target.value || s.start_date,
                                        })), className: "w-full rounded-lg border border-[var(--color-bara-border)] bg-transparent px-3 py-2 outline-none focus:ring-2 focus:ring-orange-500/30" })] })] })] }), genMut.isError && (_jsxs("div", { className: "rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-3 text-sm text-red-700", children: [_jsx("p", { className: "font-medium", children: "La g\u00E9n\u00E9ration du planning a \u00E9chou\u00E9." }), _jsx("p", { className: "mt-1", children: genMut.error?.message ??
                            "Réessaie dans un instant. Si le problème continue, vérifie ta connexion." })] })), genMut.isSuccess &&
                typeof genMut.data === "object" &&
                genMut.data &&
                "inserted" in genMut.data && (_jsxs("p", { className: "text-sm text-green-700 dark:text-green-400", children: [Number(genMut.data.inserted), " cr\u00E9neaux planifi\u00E9s."] })), isLoading ? (_jsx("div", { className: "h-36 animate-pulse rounded-2xl bg-black/5 dark:bg-white/5", "aria-hidden": true })) : dates.length === 0 ? (_jsx(EmptyState, { icon: CalendarDays, title: "Aucun cr\u00E9neau pour l\u2019instant", description: "Ajoute des t\u00E2ches encore ouvertes, puis g\u00E9n\u00E8re un planning pour voir ta semaine.", actionLabel: "Ajouter une t\u00E2che", actionTo: "/app/taches" })) : (_jsx("div", { className: "space-y-6", children: dates.map((d) => (_jsxs("section", { className: "rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-4", children: [_jsx("h2", { className: "font-semibold", children: format(parseISO(d), "EEEE d MMMM", { locale: fr }) }), _jsx("ul", { className: "mt-3 space-y-2", children: byDate[d].map((p) => (_jsxs("li", { className: "flex flex-wrap items-center justify-between gap-2 rounded-lg bg-black/[0.03] px-3 py-2 text-sm dark:bg-white/[0.05]", children: [_jsx("span", { children: taskTitle(p.tasks)?.title ?? "Tâche" }), _jsxs("span", { className: "text-[var(--color-bara-muted)]", children: [p.duration_minutes, " min", p.priority_score >= 8 ? " · prioritaire" : ""] })] }, p.id))) })] }, d))) }))] }));
}
