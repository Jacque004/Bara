import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthShell } from "@/components/AuthShell";
import { useAuth } from "@/hooks/useAuth";
import { friendlyAuthError } from "@/lib/authErrors";
/**
 * Accès sans e-mail de reset (évite les limites SMTP Supabase).
 * → Google, ou connexion puis changement dans Profil.
 */
export function ForgotPassword() {
    const { signInWithGoogle } = useAuth();
    const [err, setErr] = useState(null);
    const [pending, setPending] = useState(false);
    async function onGoogle() {
        setErr(null);
        setPending(true);
        const { error } = await signInWithGoogle();
        setPending(false);
        if (error)
            setErr(friendlyAuthError(error));
    }
    return (_jsxs(AuthShell, { title: "Acc\u00E8s au compte", subtitle: "Connectez-vous autrement, puis changez le mot de passe dans votre profil.", children: [_jsxs("div", { className: "mt-6 space-y-3", children: [_jsx("button", { type: "button", disabled: pending, onClick: () => void onGoogle(), className: "w-full rounded-lg border border-[var(--color-bara-border)] bg-[var(--color-bara-bg)] py-2.5 text-sm font-semibold hover:bg-black/[0.03] disabled:opacity-60 dark:hover:bg-white/[0.05]", children: pending ? "Redirection…" : "Continuer avec Google" }), _jsx(Link, { to: "/connexion", className: "block w-full rounded-lg bg-orange-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-orange-500", children: "Se connecter avec e-mail" })] }), err && (_jsx("p", { className: "mt-4 text-sm text-red-600", role: "alert", children: err })), _jsxs("ol", { className: "mt-6 list-decimal space-y-2 pl-5 text-sm text-[var(--color-bara-muted)]", children: [_jsx("li", { children: "Connectez-vous (Google ou e-mail si vous vous souvenez du mot de passe)." }), _jsxs("li", { children: ["Allez dans ", _jsx("strong", { children: "Profil" }), " \u2192 section S\u00E9curit\u00E9."] }), _jsx("li", { children: "D\u00E9finissez un nouveau mot de passe (aucun e-mail envoy\u00E9)." })] }), _jsx("p", { className: "mt-4 text-center text-sm", children: _jsx(Link, { to: "/connexion", className: "text-orange-600 hover:underline dark:text-orange-400", children: "Retour \u00E0 la connexion" }) })] }));
}
