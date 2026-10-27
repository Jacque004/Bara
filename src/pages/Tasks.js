import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, isBefore, parseISO, startOfDay } from "date-fns";
import { fr } from "date-fns/locale";
import { useMemo, useState } from "react";
import { CheckSquare, Plus, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { createTask, deleteTask, fetchSubjects, fetchTasks, updateTask, } from "@/lib/api";
const types = [
    { v: "homework", l: "Devoir" },
    { v: "revision", l: "Révision" },
    { v: "exam", l: "Examen" },
];
const statuses = [
    { v: "todo", l: "À faire" },
    { v: "doing", l: "En cours" },
    { v: "done", l: "Terminé" },
];
const filters = [
    { id: "all", label: "Toutes" },
    { id: "todo", label: "À faire" },
    { id: "doing", label: "En cours" },
    { id: "done", label: "Terminées" },
];
function isLate(task) {
    if (task.status === "done")
        return false;
    return isBefore(parseISO(task.deadline), startOfDay(new Date()));
}
export function Tasks() {
    const { user } = useAuth();
    const qc = useQueryClient();
    const uid = user?.id;
    const { data: subjects = [] } = useQuery({
        queryKey: ["subjects", uid],
        queryFn: () => fetchSubjects(uid),
        enabled: !!uid,
    });
    const { data: tasks = [], isLoading } = useQuery({
        queryKey: ["tasks", uid],
        queryFn: () => fetchTasks(uid),
        enabled: !!uid,
    });
    const [filter, setFilter] = useState("all");
    const [formPref, setFormPref] = useState(null);
    const [subjectId, setSubjectId] = useState("");
    const [title, setTitle] = useState("");
    const [type, setType] = useState("homework");
    const [deadline, setDeadline] = useState(() => new Date().toISOString().slice(0, 10));
    const [hours, setHours] = useState(1);
    const [difficulty, setDifficulty] = useState(3);
    const createMut = useMutation({
        mutationFn: () => createTask(uid, {
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
        mutationFn: ({ id, patch, }) => updateTask(id, patch),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks", uid] }),
    });
    const delMut = useMutation({
        mutationFn: deleteTask,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["tasks", uid] }),
    });
    const firstSubject = subjects[0]?.id ?? "";
    const sid = subjectId || firstSubject;
    const rows = tasks;
    const showForm = formPref ?? (!isLoading && rows.length === 0);
    const visible = useMemo(() => {
        return rows
            .filter((task) => filter === "all" || task.status === filter)
            .sort((a, b) => {
            const late = Number(isLate(b)) - Number(isLate(a));
            if (late !== 0)
                return late;
            return a.deadline.localeCompare(b.deadline);
        });
    }, [rows, filter]);
    return (_jsxs("div", { className: "space-y-8 bara-enter", children: [_jsxs("div", { className: "flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "T\u00E2ches" }), _jsx("p", { className: "mt-1 text-[var(--color-bara-muted)]", children: "Filtre tes \u00E9ch\u00E9ances, puis encha\u00EEne en Focus." })] }), _jsxs("button", { type: "button", onClick: () => setFormPref(!showForm), className: "bara-cta bara-touch inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-500", children: [_jsx(Plus, { className: "h-4 w-4" }), showForm ? "Masquer le formulaire" : "Nouvelle tâche"] })] }), showForm && (_jsxs("form", { className: "grid gap-3 rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-4 md:grid-cols-2", onSubmit: (e) => {
                    e.preventDefault();
                    if (!sid || !title.trim())
                        return;
                    setSubjectId(sid);
                    createMut.mutate();
                }, children: [_jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "text-sm font-medium", children: "Titre" }), _jsx("input", { required: true, value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Ex. R\u00E9viser le chapitre 3", className: "bara-field mt-1 w-full" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: "Mati\u00E8re" }), _jsx("select", { value: sid, onChange: (e) => setSubjectId(e.target.value), className: "bara-field mt-1 w-full bg-[var(--color-bara-surface)]", children: subjects.length === 0 ? (_jsx("option", { value: "", children: "Cr\u00E9ez une mati\u00E8re d\u2019abord" })) : (subjects.map((s) => (_jsx("option", { value: s.id, children: s.name }, s.id)))) })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: "Type" }), _jsx("select", { value: type, onChange: (e) => setType(e.target.value), className: "bara-field mt-1 w-full bg-[var(--color-bara-surface)]", children: types.map((t) => (_jsx("option", { value: t.v, children: t.l }, t.v))) })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: "\u00C9ch\u00E9ance" }), _jsx("input", { type: "date", required: true, value: deadline, onChange: (e) => setDeadline(e.target.value), className: "bara-field mt-1 w-full" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: "Temps estim\u00E9 (h)" }), _jsx("input", { type: "number", min: 0, value: hours, onChange: (e) => setHours(Number(e.target.value)), className: "bara-field mt-1 w-full" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: "Difficult\u00E9 (1\u20135)" }), _jsx("input", { type: "range", min: 1, max: 5, value: difficulty, onChange: (e) => setDifficulty(Number(e.target.value)), className: "mt-3 w-full" }), _jsx("p", { className: "text-xs text-[var(--color-bara-muted)]", children: difficulty })] }), _jsxs("div", { className: "md:col-span-2 space-y-2", children: [subjects.length === 0 && (_jsx("p", { className: "text-sm text-[var(--color-bara-muted)]", children: "Cr\u00E9e d\u2019abord une mati\u00E8re pour pouvoir ajouter une t\u00E2che." })), createMut.isError && (_jsx("p", { className: "text-sm text-red-600", role: "alert", children: "Impossible d\u2019enregistrer la t\u00E2che. R\u00E9essaie dans un instant." })), _jsx("button", { type: "submit", disabled: !sid || createMut.isPending, className: "rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-60", children: createMut.isPending ? "Enregistrement…" : "Créer la tâche" })] })] })), rows.length > 0 && (_jsx("div", { className: "flex gap-2 overflow-x-auto scrollbar-none", role: "tablist", "aria-label": "Filtrer les t\u00E2ches", children: filters.map((item) => {
                    const count = item.id === "all"
                        ? rows.length
                        : rows.filter((task) => task.status === item.id).length;
                    const active = filter === item.id;
                    return (_jsxs("button", { type: "button", role: "tab", "aria-selected": active, onClick: () => setFilter(item.id), className: [
                            "bara-touch shrink-0 rounded-full px-3 text-sm font-medium transition",
                            active
                                ? "bg-orange-600 text-white"
                                : "border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] text-[var(--color-bara-muted)]",
                        ].join(" "), children: [item.label, _jsx("span", { className: "ml-1.5 tabular-nums opacity-80", children: count })] }, item.id));
                }) })), isLoading ? (_jsxs("div", { className: "space-y-3", "aria-hidden": true, children: [_jsx("div", { className: "h-24 animate-pulse rounded-2xl bg-black/5 dark:bg-white/5" }), _jsx("div", { className: "h-24 animate-pulse rounded-2xl bg-black/5 dark:bg-white/5" })] })) : rows.length === 0 ? (_jsx(EmptyState, { icon: CheckSquare, title: "Pas encore de t\u00E2ches", description: subjects.length === 0
                    ? "Créez d’abord une matière, puis ajoutez votre première échéance."
                    : "Ajoutez une tâche ci-dessus pour alimenter le planning et le Focus.", actionLabel: subjects.length === 0 ? "Créer une matière" : undefined, actionTo: subjects.length === 0 ? "/app/matieres" : undefined })) : visible.length === 0 ? (_jsx("p", { className: "rounded-2xl border border-dashed border-[var(--color-bara-border)] px-4 py-8 text-center text-sm text-[var(--color-bara-muted)]", children: "Aucune t\u00E2che dans ce filtre." })) : (_jsxs(_Fragment, { children: [_jsx("ul", { className: "space-y-3 md:hidden", children: visible.map((t) => (_jsxs("li", { className: [
                                "rounded-2xl border bg-[var(--color-bara-surface)] p-4",
                                isLate(t)
                                    ? "border-red-500/40"
                                    : "border-[var(--color-bara-border)]",
                            ].join(" "), children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "font-semibold leading-snug", children: t.title }), _jsxs("p", { className: "mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[var(--color-bara-muted)]", children: [_jsx("span", { className: "h-2 w-2 shrink-0 rounded-full", style: { background: t.subjects?.color ?? "#888" } }), _jsx("span", { className: "truncate", children: t.subjects?.name ?? "Non renseign\u00E9" }), _jsx("span", { children: "\u00B7" }), _jsx("span", { children: types.find((item) => item.v === t.type)?.l ?? t.type }), _jsx("span", { children: "\u00B7" }), _jsxs("span", { className: isLate(t) ? "font-medium text-red-600 dark:text-red-400" : "", children: [isLate(t) ? "En retard · " : "", format(parseISO(t.deadline), "d MMM yyyy", { locale: fr })] })] })] }), _jsx("button", { type: "button", onClick: () => {
                                                if (confirm("Supprimer cette tâche ?"))
                                                    delMut.mutate(t.id);
                                            }, className: "bara-touch shrink-0 rounded-lg p-2 text-red-600 hover:bg-red-500/10", "aria-label": "Supprimer", children: _jsx(Trash2, { className: "h-4 w-4" }) })] }), _jsx("label", { className: "mt-3 block text-xs font-medium text-[var(--color-bara-muted)]", children: "Statut" }), _jsx("select", { value: t.status, onChange: (e) => patchMut.mutate({
                                        id: t.id,
                                        patch: { status: e.target.value },
                                    }), className: "mt-1 w-full rounded-xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] px-3 py-2.5 text-sm", children: statuses.map((s) => (_jsx("option", { value: s.v, children: s.l }, s.v))) })] }, t.id))) }), _jsx("div", { className: "hidden overflow-x-auto rounded-2xl border border-[var(--color-bara-border)] md:block", children: _jsxs("table", { className: "w-full min-w-[640px] text-left text-sm", children: [_jsx("thead", { className: "border-b border-[var(--color-bara-border)] bg-black/[0.02] dark:bg-white/[0.03]", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 font-medium", children: "T\u00E2che" }), _jsx("th", { className: "px-4 py-3 font-medium", children: "Mati\u00E8re" }), _jsx("th", { className: "px-4 py-3 font-medium", children: "\u00C9ch\u00E9ance" }), _jsx("th", { className: "px-4 py-3 font-medium", children: "Statut" }), _jsx("th", { className: "w-10 px-4 py-3" })] }) }), _jsx("tbody", { children: visible.map((t) => (_jsxs("tr", { className: "border-b border-[var(--color-bara-border)] transition last:border-0 hover:bg-orange-500/[0.03]", children: [_jsxs("td", { className: "px-4 py-3 font-medium", children: [_jsx("span", { children: t.title }), _jsx("span", { className: "mt-0.5 block text-xs font-normal text-[var(--color-bara-muted)]", children: types.find((item) => item.v === t.type)?.l ?? t.type })] }), _jsx("td", { className: "px-4 py-3", children: _jsxs("span", { className: "inline-flex items-center gap-2", children: [_jsx("span", { className: "h-2 w-2 rounded-full", style: { background: t.subjects?.color ?? "#888" } }), t.subjects?.name ?? "Non renseign\u00E9"] }) }), _jsx("td", { className: "px-4 py-3 text-[var(--color-bara-muted)]", children: _jsxs("span", { className: isLate(t) ? "font-medium text-red-600 dark:text-red-400" : "", children: [isLate(t) ? "En retard · " : "", format(parseISO(t.deadline), "d MMM yyyy", { locale: fr })] }) }), _jsx("td", { className: "px-4 py-3", children: _jsx("select", { value: t.status, onChange: (e) => patchMut.mutate({
                                                        id: t.id,
                                                        patch: { status: e.target.value },
                                                    }), className: "rounded border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] px-2 py-1 text-xs", children: statuses.map((s) => (_jsx("option", { value: s.v, children: s.l }, s.v))) }) }), _jsx("td", { className: "px-4 py-3", children: _jsx("button", { type: "button", onClick: () => {
                                                        if (confirm("Supprimer cette tâche ?"))
                                                            delMut.mutate(t.id);
                                                    }, className: "rounded-lg p-2 text-red-600 hover:bg-red-500/10", "aria-label": `Supprimer ${t.title}`, children: _jsx(Trash2, { className: "h-4 w-4" }) }) })] }, t.id))) })] }) })] }))] }));
}
