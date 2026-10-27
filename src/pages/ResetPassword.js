import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell } from "@/components/AuthShell";
import { PasswordField } from "@/components/PasswordField";
import { getPasswordStrength } from "@/lib/passwordStrength";
import { supabase } from "@/lib/supabase";
const RECOVERY_FLAG = "bara-password-recovery";
export function ResetPassword() {
    const navigate = useNavigate();
    const [ready, setReady] = useState(false);
    const [canReset, setCanReset] = useState(false);
    const [bootError, setBootError] = useState(null);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [err, setErr] = useState(null);
    const [ok, setOk] = useState(false);
    const [pending, setPending] = useState(false);
    const strength = useMemo(() => getPasswordStrength(password), [password]);
    useEffect(() => {
        let mounted = true;
        const allowReset = () => {
            sessionStorage.setItem(RECOVERY_FLAG, "1");
            if (!mounted)
                return;
            setCanReset(true);
            setBootError(null);
            setReady(true);
        };
        const denyReset = (message) => {
            if (!mounted)
                return;
            setCanReset(false);
            setBootError(message);
            setReady(true);
        };
        const { data: { subscription }, } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === "PASSWORD_RECOVERY" && session) {
                allowReset();
            }
        });
        (async () => {
            try {
                const hash = window.location.hash.toLowerCase();
                const params = new URLSearchParams(window.location.search);
                const code = params.get("code");
                const type = (params.get("type") ?? "").toLowerCase();
                const fromHash = hash.includes("type=recovery") || hash.includes("access_token=");
                const fromFlag = sessionStorage.getItem(RECOVERY_FLAG) === "1";
                if (code) {
                    const { error } = await supabase.auth.exchangeCodeForSession(code);
                    if (error) {
                        denyReset("Le lien de réinitialisation est invalide ou a déjà été utilisé. Demandez un nouveau lien.");
                        return;
                    }
                    allowReset();
                    // Nettoie le code de l’URL sans recharger.
                    window.history.replaceState({}, "", window.location.pathname);
                    return;
                }
                // Le client traite souvent le hash implicit au démarrage.
                const { data: { session }, } = await supabase.auth.getSession();
                if (session && (fromHash || fromFlag || type === "recovery")) {
                    allowReset();
                    return;
                }
                // Laisse le temps à detectSessionInUrl de finaliser.
                await new Promise((r) => setTimeout(r, 600));
                if (!mounted)
                    return;
                const { data: { session: later }, } = await supabase.auth.getSession();
                if (later &&
                    (fromHash ||
                        fromFlag ||
                        type === "recovery" ||
                        sessionStorage.getItem(RECOVERY_FLAG) === "1")) {
                    allowReset();
                    return;
                }
                denyReset("Le lien de réinitialisation est invalide ou expiré. Demandez un nouveau lien depuis « Mot de passe oublié ».");
            }
            catch {
                denyReset("Impossible de valider le lien de réinitialisation. Réessayez depuis « Mot de passe oublié ».");
            }
        })();
        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);
    async function onSubmit(e) {
        e.preventDefault();
        setErr(null);
        if (password.length < 6) {
            setErr("Le mot de passe doit contenir au moins 6 caractères.");
            return;
        }
        if (strength.label !== "Fort") {
            setErr("Choisissez un mot de passe plus robuste (8+ caractères, majuscule, minuscule, chiffre et caractère spécial).");
            return;
        }
        if (password !== confirmPassword) {
            setErr("Les mots de passe ne correspondent pas.");
            return;
        }
        setPending(true);
        const { error } = await supabase.auth.updateUser({ password });
        setPending(false);
        if (error) {
            setErr(error.message);
            return;
        }
        sessionStorage.removeItem(RECOVERY_FLAG);
        await supabase.auth.signOut();
        setOk(true);
        window.setTimeout(() => {
            navigate("/connexion", { replace: true });
        }, 1500);
    }
    return (_jsxs(AuthShell, { title: "Nouveau mot de passe", subtitle: "Choisissez un mot de passe robuste pour votre compte.", children: [!ready ? (_jsx("p", { className: "mt-6 text-center text-sm text-[var(--color-bara-muted)]", children: "V\u00E9rification du lien\u2026" })) : !canReset ? (_jsxs("div", { className: "mt-6 space-y-4", children: [_jsx("div", { className: "rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200", children: bootError }), _jsx(Link, { to: "/mot-de-passe", className: "block w-full rounded-lg bg-orange-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-orange-500", children: "Demander un nouveau lien" })] })) : ok ? (_jsx("p", { className: "mt-6 text-center text-sm text-green-600 dark:text-green-400", children: "Mot de passe mis \u00E0 jour. Redirection vers la connexion\u2026" })) : (_jsxs("form", { onSubmit: onSubmit, className: "mt-6 space-y-4", children: [_jsx(PasswordField, { label: "Nouveau mot de passe", required: true, minLength: 8, autoComplete: "new-password", value: password, onChange: (e) => setPassword(e.target.value) }), password.length > 0 && (_jsxs("div", { children: [_jsx("div", { className: "h-2 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10", children: _jsx("div", { className: `h-2 rounded-full transition-all ${strength.color}`, style: { width: strength.width } }) }), _jsxs("p", { className: "mt-1 text-xs text-[var(--color-bara-muted)]", children: ["Force : ", strength.label] })] })), _jsx(PasswordField, { label: "Confirmer le mot de passe", required: true, minLength: 8, autoComplete: "new-password", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value) }), err && (_jsx("p", { className: "text-sm text-red-600", role: "alert", children: err })), _jsx("button", { type: "submit", disabled: pending || strength.label !== "Fort", className: "bara-cta w-full rounded-xl bg-orange-600 py-3 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-60", children: pending ? "Mise à jour…" : "Changer le mot de passe" })] })), _jsx("p", { className: "mt-4 text-center text-sm", children: _jsx(Link, { to: "/connexion", className: "text-orange-600 hover:underline dark:text-orange-400", children: "Retour \u00E0 la connexion" }) })] }));
}
