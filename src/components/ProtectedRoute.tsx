import { Navigate, Outlet, useLocation } from "react-router-dom";
import { GdprGate } from "@/components/GdprGate";
import { RestrictionGate } from "@/components/RestrictionGate";
import { useAuth } from "@/hooks/useAuth";
import { hasGdprAcceptance, isProcessingRestricted } from "@/lib/gdpr";

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
  if (!hasGdprAcceptance(user.user_metadata)) return <GdprGate />;
  if (isProcessingRestricted(user.user_metadata)) return <RestrictionGate />;
  return <Outlet />;
}
