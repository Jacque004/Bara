import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function PageLoader() {
    const logoUrl = `${import.meta.env.BASE_URL}bara_logo.png`;
    return (_jsxs("div", { className: "bara-app-shell flex min-h-dvh flex-col items-center justify-center gap-3", role: "status", "aria-live": "polite", children: [_jsx("img", { src: logoUrl, alt: "", className: "h-14 w-14 animate-pulse rounded-2xl border border-[var(--color-bara-border)] bg-white/90 object-contain p-1" }), _jsx("p", { className: "text-sm text-[var(--color-bara-muted)]", children: "Chargement\u2026" })] }));
}
