import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { SiteFooter } from "@/components/SiteFooter";
import { useAuth } from "@/hooks/useAuth";

export function PublicShell({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const logoUrl = `${import.meta.env.BASE_URL}bara_logo.png`;

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--color-bara-bg)]">
      <header className="border-b border-[var(--color-bara-border)] bg-[var(--color-bara-surface)]/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-6 px-4 py-3 md:px-8">
          <Link to="/" className="flex shrink-0 items-center font-semibold">
            <img
              src={logoUrl}
              alt="Logo BARA"
              className="h-12 w-12 rounded-lg border border-[var(--color-bara-border)] bg-white/90 object-contain p-0.5 sm:h-14 sm:w-14"
            />
          </Link>
          <div className="flex flex-wrap items-center justify-end gap-2 sm:gap-4">
            {user ? (
              <Link
                to="/app"
                className="rounded-lg px-3 py-2 text-sm font-medium text-orange-600 hover:bg-orange-600/10 dark:text-orange-400"
              >
                Mon espace
              </Link>
            ) : (
              <Link
                to="/connexion"
                className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-bara-muted)] hover:bg-black/5 dark:hover:bg-white/5"
              >
                Connexion
              </Link>
            )}
            {!user && (
              <Link
                to="/inscription"
                className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500"
              >
                Créer un compte
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12 md:px-8 md:py-16">{children}</main>
      <SiteFooter />
    </div>
  );
}
