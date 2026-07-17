import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

function usePostLoginPath() {
  const location = useLocation();
  return useMemo(() => {
    const from = (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname;
    if (from && from.startsWith("/app")) return from;
    return "/app";
  }, [location]);
}

export function Login() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const afterLogin = usePostLoginPath();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (user) navigate(afterLogin, { replace: true });
  }, [user, navigate, afterLogin]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setPending(true);
    const { error } = await signIn(email, password);
    setPending(false);
    if (error) setErr(error.message);
    else navigate(afterLogin, { replace: true });
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[var(--color-bara-bg)] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-8 shadow-sm">
        <h1 className="text-center text-2xl font-bold">Connexion</h1>
        <p className="mt-1 text-center text-sm text-[var(--color-bara-muted)]">
          BARA — votre assistant étudiant
        </p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium">E-mail</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--color-bara-border)] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Mot de passe</label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-[var(--color-bara-border)] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          {err && <p className="text-sm text-red-600">{err}</p>}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-orange-600 py-2.5 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-60"
          >
            {pending ? "Connexion…" : "Se connecter"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-[var(--color-bara-muted)]">
          <Link to="/mot-de-passe" className="text-orange-600 hover:underline dark:text-orange-400">
            Mot de passe oublié
          </Link>
          {" · "}
          <Link to="/inscription" className="text-orange-600 hover:underline dark:text-orange-400">
            Créer un compte
          </Link>
        </p>
        <p className="mt-4 text-center text-xs text-[var(--color-bara-muted)]">
          <Link to="/" className="hover:text-orange-600 dark:hover:text-orange-400">
            ← Accueil
          </Link>
          {" · "}
          <Link to="/apropos" className="hover:text-orange-600 dark:hover:text-orange-400">
            À propos
          </Link>
        </p>
      </div>
    </div>
  );
}
