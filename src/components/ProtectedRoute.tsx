import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[var(--color-bara-bg)]">
        <p className="text-[var(--color-bara-muted)]">Chargement…</p>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/connexion" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
