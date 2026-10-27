import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from "react-router-dom";
/** État vide invitant à l’action (rétention). */
export function EmptyState({ icon: Icon, title, description, actionLabel, actionTo, }) {
    return (_jsxs("div", { className: "bara-empty flex flex-col items-center px-4 py-10 text-center", children: [_jsx("div", { className: "flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-600/12 text-orange-600 dark:text-orange-400", children: _jsx(Icon, { className: "h-6 w-6" }) }), _jsx("h3", { className: "mt-4 text-base font-semibold tracking-tight", children: title }), _jsx("p", { className: "mt-2 max-w-sm text-sm leading-relaxed text-[var(--color-bara-muted)]", children: description }), actionLabel && actionTo && (_jsx(Link, { to: actionTo, className: "mt-5 inline-flex rounded-xl bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-500 active:scale-[0.98]", children: actionLabel }))] }));
}
