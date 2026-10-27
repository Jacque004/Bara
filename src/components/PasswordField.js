import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
export function PasswordField({ label, id, className, ...props }) {
    const autoId = useId();
    const inputId = id ?? autoId;
    const [visible, setVisible] = useState(false);
    return (_jsxs("div", { children: [_jsx("label", { htmlFor: inputId, className: "block text-sm font-medium", children: label }), _jsxs("div", { className: "relative mt-1", children: [_jsx("input", { ...props, id: inputId, type: visible ? "text" : "password", className: ["bara-field w-full pr-12", className ?? ""].join(" ") }), _jsx("button", { type: "button", onClick: () => setVisible((v) => !v), className: "bara-touch absolute inset-y-0 right-0 flex w-11 items-center justify-center text-[var(--color-bara-muted)]", "aria-label": visible ? "Masquer le mot de passe" : "Afficher le mot de passe", "aria-pressed": visible, children: visible ? _jsx(EyeOff, { className: "h-4 w-4" }) : _jsx(Eye, { className: "h-4 w-4" }) })] })] }));
}
