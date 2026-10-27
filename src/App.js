import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { PageLoader } from "@/components/PageLoader";
import { RouteTitle } from "@/components/RouteTitle";
import { AuthProvider } from "@/hooks/AuthProvider";
const Layout = lazy(() => import("@/components/Layout").then((module) => ({ default: module.Layout })));
const ProtectedRoute = lazy(() => import("@/components/ProtectedRoute").then((module) => ({ default: module.ProtectedRoute })));
const Analytics = lazy(() => import("@/pages/Analytics").then((module) => ({ default: module.Analytics })));
const Dashboard = lazy(() => import("@/pages/Dashboard").then((module) => ({ default: module.Dashboard })));
const Focus = lazy(() => import("@/pages/Focus").then((module) => ({ default: module.Focus })));
const ForgotPassword = lazy(() => import("@/pages/ForgotPassword").then((module) => ({ default: module.ForgotPassword })));
const APropos = lazy(() => import("@/pages/APropos").then((module) => ({ default: module.APropos })));
const HomeEntry = lazy(() => import("@/pages/HomeEntry").then((module) => ({ default: module.HomeEntry })));
const Login = lazy(() => import("@/pages/Login").then((module) => ({ default: module.Login })));
const Planning = lazy(() => import("@/pages/Planning").then((module) => ({ default: module.Planning })));
const Profile = lazy(() => import("@/pages/Profile").then((module) => ({ default: module.Profile })));
const Register = lazy(() => import("@/pages/Register").then((module) => ({ default: module.Register })));
const ResetPassword = lazy(() => import("@/pages/ResetPassword").then((module) => ({ default: module.ResetPassword })));
const Subjects = lazy(() => import("@/pages/Subjects").then((module) => ({ default: module.Subjects })));
const Tasks = lazy(() => import("@/pages/Tasks").then((module) => ({ default: module.Tasks })));
export default function App() {
    return (_jsxs(AuthProvider, { children: [_jsx(RouteTitle, {}), _jsx(Suspense, { fallback: _jsx(PageLoader, {}), children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(HomeEntry, {}) }), _jsx(Route, { path: "/connexion", element: _jsx(Login, {}) }), _jsx(Route, { path: "/inscription", element: _jsx(Register, {}) }), _jsx(Route, { path: "/mot-de-passe", element: _jsx(ForgotPassword, {}) }), _jsx(Route, { path: "/reinitialiser-mot-de-passe", element: _jsx(ResetPassword, {}) }), _jsx(Route, { path: "/apropos", element: _jsx(APropos, {}) }), _jsx(Route, { element: _jsx(ProtectedRoute, {}), children: _jsxs(Route, { path: "/app", element: _jsx(Layout, {}), children: [_jsx(Route, { index: true, element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "matieres", element: _jsx(Subjects, {}) }), _jsx(Route, { path: "taches", element: _jsx(Tasks, {}) }), _jsx(Route, { path: "planning", element: _jsx(Planning, {}) }), _jsx(Route, { path: "focus", element: _jsx(Focus, {}) }), _jsx(Route, { path: "analytics", element: _jsx(Analytics, {}) }), _jsx(Route, { path: "profil", element: _jsx(Profile, {}) })] }) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/", replace: true }) })] }) })] }));
}
