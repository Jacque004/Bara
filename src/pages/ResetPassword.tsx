import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPasswordStrength } from "@/lib/passwordStrength";
import { supabase } from "@/lib/supabase";

const RECOVERY_FLAG = "bara-password-recovery";

export function ResetPassword() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [canReset, setCanReset] = useState(false);
  const [bootError, setBootError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [pending, setPending] = useState(false);
  const strength = useMemo(() => getPasswordStrength(password), [password]);

  useEffect(() => {
    let mounted = true;

    const allowReset = () => {
      sessionStorage.setItem(RECOVERY_FLAG, "1");
      if (!mounted) return;
      setCanReset(true);
      setBootError(null);
      setReady(true);
    };

    const denyReset = (message: string) => {
      if (!mounted) return;
      setCanReset(false);
      setBootError(message);
      setReady(true);
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" && session) {
        allowReset();
      }
    });

    (async () => {
      try {
        const hash = window.location.hash.toLowerCase();
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        const type = (params.get("type") ?? "").toLowerCase();
        const fromHash =
          hash.includes("type=recovery") || hash.includes("access_token=");
        const fromFlag = sessionStorage.getItem(RECOVERY_FLAG) === "1";

        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            denyReset(
              "Le lien de réinitialisation est invalide ou a déjà été utilisé. Demandez un nouveau lien."
            );
            return;
          }
          allowReset();
          // Nettoie le code de l’URL sans recharger.
          window.history.replaceState({}, "", window.location.pathname);
          return;
        }

        // Le client traite souvent le hash implicit au démarrage.
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session && (fromHash || fromFlag || type === "recovery")) {
          allowReset();
          return;
        }

        // Laisse le temps à detectSessionInUrl de finaliser.
        await new Promise((r) => setTimeout(r, 600));
        if (!mounted) return;

        const {
          data: { session: later },
        } = await supabase.auth.getSession();

        if (
          later &&
          (fromHash ||
            fromFlag ||
            type === "recovery" ||
            sessionStorage.getItem(RECOVERY_FLAG) === "1")
        ) {
          allowReset();
          return;
        }

        denyReset(
          "Le lien de réinitialisation est invalide ou expiré. Demandez un nouveau lien depuis « Mot de passe oublié »."
        );
      } catch {
        denyReset(
          "Impossible de valider le lien de réinitialisation. Réessayez depuis « Mot de passe oublié »."
        );
      }
    })();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);

    if (password.length < 6) {
      setErr("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (strength.label !== "Fort") {
      setErr(
        "Choisissez un mot de passe plus robuste (8+ caractères, majuscule, minuscule, chiffre et caractère spécial)."
      );
      return;
    }
    if (password !== confirmPassword) {
      setErr("Les mots de passe ne correspondent pas.");
      return;
    }

    setPending(true);
    const { error } = await supabase.auth.updateUser({ password });
    setPending(false);

    if (error) {
      setErr(error.message);
      return;
    }

    sessionStorage.removeItem(RECOVERY_FLAG);
    await supabase.auth.signOut();
    setOk(true);
    window.setTimeout(() => {
      navigate("/connexion", { replace: true });
    }, 1500);
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[var(--color-bara-bg)] px-4">
      <div className="w-full max-w-sm rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-8 shadow-sm">
        <h1 className="text-center text-2xl font-bold">Nouveau mot de passe</h1>
        <p className="mt-2 text-center text-sm text-[var(--color-bara-muted)]">
          Choisissez un nouveau mot de passe pour votre compte.
        </p>

        {!ready ? (
          <p className="mt-6 text-center text-sm text-[var(--color-bara-muted)]">
            Vérification du lien…
          </p>
        ) : !canReset ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200">
              {bootError}
            </div>
            <Link
              to="/mot-de-passe"
              className="block w-full rounded-lg bg-orange-600 py-2.5 text-center text-sm font-semibold text-white hover:bg-orange-500"
            >
              Demander un nouveau lien
            </Link>
          </div>
        ) : ok ? (
          <p className="mt-6 text-center text-sm text-green-600 dark:text-green-400">
            Mot de passe mis à jour. Redirection vers la connexion…
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium">Nouveau mot de passe</label>
              <input
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
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
            <div>
              <label className="block text-sm font-medium">Confirmer le mot de passe</label>
              <input
                type="password"
                required
                minLength={6}
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--color-bara-border)] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            {err && <p className="text-sm text-red-600">{err}</p>}
            <button
              type="submit"
              disabled={pending || strength.label !== "Fort"}
              className="w-full rounded-lg bg-orange-600 py-2.5 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-60"
            >
              {pending ? "Mise à jour…" : "Changer le mot de passe"}
            </button>
          </form>
        )}

        <p className="mt-4 text-center text-sm">
          <Link to="/connexion" className="text-orange-600 hover:underline dark:text-orange-400">
            Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  );
}
