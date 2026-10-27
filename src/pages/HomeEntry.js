import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Landing } from "@/pages/Landing";
/** Accueil public ou redirection vers l’app si déjà connecté. */
export function HomeEntry() {
    const { user, loading } = useAuth();
    if (loading) {
        return (_jsx("div", { className: "flex min-h-dvh items-center justify-center bg-[var(--color-bara-bg)]", children: _jsx("p", { className: "text-[var(--color-bara-muted)]", children: "Chargement\u2026" }) }));
    }
    if (user)
        return _jsx(Navigate, { to: "/app", replace: true });
    return _jsx(Landing, {});
}
