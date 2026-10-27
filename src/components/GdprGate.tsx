import { useState } from "react";
import { Link } from "react-router-dom";
import { GdprChecks } from "@/components/GdprChecks";
import { useAuth } from "@/hooks/useAuth";
import { friendlyAuthError } from "@/lib/authErrors";

export function GdprGate() {
  const { acceptGdpr, signOut } = useAuth();
  const [ageChecked, setAgeChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onContinue() {
    setErr(null);
    if (!ageChecked || !privacyChecked) {
      setErr("Confirmez votre âge et la lecture de la politique de confidentialité.");
      return;
    }
    setPending(true);
    const { error } = await acceptGdpr();
    setPending(false);
    if (error) setErr(friendlyAuthError(error));
  }

  return (
    <div className="flex min-h-dvh flex-col bg-[var(--color-bara-bg)]">
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-12">
        <h1 className="text-2xl font-bold tracking-tight">Avant d’utiliser BARA</h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-bara-muted)]">
          Le service est réservé aux personnes de 15 ans ou plus. La politique de
          confidentialité indique quelles données sont utilisées, par qui, et pendant combien
          de temps.
        </p>
        <div className="mt-6">
          <GdprChecks
            ageChecked={ageChecked}
            privacyChecked={privacyChecked}
            onAgeChange={setAgeChecked}
            onPrivacyChange={setPrivacyChecked}
          />
        </div>
        {err && (
          <p className="mt-4 text-sm text-red-600" role="alert">
            {err}
          </p>
        )}
        <button
          type="button"
          disabled={pending || !ageChecked || !privacyChecked}
          onClick={() => void onContinue()}
          className="mt-6 rounded-xl bg-orange-600 py-3 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-60"
        >
          {pending ? "Enregistrement…" : "Continuer"}
        </button>
        <button
          type="button"
          onClick={() => void signOut()}
          className="mt-3 text-sm text-[var(--color-bara-muted)] hover:underline"
        >
          Se déconnecter
        </button>
        <p className="mt-6 text-sm">
          <Link to="/mentions-legales" className="text-orange-600 hover:underline dark:text-orange-400">
            Mentions légales
          </Link>
        </p>
      </main>
    </div>
  );
}
