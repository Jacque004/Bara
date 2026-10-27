import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { NavLink } from "react-router-dom";
import { CalendarDays, CheckSquare, LayoutDashboard, Timer, UserCircle2, } from "lucide-react";
const tabs = [
    { to: "/app", label: "Accueil", icon: LayoutDashboard, end: true },
    { to: "/app/taches", label: "Tâches", icon: CheckSquare, end: false },
    { to: "/app/focus", label: "Focus", icon: Timer, end: false, primary: true },
    { to: "/app/planning", label: "Planning", icon: CalendarDays, end: false },
    { to: "/app/profil", label: "Profil", icon: UserCircle2, end: false },
];
/** Navigation principale mobile (barre du bas). */
export function MobileBottomNav() {
    return (_jsx("nav", { className: "bara-mobile-nav fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-bara-border)] bg-[var(--color-bara-surface)]/95 backdrop-blur-md md:hidden", "aria-label": "Navigation principale", children: _jsx("ul", { className: "mx-auto flex max-w-lg items-stretch justify-between px-1 pt-1", children: tabs.map(({ to, label, icon: Icon, end, primary }) => (_jsx("li", { className: "min-w-0 flex-1", children: _jsx(NavLink, { to: to, end: end, className: ({ isActive }) => [
                        "bara-touch flex flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-1.5 text-[10px] font-medium transition",
                        primary
                            ? isActive
                                ? "text-orange-700 dark:text-orange-300"
                                : "text-orange-600 dark:text-orange-400"
                            : isActive
                                ? "text-orange-700 dark:text-orange-300"
                                : "text-[var(--color-bara-muted)]",
                    ].join(" "), children: ({ isActive }) => (_jsxs(_Fragment, { children: [_jsx("span", { className: [
                                    "flex h-9 w-9 items-center justify-center rounded-xl transition",
                                    primary
                                        ? "bg-orange-600 text-white shadow-sm shadow-orange-600/30"
                                        : isActive
                                            ? "bg-orange-600/15"
                                            : "",
                                ].join(" "), children: _jsx(Icon, { className: "h-5 w-5", strokeWidth: isActive || primary ? 2.25 : 2 }) }), _jsx("span", { className: "truncate", children: label })] })) }) }, to))) }) }));
}
