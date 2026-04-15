import { NavLink } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckSquare,
  Info,
  LayoutDashboard,
  LogOut,
  Timer,
  UserCircle2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { fetchProfile } from "@/lib/api";

const nav = [
  { to: "/app", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/app/matieres", label: "Matières", icon: BookOpen },
  { to: "/app/taches", label: "Tâches", icon: CheckSquare },
  { to: "/app/planning", label: "Planning", icon: CalendarDays },
  { to: "/app/focus", label: "Focus", icon: Timer },
  { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/app/profil", label: "Profil", icon: UserCircle2 },
  { to: "/apropos", label: "À propos", icon: Info },
];

export function Sidebar() {
  const { signOut, user } = useAuth();
  const uid = user?.id;
  const logoUrl = `${import.meta.env.BASE_URL}bara_logo.png`;

  const { data: profile } = useQuery({
    queryKey: ["profile", uid],
    queryFn: () => fetchProfile(uid!),
    enabled: !!uid,
  });

  const displayName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    user?.email ||
    "Utilisateur";

  return (
    <aside className="bara-topbar w-full border-b border-[var(--color-bara-border)]">
      <div className="grid gap-3 p-3 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:gap-4 md:px-4">
        <div className="flex min-w-0 items-center gap-3">
          <div className="bara-logo-wrap">
            <img
              src={logoUrl}
              alt="Logo BARA"
              className="bara-logo-img h-12 w-12 rounded-lg border border-[var(--color-bara-border)] bg-white/90 object-contain p-0.5"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight">{displayName}</p>
            <p className="truncate text-xs text-[var(--color-bara-muted)]">
              {user?.email ?? "—"}
            </p>
          </div>
        </div>
        <nav className="overflow-x-auto">
          <div className="flex min-w-max items-center gap-1">
            {nav.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/app" || to === "/apropos"}
                className={({ isActive }) =>
                  [
                    "flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-orange-600/20 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300"
                      : "text-[var(--color-bara-muted)] hover:bg-black/5 dark:hover:bg-white/5",
                  ].join(" ")
                }
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{label}</span>
              </NavLink>
            ))}
          </div>
        </nav>
        <div className="flex items-center gap-2 md:justify-end">
          <button
            type="button"
            onClick={() => void signOut()}
            className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-500/10 dark:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
