import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
export function ProtectedRoute() {
    const { user, loading } = useAuth();
    const location = useLocation();
    if (loading) {
        return (_jsx("div", { className: "flex min-h-dvh items-center justify-center bg-[var(--color-bara-bg)]", children: _jsx("p", { className: "text-[var(--color-bara-muted)]", children: "Chargement\u2026" }) }));
    }
    if (!user) {
        return _jsx(Navigate, { to: "/connexion", replace: true, state: { from: location } });
    }
    return _jsx(Outlet, {});
}
