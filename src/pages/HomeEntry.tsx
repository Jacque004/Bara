import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Landing } from "@/pages/Landing";

/** Accueil public ou redirection vers l’app si déjà connecté. */
export function HomeEntry() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-[var(--color-bara-bg)]">
        <p className="text-[var(--color-bara-muted)]">Chargement…</p>
      </div>
    );
  }

  if (user) return <Navigate to="/app" replace />;
  return <Landing />;
}
