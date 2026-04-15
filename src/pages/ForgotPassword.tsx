import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

export function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setPending(true);
    const { error } = await resetPassword(email);
    setPending(false);
    if (error) setErr(error.message);
    else setOk(true);
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[var(--color-bara-bg)] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-8 shadow-sm">
        <h1 className="text-center text-2xl font-bold">Réinitialiser</h1>
        <p className="mt-2 text-center text-sm text-[var(--color-bara-muted)]">
          Nous vous enverrons un lien par e-mail.
        </p>
        {ok ? (
          <p className="mt-6 text-center text-sm text-green-600 dark:text-green-400">
            Si un compte existe, un e-mail a été envoyé.
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
            {err && <p className="text-sm text-red-600">{err}</p>}
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-lg bg-orange-600 py-2.5 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-60"
            >
              {pending ? "Envoi…" : "Envoyer le lien"}
            </button>
          </form>
        )}
        <p className="mt-4 text-center text-sm">
          <Link to="/connexion" className="text-orange-600 hover:underline dark:text-orange-400">
            Retour à la connexion
          </Link>
          {" · "}
          <Link to="/" className="text-orange-600 hover:underline dark:text-orange-400">
            Accueil
          </Link>
          {" · "}
          <Link to="/apropos" className="text-orange-600 hover:underline dark:text-orange-400">
            À propos
          </Link>
        </p>
      </div>
    </div>
  );
}
