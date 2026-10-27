import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const TITLES: { path: string; title: string; exact?: boolean }[] = [
  { path: "/", title: "BARA, organisation pour étudiants", exact: true },
  { path: "/connexion", title: "Connexion" },
  { path: "/inscription", title: "Inscription" },
  { path: "/mot-de-passe", title: "Accès au compte" },
  { path: "/reinitialiser-mot-de-passe", title: "Nouveau mot de passe" },
  { path: "/apropos", title: "À propos" },
  { path: "/confidentialite", title: "Confidentialité" },
  { path: "/mentions-legales", title: "Mentions légales" },
  { path: "/app/matieres", title: "Matières" },
  { path: "/app/taches", title: "Tâches" },
  { path: "/app/planning", title: "Planning" },
  { path: "/app/focus", title: "Focus" },
  { path: "/app/analytics", title: "Analytics" },
  { path: "/app/profil", title: "Profil" },
  { path: "/app", title: "Tableau de bord", exact: true },
];

export function RouteTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    const match = TITLES.find((item) =>
      item.exact ? pathname === item.path : pathname.startsWith(item.path)
    );
    document.title = match
      ? match.title.startsWith("BARA")
        ? match.title
        : `${match.title} · BARA`
      : "BARA";
  }, [pathname]);

  return null;
}
