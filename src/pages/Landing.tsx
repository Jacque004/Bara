import { Link } from "react-router-dom";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckSquare,
  LayoutDashboard,
  Sparkles,
  Timer,
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Matières",
    text: "Classez vos cours par matière et couleur pour tout retrouver en un coup d’œil.",
  },
  {
    icon: CheckSquare,
    title: "Tâches & échéances",
    text: "Devoirs, révisions, examens : deadlines, difficulté et temps estimé au même endroit.",
  },
  {
    icon: Sparkles,
    title: "Planning intelligent",
    text: "Génération automatique de créneaux selon priorité, urgence et progression.",
  },
  {
    icon: LayoutDashboard,
    title: "Tableau de bord",
    text: "Vue d’ensemble : retards, à venir, progression et temps déjà étudié.",
  },
  {
    icon: Timer,
    title: "Mode Focus",
    text: "Pomodoro 25/5 avec enregistrement du temps sur vos tâches.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    text: "Temps par matière et indicateurs pour ajuster vos habitudes.",
  },
  {
    icon: CalendarDays,
    title: "Rappels",
    text: "Alertes sur les deadlines et retards directement dans l’application.",
  },
];

export function Landing() {
  return (
    <div className="min-h-dvh bg-[var(--color-bara-bg)]">
      <header className="border-b border-[var(--color-bara-border)] bg-[var(--color-bara-surface)]/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-4 py-3 md:px-8">
          <Link to="/" className="flex shrink-0 items-center font-semibold">
            <img
              src="/bara_logo.png"
              alt="Logo BARA"
              className="h-12 w-12 rounded-lg border border-[var(--color-bara-border)] bg-white/90 object-contain p-0.5 sm:h-14 sm:w-14 md:h-[5.5rem] md:w-[5.5rem]"
            />

          </Link>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link
              to="/apropos"
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-bara-muted)] hover:bg-black/5 dark:hover:bg-white/5"
            >
              À propos
            </Link>
            <Link
              to="/connexion"
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-bara-muted)] hover:bg-black/5 dark:hover:bg-white/5"
            >
              Connexion
            </Link>
            <Link
              to="/inscription"
              className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500"
            >
              Créer un compte
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-5xl px-4 py-16 text-center md:px-8 md:py-24">
          <p className="text-sm font-medium uppercase tracking-widest text-orange-600 dark:text-orange-400">
            Assistant étudiant
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-balance md:text-5xl">
            Organisez vos cours,{" "}
            <span className="text-orange-600 dark:text-orange-400">sans friction</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-[var(--color-bara-muted)] text-pretty">
            BARA centralise matières, devoirs et révisions. Le planning s’adapte à vos
            priorités — une fois connecté, tout est synchronisé avec votre compte.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/inscription"
              className="rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-600/25 hover:bg-orange-500"
            >
              Créer un compte
            </Link>
            <Link
              to="/connexion"
              className="rounded-xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] px-6 py-3 text-sm font-semibold hover:bg-black/[0.03] dark:hover:bg-white/[0.05]"
            >
              J’ai déjà un compte
            </Link>
          </div>
          <p className="mt-6 text-xs text-[var(--color-bara-muted)]">
            L’exploration de cette page est libre. L’utilisation des outils nécessite un
            compte.
          </p>
        </section>

        <section className="border-t border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-4 md:px-8">
            <h2 className="text-center text-2xl font-bold md:text-3xl">
              Ce que propose BARA
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-sm text-[var(--color-bara-muted)]">
              Découvrez les fonctionnalités ci-dessous. Pour les utiliser, connectez-vous ou
              inscrivez-vous.
            </p>
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map(({ icon: Icon, title, text }) => (
                <li
                  key={title}
                  className="rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-bg)] p-5 text-left"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-600/15 text-orange-600 dark:text-orange-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 font-semibold">{title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-bara-muted)]">
                    {text}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-16 text-center md:px-8 md:py-20">
          <h2 className="text-2xl font-bold">Prêt à structurer votre année ?</h2>
          <p className="mx-auto mt-3 max-w-md text-sm text-[var(--color-bara-muted)]">
            Créez un compte en quelques secondes pour accéder au tableau de bord, aux
            tâches et au planning.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/inscription"
              className="rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-500"
            >
              S’inscrire
            </Link>
            <Link
              to="/connexion"
              className="rounded-xl border border-[var(--color-bara-border)] px-6 py-3 text-sm font-semibold hover:bg-black/[0.03] dark:hover:bg-white/[0.05]"
            >
              Se connecter
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--color-bara-border)] py-8 text-center text-xs text-[var(--color-bara-muted)]">
        <p>BARA — organisation pour étudiants</p>
        <p className="mt-2">
          <Link to="/apropos" className="text-orange-600 hover:underline dark:text-orange-400">
            À propos
          </Link>
        </p>
      </footer>
    </div>
  );
}
