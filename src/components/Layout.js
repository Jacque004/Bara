import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from "react-router-dom";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { Sidebar } from "@/components/Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useTasksRealtime } from "@/hooks/useTasksRealtime";
export function Layout() {
    const { user } = useAuth();
    useTasksRealtime(user?.id);
    return (_jsxs("div", { className: "bara-app-shell flex min-h-dvh flex-col", children: [_jsx(Sidebar, {}), _jsx("main", { className: "bara-main-mobile min-w-0 flex-1 overflow-auto px-3 py-4 sm:px-4 md:p-8", children: _jsx("div", { className: "mx-auto max-w-5xl", children: _jsx(Outlet, {}) }) }), _jsx(MobileBottomNav, {})] }));
}
