import { Link } from "react-router-dom";
import { BookOpen, Heart, Languages, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function APropos() {
  const { user } = useAuth();

  return (
    <div className="min-h-dvh bg-[var(--color-bara-bg)]">
      <header className="border-b border-[var(--color-bara-border)] bg-[var(--color-bara-surface)]/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-6 px-4 py-3 md:px-8">
          <Link to="/" className="flex shrink-0 items-center font-semibold">
            <img
              src="/bara_logo.png"
              alt="Logo BARA"
              className="h-12 w-12 rounded-lg border border-[var(--color-bara-border)] bg-white/90 object-contain p-0.5 sm:h-14 sm:w-14 md:h-[5.5rem] md:w-[5.5rem]"
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

      <main className="mx-auto max-w-3xl px-4 py-12 md:px-8 md:py-16">
        <h1 className="text-3xl font-bold tracking-tight">À propos</h1>
        <p className="mt-3 text-lg text-[var(--color-bara-muted)]">
          BARA est un assistant d’organisation pensé pour les étudiants : matières, tâches,
          planning et suivi du temps de travail.
        </p>

        <ul className="mt-12 space-y-10">
          <li className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-600/15 text-orange-600 dark:text-orange-400">
              <Languages className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold">Pourquoi « BARA » ?</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-bara-muted)]">
                J’ai choisi comme nom de l’application <strong>BARA</strong>, qui veut dire{" "}
                <strong>travailler</strong> ou <strong>bosser</strong> dans le jargon ivoirien.
                Un clin d’œil à l’idée de s’y mettre pour de vrai — cours, devoirs et révisions.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-600/15 text-orange-600 dark:text-orange-400">
              <Heart className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold">Objectif</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-bara-muted)]">
                Aider à structurer l’année sans surcharge : voir ce qui arrive, ce qui est en
                retard, et répartir les révisions de façon raisonnable grâce au planning
                intelligent.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-600/15 text-orange-600 dark:text-orange-400">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold">Données personnelles</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-bara-muted)]">
                Chaque compte ne voit que ses propres données grâce aux règles de sécurité
                (RLS) côté base. Aucun partage entre utilisateurs.
              </p>
            </div>
          </li>
          <li className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-orange-600/15 text-orange-600 dark:text-orange-400">
              <BookOpen className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold">Projet</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-bara-muted)]">
                BARA est une démonstration type SaaS étudiant (portfolio). Les fonctionnalités
                peuvent évoluer selon les besoins.
              </p>
            </div>
          </li>
        </ul>

        <p className="mt-12 text-center">
          <Link
            to="/"
            className="text-sm font-medium text-orange-600 hover:underline dark:text-orange-400"
          >
            ← Retour à l’accueil
          </Link>
        </p>
      </main>

      <footer className="border-t border-[var(--color-bara-border)] py-8 text-center text-xs text-[var(--color-bara-muted)]">
        BARA — organisation pour étudiants
      </footer>
    </div>
  );
}
