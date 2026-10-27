import { useState } from "react";
import { Link } from "react-router-dom";
import { AuthShell } from "@/components/AuthShell";
import { useAuth } from "@/hooks/useAuth";
import { friendlyAuthError } from "@/lib/authErrors";

/**
 * Accès sans e-mail de reset (évite les limites SMTP Supabase).
 * → Google, ou connexion puis changement dans Profil.
 */
export function ForgotPassword() {
  const { signInWithGoogle } = useAuth();
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onGoogle() {
    setErr(null);
    setPending(true);
    const { error } = await signInWithGoogle();
    setPending(false);
    if (error) setErr(friendlyAuthError(error));
  }

  return (
    <AuthShell
      title="Accès au compte"
      subtitle="Connectez-vous autrement, puis changez le mot de passe dans votre profil."
    >
        <div className="mt-6 space-y-3">
          <button
            type="button"
            disabled={pending}
            onClick={() => void onGoogle()}
            className="w-full rounded-lg border border-[var(--color-bara-border)] bg-[var(--color-bara-bg)] py-2.5 text-sm font-semibold hover:bg-black/[0.03] disabled:opacity-60 dark:hover:bg-white/[0.05]"
          >
            {pending ? "Redirection…" : "Continuer avec Google"}
          </button>

          <Link
            to="/connexion"
            className="block w-full rounded-lg bg-orange-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-orange-500"
          >
            Se connecter avec e-mail
          </Link>
        </div>

        {err && (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {err}
          </p>
        )}

        <ol className="mt-6 list-decimal space-y-2 pl-5 text-sm text-[var(--color-bara-muted)]">
          <li>Connectez-vous (Google ou e-mail si vous vous souvenez du mot de passe).</li>
          <li>
            Allez dans <strong>Profil</strong> → section Sécurité.
          </li>
          <li>Définissez un nouveau mot de passe (aucun e-mail envoyé).</li>
        </ol>

        <p className="mt-4 text-center text-sm">
          <Link to="/connexion" className="text-orange-600 hover:underline dark:text-orange-400">
            Retour à la connexion
          </Link>
        </p>
    </AuthShell>
  );
}
