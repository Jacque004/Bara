import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, CheckSquare, Pause, Play, RotateCcw } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
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
        queryFn: () => fetchTasks(uid),
        enabled: !!uid,
    });
    const [taskId, setTaskId] = useState("");
    const [phase, setPhase] = useState("work");
    const [left, setLeft] = useState(WORK);
    const [running, setRunning] = useState(false);
    const [justCompleted, setJustCompleted] = useState(false);
    const handledZero = useRef(false);
    const saveMut = useMutation({
        mutationFn: (minutes) => insertStudySession({
            user_id: uid,
            task_id: taskId,
            date: new Date().toISOString().slice(0, 10),
            duration_minutes: minutes,
            completed: true,
        }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["sessions", uid] });
            setJustCompleted(true);
            window.setTimeout(() => setJustCompleted(false), 4200);
        },
    });
    useEffect(() => {
        if (!running)
            return;
        const id = window.setInterval(() => {
            setLeft((s) => (s <= 1 ? 0 : s - 1));
        }, 1000);
        return () => window.clearInterval(id);
    }, [running]);
    useEffect(() => {
        if (left > 0)
            handledZero.current = false;
        if (!running || left !== 0 || handledZero.current)
            return;
        handledZero.current = true;
        setRunning(false);
        if (phase === "work" && taskId) {
            saveMut.mutate(25);
            setPhase("break");
            setLeft(BREAK);
        }
        else {
            setPhase("work");
            setLeft(WORK);
        }
    }, [left, running, phase, taskId, saveMut]);
    const open = tasks.filter((t) => t.status !== "done");
    useEffect(() => {
        if (!taskId && open[0])
            setTaskId(open[0].id);
    }, [open, taskId]);
    const total = phase === "work" ? WORK : BREAK;
    const progress = 1 - left / total;
    const radius = 108;
    const circ = 2 * Math.PI * radius;
    const dashOffset = circ * (1 - progress);
    const mm = Math.floor(Math.max(0, left) / 60);
    const ss = Math.max(0, left) % 60;
    useEffect(() => {
        if (!running) {
            document.title = "Focus · BARA";
            return;
        }
        const label = phase === "work" ? "Focus" : "Pause";
        document.title = `${String(mm).padStart(2, "0")}:${String(ss).padStart(2, "0")} · ${label} · BARA`;
    }, [running, mm, ss, phase]);
    const selectedTitle = useMemo(() => open.find((t) => t.id === taskId)?.title, [open, taskId]);
    return (_jsxs("div", { className: "space-y-8 bara-enter", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Mode Focus" }), _jsx("p", { className: "mt-1 text-[var(--color-bara-muted)]", children: "Une bulle de 25 minutes. Le temps est enregistr\u00E9 automatiquement." })] }), open.length === 0 ? (_jsx(EmptyState, { icon: CheckSquare, title: "Choisis d\u2019abord une t\u00E2che", description: "Le Focus s\u2019attache \u00E0 une t\u00E2che ouverte pour mesurer ta progression.", actionLabel: "Cr\u00E9er une t\u00E2che", actionTo: "/app/taches" })) : (_jsxs("div", { className: [
                    "bara-focus-stage mx-auto max-w-md rounded-3xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-5 text-center sm:p-8",
                    running ? "is-running" : "",
                ].join(" "), children: [justCompleted && (_jsxs("div", { className: "bara-celebrate mb-5 flex items-center justify-center gap-2 rounded-xl bg-green-500/12 px-3 py-2 text-sm font-medium text-green-700 dark:text-green-400", children: [_jsx(CheckCircle2, { className: "h-4 w-4" }), "Session enregistr\u00E9e. Belle avance."] })), _jsx("p", { className: "text-sm font-medium uppercase tracking-widest text-[var(--color-bara-muted)]", children: phase === "work" ? "Travail" : "Pause" }), _jsxs("div", { className: "relative mx-auto mt-4 h-52 w-52 sm:mt-5 sm:h-60 sm:w-60", children: [_jsxs("svg", { className: "h-full w-full -rotate-90", viewBox: "0 0 240 240", "aria-hidden": true, children: [_jsx("circle", { cx: "120", cy: "120", r: radius, fill: "none", stroke: "currentColor", strokeWidth: "10", className: "text-black/10 dark:text-white/10" }), _jsx("circle", { cx: "120", cy: "120", r: radius, fill: "none", stroke: "currentColor", strokeWidth: "10", strokeLinecap: "round", strokeDasharray: circ, strokeDashoffset: dashOffset, className: phase === "work"
                                            ? "text-orange-600 transition-[stroke-dashoffset] duration-1000 linear"
                                            : "text-emerald-500 transition-[stroke-dashoffset] duration-1000 linear", style: {
                                            "--bara-ring-circ": circ,
                                        } })] }), _jsxs("div", { className: "absolute inset-0 flex flex-col items-center justify-center", children: [_jsxs("p", { className: "font-mono text-4xl font-bold tabular-nums tracking-tight sm:text-5xl", children: [String(mm).padStart(2, "0"), ":", String(ss).padStart(2, "0")] }), selectedTitle && (_jsx("p", { className: "mt-2 max-w-[11rem] truncate text-xs text-[var(--color-bara-muted)]", children: selectedTitle }))] })] }), _jsxs("div", { className: "mt-6 text-left", children: [_jsx("label", { className: "text-sm font-medium", children: "T\u00E2che associ\u00E9e" }), _jsx("select", { value: taskId, onChange: (e) => setTaskId(e.target.value), disabled: running, className: "mt-1 w-full rounded-lg border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] px-3 py-3 text-sm disabled:opacity-60 sm:py-2", children: open.map((t) => (_jsx("option", { value: t.id, children: t.title }, t.id))) })] }), _jsxs("div", { className: "mt-6 flex justify-center gap-4", children: [_jsx("button", { type: "button", onClick: () => setRunning((r) => !r), disabled: phase === "work" && !taskId, className: "bara-cta bara-touch inline-flex h-14 w-14 items-center justify-center rounded-full bg-orange-600 text-white transition hover:bg-orange-500 disabled:opacity-50", "aria-label": running ? "Pause" : "Démarrer", children: running ? (_jsx(Pause, { className: "h-6 w-6" })) : (_jsx(Play, { className: "h-6 w-6 pl-0.5" })) }), _jsx("button", { type: "button", onClick: () => {
                                    setRunning(false);
                                    setPhase("work");
                                    setLeft(WORK);
                                    setJustCompleted(false);
                                }, className: "bara-cta bara-touch inline-flex h-14 w-14 items-center justify-center rounded-full border border-[var(--color-bara-border)] transition hover:bg-black/5 dark:hover:bg-white/5", "aria-label": "R\u00E9initialiser", children: _jsx(RotateCcw, { className: "h-5 w-5" }) })] }), _jsx("p", { className: "mt-5 text-xs text-[var(--color-bara-muted)]", children: "Astuce : reste sur cet \u00E9cran. Chaque session alimente ta s\u00E9rie du jour." }), _jsx(Link, { to: "/app", className: "mt-3 inline-block text-xs font-medium text-orange-600 hover:underline dark:text-orange-400", children: "Voir ma progression" })] }))] }));
}
