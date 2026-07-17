import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { getPasswordStrength } from "@/lib/passwordStrength";

export function Register() {
  const { signUp, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [pending, setPending] = useState(false);
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  useEffect(() => {
    if (user) navigate("/app", { replace: true });
  }, [user, navigate]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (strength.label !== "Fort") {
      setErr(
        "Choisissez un mot de passe plus robuste (8+ caractères, majuscule, minuscule, chiffre et caractère spécial)."
      );
      return;
    }
    setPending(true);
    const { error } = await signUp(email, password);
    setPending(false);
    if (error) setErr(error.message);
    else setOk(true);
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[var(--color-bara-bg)] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-8 shadow-sm">
        <h1 className="text-center text-2xl font-bold">Inscription</h1>
        {ok ? (
          <p className="mt-4 text-center text-sm text-[var(--color-bara-muted)]">
            Vérifiez votre boîte mail pour confirmer votre compte, puis{" "}
            <Link to="/connexion" className="text-orange-600 hover:underline dark:text-orange-400">
              connectez-vous
            </Link>
            .
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium">E-mail</label>
              <input
                type="email"
                required
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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--color-bara-border)] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
              />
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className={`h-2 rounded-full transition-all ${strength.color}`}
                      style={{ width: strength.width }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-[var(--color-bara-muted)]">
                    Force du mot de passe : {strength.label}
                  </p>
                </div>
              )}
            </div>
            {err && <p className="text-sm text-red-600">{err}</p>}
            <button
              type="submit"
              disabled={pending || strength.label !== "Fort"}
              className="w-full rounded-lg bg-orange-600 py-2.5 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-60"
            >
              {pending ? "Création…" : "Créer mon compte"}
            </button>
          </form>
        )}
        <p className="mt-4 text-center text-sm">
          <Link to="/connexion" className="text-orange-600 hover:underline dark:text-orange-400">
            Déjà un compte ?
          </Link>
        </p>
        <p className="mt-3 text-center text-xs text-[var(--color-bara-muted)]">
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
