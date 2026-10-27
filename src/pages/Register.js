import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell } from "@/components/AuthShell";
import { PasswordField } from "@/components/PasswordField";
import { useAuth } from "@/hooks/useAuth";
import { getPasswordStrength } from "@/lib/passwordStrength";
export function Register() {
    const { signUp, user } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState(null);
    const [ok, setOk] = useState(false);
    const [pending, setPending] = useState(false);
    const strength = useMemo(() => getPasswordStrength(password), [password]);
    useEffect(() => {
        if (user)
            navigate("/app", { replace: true });
    }, [user, navigate]);
    async function onSubmit(e) {
        e.preventDefault();
        setErr(null);
        if (strength.label !== "Fort") {
            setErr("Choisissez un mot de passe plus robuste (8+ caractères, majuscule, minuscule, chiffre et caractère spécial).");
            return;
        }
        setPending(true);
        const { error } = await signUp(email, password);
        setPending(false);
        if (error)
            setErr(error.message);
        else
            setOk(true);
    }
    return (_jsxs(AuthShell, { title: "Inscription", subtitle: "Un compte gratuit pour suivre tes cours, tes \u00E9ch\u00E9ances et ton rythme.", children: [ok ? (_jsxs("p", { className: "mt-6 text-center text-sm leading-relaxed text-[var(--color-bara-muted)]", children: ["V\u00E9rifiez votre bo\u00EEte mail pour confirmer votre compte, puis", " ", _jsx(Link, { to: "/connexion", className: "text-orange-600 hover:underline dark:text-orange-400", children: "connectez-vous" }), "."] })) : (_jsxs("form", { onSubmit: onSubmit, className: "mt-6 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "register-email", className: "block text-sm font-medium", children: "E-mail" }), _jsx("input", { id: "register-email", type: "email", required: true, autoComplete: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "bara-field mt-1 w-full" })] }), _jsx(PasswordField, { label: "Mot de passe", required: true, minLength: 8, autoComplete: "new-password", value: password, onChange: (e) => setPassword(e.target.value) }), password.length > 0 && (_jsxs("div", { children: [_jsx("div", { className: "h-2 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10", children: _jsx("div", { className: `h-2 rounded-full transition-all ${strength.color}`, style: { width: strength.width } }) }), _jsxs("p", { className: "mt-1 text-xs text-[var(--color-bara-muted)]", children: ["Force : ", strength.label, ". Il faut 8 caract\u00E8res, une majuscule, une minuscule, un chiffre et un symbole."] })] })), err && (_jsx("p", { className: "text-sm text-red-600", role: "alert", children: err })), _jsx("button", { type: "submit", disabled: pending || strength.label !== "Fort", className: "bara-cta w-full rounded-xl bg-orange-600 py-3 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-60", children: pending ? "Création…" : "Créer mon compte" })] })), _jsx("p", { className: "mt-4 text-center text-sm", children: _jsx(Link, { to: "/connexion", className: "text-orange-600 hover:underline dark:text-orange-400", children: "D\u00E9j\u00E0 un compte ?" }) })] }));
}
