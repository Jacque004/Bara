import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/hooks/AuthProvider";

const Layout = lazy(() =>
  import("@/components/Layout").then((module) => ({ default: module.Layout }))
);
const ProtectedRoute = lazy(() =>
  import("@/components/ProtectedRoute").then((module) => ({ default: module.ProtectedRoute }))
);
const Analytics = lazy(() =>
  import("@/pages/Analytics").then((module) => ({ default: module.Analytics }))
);
const Dashboard = lazy(() =>
  import("@/pages/Dashboard").then((module) => ({ default: module.Dashboard }))
);
const Focus = lazy(() => import("@/pages/Focus").then((module) => ({ default: module.Focus })));
const ForgotPassword = lazy(() =>
  import("@/pages/ForgotPassword").then((module) => ({ default: module.ForgotPassword }))
);
const APropos = lazy(() =>
  import("@/pages/APropos").then((module) => ({ default: module.APropos }))
);
const HomeEntry = lazy(() =>
  import("@/pages/HomeEntry").then((module) => ({ default: module.HomeEntry }))
);
const Login = lazy(() => import("@/pages/Login").then((module) => ({ default: module.Login })));
const Planning = lazy(() =>
  import("@/pages/Planning").then((module) => ({ default: module.Planning }))
);
const Profile = lazy(() =>
  import("@/pages/Profile").then((module) => ({ default: module.Profile }))
);
const Register = lazy(() =>
  import("@/pages/Register").then((module) => ({ default: module.Register }))
);
const ResetPassword = lazy(() =>
  import("@/pages/ResetPassword").then((module) => ({ default: module.ResetPassword }))
);
const Subjects = lazy(() =>
  import("@/pages/Subjects").then((module) => ({ default: module.Subjects }))
);
const Tasks = lazy(() => import("@/pages/Tasks").then((module) => ({ default: module.Tasks })));

export default function App() {
  return (
    <AuthProvider>
      <Suspense fallback={<div className="p-4 text-sm text-zinc-500">Chargement...</div>}>
        <Routes>
          <Route path="/" element={<HomeEntry />} />
          <Route path="/connexion" element={<Login />} />
          <Route path="/inscription" element={<Register />} />
          <Route path="/mot-de-passe" element={<ForgotPassword />} />
          <Route path="/reinitialiser-mot-de-passe" element={<ResetPassword />} />
          <Route path="/apropos" element={<APropos />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/app" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="matieres" element={<Subjects />} />
              <Route path="taches" element={<Tasks />} />
              <Route path="planning" element={<Planning />} />
              <Route path="focus" element={<Focus />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="profil" element={<Profile />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  );
}
