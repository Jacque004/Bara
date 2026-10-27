import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { SiteFooter } from "@/components/SiteFooter";
import { ThemeToggle } from "@/components/ThemeToggle";

export function AuthShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  const logoUrl = `${import.meta.env.BASE_URL}bara_logo.png`;

  return (
    <div className="bara-landing-hero flex min-h-dvh flex-col">
      <header className="bara-safe-x mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
        <Link
          to="/"
          className="flex items-center gap-2 font-semibold tracking-tight"
          aria-label="Retour à l’accueil"
        >
          <img
            src={logoUrl}
            alt=""
            className="h-10 w-10 rounded-lg border border-[var(--color-bara-border)] bg-white/90 object-contain p-0.5"
          />
          <span className="hidden sm:inline">BARA</span>
        </Link>
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center px-4 pb-12">
        <div className="bara-enter w-full max-w-sm rounded-3xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)]/92 p-6 shadow-sm backdrop-blur-md sm:p-8">
          <h1 className="text-center text-2xl font-bold tracking-tight">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-center text-sm leading-relaxed text-[var(--color-bara-muted)]">
              {subtitle}
            </p>
          )}
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
