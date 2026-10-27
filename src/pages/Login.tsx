import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthShell } from "@/components/AuthShell";
import { GdprChecks } from "@/components/GdprChecks";
import { PasswordField } from "@/components/PasswordField";
import { useAuth } from "@/hooks/useAuth";
import { friendlyAuthError } from "@/lib/authErrors";

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
  const { signIn, signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const afterLogin = usePostLoginPath();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [ageChecked, setAgeChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);

  useEffect(() => {
    if (user) navigate(afterLogin, { replace: true });
  }, [user, navigate, afterLogin]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setPending(true);
    const { error } = await signIn(email, password);
    setPending(false);
    if (error) setErr(friendlyAuthError(error));
    else navigate(afterLogin, { replace: true });
  }

  async function onGoogle() {
    setErr(null);
    if (!ageChecked || !privacyChecked) {
      setErr("Cochez les deux cases avant de continuer avec Google.");
      return;
    }
    setPending(true);
    const { error } = await signInWithGoogle();
    setPending(false);
    if (error) setErr(friendlyAuthError(error));
  }

  return (
    <AuthShell title="Connexion" subtitle="Retrouve tes matières, tes tâches et tes sessions Focus.">
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium">
            E-mail
          </label>
          <input
            id="login-email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bara-field mt-1 w-full"
          />
        </div>
        <PasswordField
          label="Mot de passe"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {err && (
          <p className="text-sm text-red-600" role="alert">
            {err}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="bara-cta w-full rounded-xl bg-orange-600 py-3 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-60"
        >
          {pending ? "Connexion…" : "Se connecter"}
        </button>
      </form>

      <div className="my-4 flex items-center gap-3 text-xs text-[var(--color-bara-muted)]">
        <span className="h-px flex-1 bg-[var(--color-bara-border)]" />
        ou
        <span className="h-px flex-1 bg-[var(--color-bara-border)]" />
      </div>

      <p className="mb-3 text-xs leading-relaxed text-[var(--color-bara-muted)]">
        Google peut créer un compte. Confirmez votre âge et la politique avant de continuer.
      </p>
      <GdprChecks
        ageChecked={ageChecked}
        privacyChecked={privacyChecked}
        onAgeChange={setAgeChecked}
        onPrivacyChange={setPrivacyChecked}
        ageId="login-age"
        privacyId="login-privacy"
      />

      <button
        type="button"
        disabled={pending || !ageChecked || !privacyChecked}
        onClick={() => void onGoogle()}
        className="bara-cta mt-4 w-full rounded-xl border border-[var(--color-bara-border)] py-3 text-sm font-semibold hover:bg-black/[0.03] disabled:opacity-60 dark:hover:bg-white/[0.05]"
      >
        Continuer avec Google
      </button>

      <p className="mt-4 text-center text-sm text-[var(--color-bara-muted)]">
        <Link to="/mot-de-passe" className="text-orange-600 hover:underline dark:text-orange-400">
          Problème de connexion ?
        </Link>
        {" · "}
        <Link to="/inscription" className="text-orange-600 hover:underline dark:text-orange-400">
          Créer un compte
        </Link>
      </p>
    </AuthShell>
  );
}
