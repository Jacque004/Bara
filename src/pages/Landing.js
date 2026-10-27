import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BarChart3, BookOpen, CalendarDays, CheckSquare, LayoutDashboard, Sparkles, Timer, } from "lucide-react";
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
    return (_jsxs("div", { className: "min-h-dvh bg-[var(--color-bara-bg)]", children: [_jsx("header", { className: "sticky top-0 z-30 border-b border-[var(--color-bara-border)]/80 bg-[var(--color-bara-surface)]/70 backdrop-blur-md", children: _jsxs("div", { className: "bara-safe-x mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-2.5 md:px-8 md:py-3", children: [_jsx(Link, { to: "/", className: "flex shrink-0 items-center font-semibold", children: _jsx("img", { src: logoUrl, alt: "BARA", className: "h-10 w-10 rounded-lg border border-[var(--color-bara-border)] bg-white/90 object-contain p-0.5 sm:h-12 sm:w-12" }) }), _jsxs("div", { className: "flex items-center gap-1.5 sm:gap-3", children: [_jsx(ThemeToggle, {}), _jsx(Link, { to: "/apropos", className: "hidden rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-bara-muted)] transition hover:bg-black/5 sm:inline-flex dark:hover:bg-white/5", children: "\u00C0 propos" }), _jsx(Link, { to: "/connexion", className: "bara-touch inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-bara-muted)] transition hover:bg-black/5 dark:hover:bg-white/5", children: "Connexion" }), _jsxs(Link, { to: "/inscription", className: "bara-cta bara-touch inline-flex items-center rounded-lg bg-orange-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-orange-500 sm:px-4", children: [_jsx("span", { className: "sm:hidden", children: "S\u2019inscrire" }), _jsx("span", { className: "hidden sm:inline", children: "Cr\u00E9er un compte" })] })] })] }) }), _jsxs("main", { children: [_jsx("section", { className: "bara-landing-hero", children: _jsxs("div", { className: "bara-safe-x mx-auto flex min-h-[min(78dvh,720px)] max-w-5xl flex-col items-center justify-center px-4 py-12 text-center sm:py-16 md:px-8 md:py-20", children: [_jsx("img", { src: logoUrl, alt: "BARA", className: "bara-enter h-24 w-24 rounded-2xl border border-[var(--color-bara-border)] bg-white/90 object-contain p-1 shadow-sm sm:h-36 sm:w-36" }), _jsx("p", { className: "bara-enter bara-enter-delay-1 mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-orange-600 sm:mt-8 sm:text-sm dark:text-orange-400", children: "BARA" }), _jsxs("h1", { className: "bara-enter bara-enter-delay-1 mt-3 max-w-3xl text-[1.85rem] font-bold leading-tight tracking-tight text-balance sm:text-4xl md:text-5xl lg:text-6xl", children: ["Organisez vos cours,", " ", _jsx("span", { className: "text-orange-600 dark:text-orange-400", children: "sans friction" })] }), _jsx("p", { className: "bara-enter bara-enter-delay-2 mx-auto mt-4 max-w-xl text-base text-[var(--color-bara-muted)] text-pretty sm:mt-5 sm:text-lg", children: "Mati\u00E8res, devoirs et Focus au m\u00EAme endroit \u2014 un rythme d\u2019\u00E9tude qui se construit session apr\u00E8s session." }), _jsxs("div", { className: "bara-enter bara-enter-delay-3 mt-8 flex w-full max-w-sm flex-col gap-2.5 sm:mt-9 sm:max-w-none sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-3", children: [_jsx(Link, { to: "/inscription", className: "bara-cta bara-touch inline-flex w-full items-center justify-center rounded-xl bg-orange-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-orange-500 sm:w-auto sm:py-3", children: "Commencer gratuitement" }), _jsx(Link, { to: "/connexion", className: "bara-cta bara-touch inline-flex w-full items-center justify-center rounded-xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)]/80 px-6 py-3.5 text-sm font-semibold backdrop-blur transition hover:bg-black/[0.03] sm:w-auto sm:py-3 dark:hover:bg-white/[0.05]", children: "J\u2019ai d\u00E9j\u00E0 un compte" })] })] }) }), _jsx("section", { className: "border-t border-[var(--color-bara-border)] py-16 md:py-20", children: _jsxs("div", { className: "mx-auto max-w-5xl px-4 md:px-8", children: [_jsx("h2", { className: "text-center text-2xl font-bold tracking-tight md:text-3xl", children: "Un fil clair pour \u00E9tudier" }), _jsx("p", { className: "mx-auto mt-3 max-w-lg text-center text-sm text-[var(--color-bara-muted)]", children: "Moins de friction, plus de sessions. Voici ce qui structure votre journ\u00E9e." }), _jsx("ul", { className: "mt-12 divide-y divide-[var(--color-bara-border)] border-y border-[var(--color-bara-border)]", children: features.map(({ icon: Icon, title, text }) => (_jsxs("li", { className: "flex gap-4 py-5 transition hover:bg-orange-500/[0.03]", children: [_jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-600/12 text-orange-600 dark:text-orange-400", children: _jsx(Icon, { className: "h-5 w-5" }) }), _jsxs("div", { className: "min-w-0 text-left", children: [_jsx("h3", { className: "font-semibold tracking-tight", children: title }), _jsx("p", { className: "mt-1 text-sm leading-relaxed text-[var(--color-bara-muted)]", children: text })] })] }, title))) })] }) }), _jsx("section", { className: "bara-landing-hero border-t border-[var(--color-bara-border)]", children: _jsxs("div", { className: "mx-auto max-w-5xl px-4 py-16 text-center md:px-8 md:py-20", children: [_jsx("h2", { className: "text-2xl font-bold tracking-tight md:text-3xl", children: "Une session aujourd\u2019hui change demain" }), _jsx("p", { className: "mx-auto mt-3 max-w-md text-sm text-[var(--color-bara-muted)]", children: "Cr\u00E9ez votre compte et lancez votre premier Focus en moins d\u2019une minute." }), _jsxs("div", { className: "mt-8 flex flex-wrap justify-center gap-3", children: [_jsx(Link, { to: "/inscription", className: "bara-cta rounded-xl bg-orange-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-500", children: "Cr\u00E9er mon espace" }), _jsx(Link, { to: "/connexion", className: "bara-cta rounded-xl border border-[var(--color-bara-border)] px-6 py-3 text-sm font-semibold transition hover:bg-black/[0.03] dark:hover:bg-white/[0.05]", children: "Se connecter" })] })] }) })] }), _jsxs("footer", { className: "border-t border-[var(--color-bara-border)] py-8 text-center text-xs text-[var(--color-bara-muted)]", children: [_jsx("p", { children: "BARA, organisation pour \u00E9tudiants" }), _jsx("p", { className: "mt-2", children: _jsx(Link, { to: "/apropos", className: "text-orange-600 hover:underline dark:text-orange-400", children: "\u00C0 propos" }) })] })] }));
}
