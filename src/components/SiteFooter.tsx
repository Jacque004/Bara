import { Link } from "react-router-dom";

const linkClass = "text-orange-600 hover:underline dark:text-orange-400";

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-bara-border)] px-4 py-8 text-center text-xs text-[var(--color-bara-muted)]">
      <p>BARA, organisation pour étudiants</p>
      <p className="mt-2 flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
        <Link to="/apropos" className={linkClass}>
          À propos
        </Link>
        <Link to="/confidentialite" className={linkClass}>
          Confidentialité
        </Link>
        <Link to="/mentions-legales" className={linkClass}>
          Mentions légales
        </Link>
      </p>
    </footer>
  );
}
