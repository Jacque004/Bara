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
    text: "Classez vos cours par couleur pour tout retrouver en un coup d’œil.",
  },
  {
    icon: CheckSquare,
    title: "Tâches & échéances",
    text: "Devoirs, révisions, examens : deadlines et difficulté au même endroit.",
  },
  {
    icon: Sparkles,
    title: "Planning intelligent",
    text: "Des créneaux générés selon priorité, urgence et progression.",
  },
  {
    icon: LayoutDashboard,
    title: "Tableau de bord",
    text: "Retards, à venir, série du jour et temps déjà étudié.",
  },
  {
    icon: Timer,
    title: "Mode Focus",
    text: "Pomodoro 25/5 avec enregistrement automatique des sessions.",
  },
  {
    icon: BarChart3,
    title: "Analytics",
    text: "Temps par matière pour ajuster vos habitudes.",
  },
  {
    icon: CalendarDays,
    title: "Rappels",
    text: "Alertes sur les deadlines directement dans l’application.",
  },
];

export function Landing() {
  const logoUrl = `${import.meta.env.BASE_URL}bara_logo.png`;

  return (
    <div className="min-h-dvh bg-[var(--color-bara-bg)]">
      <header className="sticky top-0 z-30 border-b border-[var(--color-bara-border)]/80 bg-[var(--color-bara-surface)]/70 backdrop-blur-md">
        <div className="bara-safe-x mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2.5 md:px-8 md:py-3">
          <Link to="/" className="flex shrink-0 items-center font-semibold">
            <img
              src={logoUrl}
              alt="BARA"
              className="h-10 w-10 rounded-lg border border-[var(--color-bara-border)] bg-white/90 object-contain p-0.5 sm:h-12 sm:w-12"
            />
          </Link>
          <div className="flex items-center gap-1.5 sm:gap-3">
            <Link
              to="/apropos"
              className="hidden rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-bara-muted)] transition hover:bg-black/5 sm:inline-flex dark:hover:bg-white/5"
            >
              À propos
            </Link>
            <Link
              to="/connexion"
              className="bara-touch inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-bara-muted)] transition hover:bg-black/5 dark:hover:bg-white/5"
            >
              Connexion
            </Link>
            <Link
              to="/inscription"
              className="bara-cta bara-touch inline-flex items-center rounded-lg bg-orange-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-orange-500 sm:px-4"
            >
              <span className="sm:hidden">S’inscrire</span>
              <span className="hidden sm:inline">Créer un compte</span>
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="bara-landing-hero">
          <div className="bara-safe-x mx-auto flex min-h-[min(78dvh,720px)] max-w-5xl flex-col items-center justify-center px-4 py-12 text-center sm:py-16 md:px-8 md:py-20">
            <img
              src={logoUrl}
              alt="BARA"
              className="bara-enter h-24 w-24 rounded-2xl border border-[var(--color-bara-border)] bg-white/90 object-contain p-1 shadow-sm sm:h-36 sm:w-36"
            />
            <p className="bara-enter bara-enter-delay-1 mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-orange-600 sm:mt-8 sm:text-sm dark:text-orange-400">
              BARA
            </p>
            <h1 className="bara-enter bara-enter-delay-1 mt-3 max-w-3xl text-[1.85rem] font-bold leading-tight tracking-tight text-balance sm:text-4xl md:text-5xl lg:text-6xl">
              Organisez vos cours,{" "}
              <span className="text-orange-600 dark:text-orange-400">sans friction</span>
            </h1>
            <p className="bara-enter bara-enter-delay-2 mx-auto mt-4 max-w-xl text-base text-[var(--color-bara-muted)] text-pretty sm:mt-5 sm:text-lg">
              Matières, devoirs et Focus au même endroit — un rythme d’étude qui se
              construit session après session.
            </p>
            <div className="bara-enter bara-enter-delay-3 mt-8 flex w-full max-w-sm flex-col gap-2.5 sm:mt-9 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-3">
              <Link
                to="/inscription"
                className="bara-cta bara-touch inline-flex w-full items-center justify-center rounded-xl bg-orange-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-500 sm:w-auto sm:py-3"
              >
                Commencer gratuitement
              </Link>
              <Link
                to="/connexion"
                className="bara-cta bara-touch inline-flex w-full items-center justify-center rounded-xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)]/80 px-6 py-3.5 text-sm font-semibold backdrop-blur transition hover:bg-black/[0.03] sm:w-auto sm:py-3 dark:hover:bg-white/[0.05]"
              >
                J’ai déjà un compte
              </Link>
            </div>
          </div>
        </section>

        <section className="border-t border-[var(--color-bara-border)] py-16 md:py-20">
          <div className="mx-auto max-w-5xl px-4 md:px-8">
            <h2 className="text-center text-2xl font-bold tracking-tight md:text-3xl">
              Un fil clair pour étudier
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-center text-sm text-[var(--color-bara-muted)]">
              Moins de friction, plus de sessions. Voici ce qui structure votre journée.
            </p>
            <ul className="mt-12 divide-y divide-[var(--color-bara-border)] border-y border-[var(--color-bara-border)]">
              {features.map(({ icon: Icon, title, text }) => (
                <li
                  key={title}
                  className="flex gap-4 py-5 transition hover:bg-orange-500/[0.03]"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-600/12 text-orange-600 dark:text-orange-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 text-left">
                    <h3 className="font-semibold tracking-tight">{title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-[var(--color-bara-muted)]">
                      {text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="bara-landing-hero border-t border-[var(--color-bara-border)]">
          <div className="mx-auto max-w-5xl px-4 py-16 text-center md:px-8 md:py-20">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Une session aujourd’hui change demain
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-[var(--color-bara-muted)]">
              Créez votre compte et lancez votre premier Focus en moins d’une minute.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                to="/inscription"
                className="bara-cta rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
              >
                Créer mon espace
              </Link>
              <Link
                to="/connexion"
                className="bara-cta rounded-xl border border-[var(--color-bara-border)] px-6 py-3 text-sm font-semibold transition hover:bg-black/[0.03] dark:hover:bg-white/[0.05]"
              >
                Se connecter
              </Link>
            </div>
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
