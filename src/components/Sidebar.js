import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BarChart3, BookOpen, CalendarDays, CheckSquare, Info, LayoutDashboard, LogOut, Timer, UserCircle2, } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/hooks/useAuth";
import { fetchProfile } from "@/lib/api";
const desktopNav = [
    { to: "/app", label: "Tableau de bord", icon: LayoutDashboard },
    { to: "/app/matieres", label: "Matières", icon: BookOpen },
    { to: "/app/taches", label: "Tâches", icon: CheckSquare },
    { to: "/app/planning", label: "Planning", icon: CalendarDays },
    { to: "/app/focus", label: "Focus", icon: Timer },
    { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/app/profil", label: "Profil", icon: UserCircle2 },
    { to: "/apropos", label: "À propos", icon: Info },
];
/** Liens secondaires visibles surtout sur mobile (hors barre du bas). */
const mobileSecondary = [
    { to: "/app/matieres", label: "Matières", icon: BookOpen },
    { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
    { to: "/apropos", label: "À propos", icon: Info },
];
export function Sidebar() {
    const { signOut, user } = useAuth();
    const uid = user?.id;
    const logoUrl = `${import.meta.env.BASE_URL}bara_logo.png`;
    const { data: profile } = useQuery({
        queryKey: ["profile", uid],
        queryFn: () => fetchProfile(uid),
        enabled: !!uid,
    });
    const displayName = [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
        user?.email?.split("@")[0] ||
        "Utilisateur";
    return (_jsxs("aside", { className: "bara-topbar sticky top-0 z-30 w-full border-b border-[var(--color-bara-border)]", children: [_jsxs("div", { className: "flex items-center justify-between gap-3 px-3 py-2.5 md:grid md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-4 md:px-4 md:py-3", children: [_jsxs("div", { className: "flex min-w-0 items-center gap-2.5", children: [_jsx("div", { className: "bara-logo-wrap", children: _jsx("img", { src: logoUrl, alt: "Logo BARA", className: "bara-logo-img h-10 w-10 rounded-lg border border-[var(--color-bara-border)] bg-white/90 object-contain p-0.5 md:h-12 md:w-12" }) }), _jsxs("div", { className: "min-w-0", children: [_jsx("p", { className: "truncate text-sm font-semibold tracking-tight", children: displayName }), _jsx("p", { className: "hidden truncate text-xs text-[var(--color-bara-muted)] sm:block", children: user?.email ?? "Non renseign\u00E9" })] })] }), _jsx("nav", { className: "hidden overflow-x-auto md:block", "aria-label": "Navigation bureau", children: _jsx("div", { className: "flex min-w-max items-center gap-1", children: desktopNav.map(({ to, label, icon: Icon }) => (_jsxs(NavLink, { to: to, end: to === "/app" || to === "/apropos", className: ({ isActive }) => [
                                    "flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-orange-600/20 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300"
                                        : "text-[var(--color-bara-muted)] hover:bg-black/5 dark:hover:bg-white/5",
                                ].join(" "), children: [_jsx(Icon, { className: "h-4 w-4 shrink-0" }), _jsx("span", { children: label })] }, to))) }) }), _jsxs("div", { className: "flex items-center gap-1 md:justify-end", children: [_jsx(ThemeToggle, {}), _jsxs("button", { type: "button", onClick: () => void signOut(), className: "bara-touch flex items-center gap-2 rounded-xl px-2.5 py-2 text-sm text-red-600 hover:bg-red-500/10 dark:text-red-400", "aria-label": "D\u00E9connexion", children: [_jsx(LogOut, { className: "h-4 w-4" }), _jsx("span", { className: "hidden sm:inline", children: "D\u00E9connexion" })] })] })] }), _jsx("div", { className: "border-t border-[var(--color-bara-border)]/70 px-2 py-1.5 md:hidden", children: _jsx("div", { className: "flex gap-1 overflow-x-auto scrollbar-none", children: mobileSecondary.map(({ to, label, icon: Icon }) => (_jsxs(NavLink, { to: to, end: to === "/apropos", className: ({ isActive }) => [
                            "bara-touch flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition",
                            isActive
                                ? "bg-orange-600/15 text-orange-700 dark:text-orange-300"
                                : "text-[var(--color-bara-muted)] hover:bg-black/5",
                        ].join(" "), children: [_jsx(Icon, { className: "h-3.5 w-3.5" }), label] }, to))) }) })] }));
}
