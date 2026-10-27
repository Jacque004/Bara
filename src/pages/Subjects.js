import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { BookOpen, Trash2 } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { useAuth } from "@/hooks/useAuth";
import { createSubject, deleteSubject, fetchSubjects, updateSubject, } from "@/lib/api";
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
        queryFn: () => fetchSubjects(uid),
        enabled: !!uid,
    });
    const createMut = useMutation({
        mutationFn: () => createSubject(uid, { name: name.trim(), color }),
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
        mutationFn: ({ id, n }) => updateSubject(id, { name: n }),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["subjects", uid] }),
    });
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Mati\u00E8res" }), _jsx("p", { className: "mt-1 text-[var(--color-bara-muted)]", children: "Organisez vos cours par mati\u00E8re et couleur." })] }), _jsxs("form", { className: "flex flex-col gap-3 rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-4 sm:flex-row sm:items-end", onSubmit: (e) => {
                    e.preventDefault();
                    if (!name.trim())
                        return;
                    createMut.mutate();
                }, children: [_jsxs("div", { className: "min-w-0 flex-1", children: [_jsx("label", { className: "text-sm font-medium", children: "Nouvelle mati\u00E8re" }), _jsx("input", { value: name, onChange: (e) => setName(e.target.value), placeholder: "Ex. Math\u00E9matiques", className: "mt-1 w-full rounded-lg border border-[var(--color-bara-border)] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: "Couleur" }), _jsx("div", { className: "mt-1 flex flex-wrap gap-1", children: PRESETS.map((c) => (_jsx("button", { type: "button", onClick: () => setColor(c), className: `h-8 w-8 rounded-lg border-2 ${color === c ? "border-orange-600" : "border-transparent"}`, style: { background: c }, "aria-label": `Couleur ${c}` }, c))) })] }), _jsx("button", { type: "submit", disabled: createMut.isPending, className: "rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-60", children: "Ajouter" })] }), _jsx("ul", { className: "space-y-2", children: subjects.length === 0 ? (_jsx("li", { children: _jsx(EmptyState, { icon: BookOpen, title: "Aucune mati\u00E8re encore", description: "Cr\u00E9ez votre premi\u00E8re mati\u00E8re ci-dessus \u2014 c\u2019est le point de d\u00E9part de vos t\u00E2ches et du Focus." }) })) : (subjects.map((s) => (_jsxs("li", { className: "flex items-center gap-3 rounded-xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] px-4 py-3 transition hover:border-orange-500/30", children: [_jsx("span", { className: "h-4 w-4 shrink-0 rounded-full", style: { background: s.color } }), _jsx("input", { defaultValue: s.name, onBlur: (e) => {
                                const n = e.target.value.trim();
                                if (n && n !== s.name)
                                    renMut.mutate({ id: s.id, n });
                            }, className: "min-w-0 flex-1 border-none bg-transparent text-sm font-medium outline-none" }), _jsx("button", { type: "button", onClick: () => {
                                if (confirm("Supprimer cette matière et ses tâches liées ?"))
                                    delMut.mutate(s.id);
                            }, className: "rounded-lg p-2 text-red-600 hover:bg-red-500/10 dark:text-red-400", "aria-label": "Supprimer", children: _jsx(Trash2, { className: "h-4 w-4" }) })] }, s.id)))) })] }));
}
