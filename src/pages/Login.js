import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthShell } from "@/components/AuthShell";
import { PasswordField } from "@/components/PasswordField";
import { useAuth } from "@/hooks/useAuth";
import { friendlyAuthError } from "@/lib/authErrors";
function usePostLoginPath() {
    const location = useLocation();
    return useMemo(() => {
        const from = location.state?.from
            ?.pathname;
        if (from && from.startsWith("/app"))
            return from;
        return "/app";
    }, [location]);
}
export function Login() {
    const { signIn, signInWithGoogle, user } = useAuth();
    const navigate = useNavigate();
    const afterLogin = usePostLoginPath();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState(null);
    const [pending, setPending] = useState(false);
    useEffect(() => {
        if (user)
            navigate(afterLogin, { replace: true });
    }, [user, navigate, afterLogin]);
    async function onSubmit(e) {
        e.preventDefault();
        setErr(null);
        setPending(true);
        const { error } = await signIn(email, password);
        setPending(false);
        if (error)
            setErr(friendlyAuthError(error));
        else
            navigate(afterLogin, { replace: true });
    }
    async function onGoogle() {
        setErr(null);
        setPending(true);
        const { error } = await signInWithGoogle();
        setPending(false);
        if (error)
            setErr(friendlyAuthError(error));
    }
    return (_jsxs(AuthShell, { title: "Connexion", subtitle: "Retrouve tes mati\u00E8res, tes t\u00E2ches et tes sessions Focus.", children: [_jsxs("form", { onSubmit: onSubmit, className: "mt-6 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "login-email", className: "block text-sm font-medium", children: "E-mail" }), _jsx("input", { id: "login-email", type: "email", required: true, autoComplete: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "bara-field mt-1 w-full" })] }), _jsx(PasswordField, { label: "Mot de passe", required: true, autoComplete: "current-password", value: password, onChange: (e) => setPassword(e.target.value) }), err && (_jsx("p", { className: "text-sm text-red-600", role: "alert", children: err })), _jsx("button", { type: "submit", disabled: pending, className: "bara-cta w-full rounded-xl bg-orange-600 py-3 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-60", children: pending ? "Connexion…" : "Se connecter" })] }), _jsxs("div", { className: "my-4 flex items-center gap-3 text-xs text-[var(--color-bara-muted)]", children: [_jsx("span", { className: "h-px flex-1 bg-[var(--color-bara-border)]" }), "ou", _jsx("span", { className: "h-px flex-1 bg-[var(--color-bara-border)]" })] }), _jsx("button", { type: "button", disabled: pending, onClick: () => void onGoogle(), className: "bara-cta w-full rounded-xl border border-[var(--color-bara-border)] py-3 text-sm font-semibold hover:bg-black/[0.03] disabled:opacity-60 dark:hover:bg-white/[0.05]", children: "Continuer avec Google" }), _jsxs("p", { className: "mt-4 text-center text-sm text-[var(--color-bara-muted)]", children: [_jsx(Link, { to: "/mot-de-passe", className: "text-orange-600 hover:underline dark:text-orange-400", children: "Probl\u00E8me de connexion ?" }), " · ", _jsx(Link, { to: "/inscription", className: "text-orange-600 hover:underline dark:text-orange-400", children: "Cr\u00E9er un compte" })] })] }));
}
