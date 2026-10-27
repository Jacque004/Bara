import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, BookOpen, Mail, ShieldCheck, Timer, UserCircle2, } from "lucide-react";
import { PasswordField } from "@/components/PasswordField";
import { useAuth } from "@/hooks/useAuth";
import { friendlyAuthError } from "@/lib/authErrors";
import { getPasswordStrength } from "@/lib/passwordStrength";
import { fetchProfile, fetchStudySessions, fetchTasks, upsertProfile } from "@/lib/api";
export function Profile() {
    const { user, updatePassword } = useAuth();
    const qc = useQueryClient();
    const uid = user?.id;
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [pwdErr, setPwdErr] = useState(null);
    const [pwdOk, setPwdOk] = useState(false);
    const [pwdPending, setPwdPending] = useState(false);
    const strength = useMemo(() => getPasswordStrength(password), [password]);
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
    const { data: profile } = useQuery({
        queryKey: ["profile", uid],
        queryFn: () => fetchProfile(uid),
        enabled: !!uid,
    });
    useEffect(() => {
        setFirstName(profile?.first_name ?? "");
        setLastName(profile?.last_name ?? "");
        setAvatarUrl(profile?.avatar_url ?? "");
    }, [profile]);
    const saveMutation = useMutation({
        mutationFn: () => upsertProfile({
            user_id: uid,
            first_name: firstName.trim() || null,
            last_name: lastName.trim() || null,
            avatar_url: avatarUrl.trim() || null,
        }),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["profile", uid] });
        },
    });
    async function onChangePassword(e) {
        e.preventDefault();
        setPwdErr(null);
        setPwdOk(false);
        if (password.length < 6) {
            setPwdErr("Le mot de passe doit contenir au moins 6 caractères.");
            return;
        }
        if (strength.label !== "Fort") {
            setPwdErr("Choisissez un mot de passe plus robuste (8+ caractères, majuscule, minuscule, chiffre et caractère spécial).");
            return;
        }
        if (password !== confirmPassword) {
            setPwdErr("Les mots de passe ne correspondent pas.");
            return;
        }
        setPwdPending(true);
        const { error } = await updatePassword(password);
        setPwdPending(false);
        if (error) {
            setPwdErr(friendlyAuthError(error));
            return;
        }
        setPassword("");
        setConfirmPassword("");
        setPwdOk(true);
    }
    const doneTasks = tasks.filter((t) => t.status === "done").length;
    const totalTasks = tasks.length;
    const studiedMin = sessions.reduce((acc, s) => acc + s.duration_minutes, 0);
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Profil" }), _jsx("p", { className: "mt-1 text-[var(--color-bara-muted)]", children: "Informations de votre compte et aper\u00E7u de votre activit\u00E9." })] }), _jsxs("section", { className: "rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-6", children: [_jsxs("div", { className: "flex items-start gap-4", children: [_jsx("div", { className: "rounded-xl bg-orange-600/15 p-3 text-orange-600 dark:text-orange-400", children: _jsx(UserCircle2, { className: "h-8 w-8" }) }), _jsxs("div", { className: "min-w-0", children: [_jsx("h2", { className: "text-lg font-semibold", children: "Compte \u00E9tudiant" }), _jsx("p", { className: "mt-1 truncate text-sm text-[var(--color-bara-muted)]", children: user?.email ?? "Non renseign\u00E9" })] })] }), _jsxs("div", { className: "mt-5 grid grid-cols-3 gap-2 md:hidden", children: [_jsxs(Link, { to: "/app/matieres", className: "bara-touch flex flex-col items-center gap-1 rounded-xl border border-[var(--color-bara-border)] px-2 py-3 text-center text-xs font-medium", children: [_jsx(BookOpen, { className: "h-4 w-4 text-orange-600" }), "Mati\u00E8res"] }), _jsxs(Link, { to: "/app/analytics", className: "bara-touch flex flex-col items-center gap-1 rounded-xl border border-[var(--color-bara-border)] px-2 py-3 text-center text-xs font-medium", children: [_jsx(BarChart3, { className: "h-4 w-4 text-orange-600" }), "Analytics"] }), _jsxs(Link, { to: "/apropos", className: "bara-touch flex flex-col items-center gap-1 rounded-xl border border-[var(--color-bara-border)] px-2 py-3 text-center text-xs font-medium", children: [_jsx(ShieldCheck, { className: "h-4 w-4 text-orange-600" }), "\u00C0 propos"] })] }), _jsxs("div", { className: "mt-6 grid gap-3 sm:grid-cols-2", children: [_jsx(InfoRow, { icon: Mail, label: "E-mail", value: user?.email ?? "Non renseign\u00E9" }), _jsx(InfoRow, { icon: ShieldCheck, label: "Cr\u00E9\u00E9 le", value: user?.created_at
                                    ? format(parseISO(user.created_at), "d MMMM yyyy", { locale: fr })
                                    : "Non renseign\u00E9" }), _jsx(InfoRow, { icon: Timer, label: "Temps \u00E9tudi\u00E9", value: `${Math.floor(studiedMin / 60)}h ${studiedMin % 60}min` }), _jsx(InfoRow, { icon: ShieldCheck, label: "T\u00E2ches termin\u00E9es", value: `${doneTasks} / ${totalTasks}` })] })] }), _jsxs("section", { className: "rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-6", children: [_jsx("h2", { className: "font-semibold", children: "Informations personnelles" }), _jsx("p", { className: "mt-2 text-sm text-[var(--color-bara-muted)]", children: "Modifiez les informations visibles dans votre espace." }), _jsxs("div", { className: "mt-4 grid gap-3 sm:grid-cols-2", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: "Pr\u00E9nom" }), _jsx("input", { value: firstName, onChange: (e) => setFirstName(e.target.value), placeholder: "Ex. Jacques", className: "mt-1 w-full rounded-lg border border-[var(--color-bara-border)] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-sm font-medium", children: "Nom" }), _jsx("input", { value: lastName, onChange: (e) => setLastName(e.target.value), placeholder: "Ex. Loemba", className: "mt-1 w-full rounded-lg border border-[var(--color-bara-border)] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500" })] })] }), _jsxs("div", { className: "mt-3", children: [_jsx("label", { className: "text-sm font-medium", children: "Avatar URL (optionnel)" }), _jsx("input", { value: avatarUrl, onChange: (e) => setAvatarUrl(e.target.value), placeholder: "https://...", className: "mt-1 w-full rounded-lg border border-[var(--color-bara-border)] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500" })] }), saveMutation.isError && (_jsx("p", { className: "mt-3 text-sm text-red-600", children: saveMutation.error?.message ?? "Erreur lors de la sauvegarde." })), saveMutation.isSuccess && (_jsx("p", { className: "mt-3 text-sm text-green-600 dark:text-green-400", children: "Profil mis \u00E0 jour." })), _jsx("button", { type: "button", disabled: !uid || saveMutation.isPending, onClick: () => saveMutation.mutate(), className: "mt-4 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-60", children: saveMutation.isPending ? "Sauvegarde..." : "Enregistrer le profil" })] }), _jsxs("section", { className: "rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-6", children: [_jsx("h2", { className: "font-semibold", children: "S\u00E9curit\u00E9" }), _jsx("p", { className: "mt-2 text-sm text-[var(--color-bara-muted)]", children: "Changez votre mot de passe ici \u2014 aucun e-mail n\u2019est envoy\u00E9." }), _jsxs("form", { onSubmit: onChangePassword, className: "mt-4 space-y-3", children: [_jsx(PasswordField, { label: "Nouveau mot de passe", required: true, minLength: 8, autoComplete: "new-password", value: password, onChange: (e) => setPassword(e.target.value) }), password.length > 0 && (_jsxs("div", { children: [_jsx("div", { className: "h-2 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10", children: _jsx("div", { className: `h-2 rounded-full transition-all ${strength.color}`, style: { width: strength.width } }) }), _jsxs("p", { className: "mt-1 text-xs text-[var(--color-bara-muted)]", children: ["Force : ", strength.label] })] })), _jsx(PasswordField, { label: "Confirmer", required: true, minLength: 8, autoComplete: "new-password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value) }), pwdErr && _jsx("p", { className: "text-sm text-red-600", children: pwdErr }), pwdOk && (_jsx("p", { className: "text-sm text-green-600 dark:text-green-400", children: "Mot de passe mis \u00E0 jour." })), _jsx("button", { type: "submit", disabled: pwdPending || strength.label !== "Fort", className: "rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-60", children: pwdPending ? "Mise à jour…" : "Changer le mot de passe" })] })] })] }));
}
function InfoRow({ icon: Icon, label, value, }) {
    return (_jsxs("div", { className: "rounded-xl border border-[var(--color-bara-border)] bg-black/[0.02] p-3 dark:bg-white/[0.03]", children: [_jsxs("div", { className: "flex items-center gap-2 text-xs text-[var(--color-bara-muted)]", children: [_jsx(Icon, { className: "h-3.5 w-3.5" }), _jsx("span", { className: "uppercase tracking-wide", children: label })] }), _jsx("p", { className: "mt-1 break-all text-sm font-medium", children: value })] }));
}
