import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { BarChart3 } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { fetchStudySessions, fetchSubjects } from "@/lib/api";
function taskOf(t) {
    if (!t)
        return null;
    return Array.isArray(t) ? t[0] ?? null : t;
}
export function Analytics() {
    const { user } = useAuth();
    const uid = user?.id;
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
    const bySubject = useMemo(() => {
        const map = new Map();
        const subName = new Map(subjects.map((s) => [s.id, s.name]));
        for (const row of sessions) {
            const sid = taskOf(row.tasks)?.subject_id;
            if (!sid)
                continue;
            map.set(sid, (map.get(sid) ?? 0) + row.duration_minutes);
        }
        return [...map.entries()]
            .map(([id, min]) => ({
            id,
            name: subName.get(id) ?? "Non renseign\u00E9",
            min,
        }))
            .sort((a, b) => b.min - a.min);
    }, [sessions, subjects]);
    const totalMin = bySubject.reduce((a, b) => a + b.min, 0);
    const sessionsCount = sessions.length;
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Analytics" }), _jsx("p", { className: "mt-1 text-[var(--color-bara-muted)]", children: "Temps par mati\u00E8re et vue d\u2019ensemble de l\u2019activit\u00E9." })] }), _jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [_jsxs("div", { className: "rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-4", children: [_jsx("p", { className: "text-xs font-medium uppercase text-[var(--color-bara-muted)]", children: "Sessions" }), _jsx("p", { className: "mt-1 text-2xl font-bold", children: sessionsCount })] }), _jsxs("div", { className: "rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-4", children: [_jsx("p", { className: "text-xs font-medium uppercase text-[var(--color-bara-muted)]", children: "Temps total enregistr\u00E9" }), _jsxs("p", { className: "mt-1 text-2xl font-bold", children: [Math.floor(totalMin / 60), "h ", totalMin % 60, "min"] })] })] }), _jsxs("section", { className: "rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-6", children: [_jsx("h2", { className: "font-semibold", children: "Temps par mati\u00E8re" }), bySubject.length === 0 ? (_jsx("div", { className: "mt-4", children: _jsx(EmptyState, { icon: BarChart3, title: "Pas encore de temps enregistr\u00E9", description: "Lance une session Focus sur une t\u00E2che pour voir ici le temps pass\u00E9 par mati\u00E8re.", actionLabel: "Ouvrir le Focus", actionTo: "/app/focus" }) })) : (_jsx("ul", { className: "mt-4 space-y-4", children: bySubject.map((s) => {
                            const pct = totalMin ? Math.round((s.min / totalMin) * 100) : 0;
                            return (_jsxs("li", { children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { children: s.name }), _jsxs("span", { className: "text-[var(--color-bara-muted)]", children: [s.min, " min (", pct, "%)"] })] }), _jsx("div", { className: "mt-1 h-2 overflow-hidden rounded-full bg-black/10 dark:bg-white/10", children: _jsx("div", { className: "bara-progress-fill h-full rounded-full bg-orange-600", style: { width: `${pct}%` } }) })] }, s.id));
                        }) }))] }), _jsxs("section", { className: "rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-6", children: [_jsx("h2", { className: "font-semibold", children: "Efficacit\u00E9 (indicateur simple)" }), _jsxs("p", { className: "mt-2 text-sm text-[var(--color-bara-muted)]", children: ["Moyenne :", " ", sessionsCount > 0 && totalMin > 0
                                ? `${Math.round(totalMin / sessionsCount)} min par session`
                                : "Non renseign\u00E9"] })] })] }));
}
