import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthShell } from "@/components/AuthShell";
import { GdprChecks } from "@/components/GdprChecks";
import { PasswordField } from "@/components/PasswordField";
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
  const [ageChecked, setAgeChecked] = useState(false);
  const [privacyChecked, setPrivacyChecked] = useState(false);
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
    if (!ageChecked || !privacyChecked) {
      setErr("Confirmez votre âge et la lecture de la politique de confidentialité.");
      return;
    }
    setPending(true);
    const { error } = await signUp(email, password);
    setPending(false);
    if (error) setErr(error.message);
    else setOk(true);
  }

  return (
    <AuthShell
      title="Inscription"
      subtitle="Un compte gratuit pour suivre tes cours, tes échéances et ton rythme."
    >
      {ok ? (
        <p className="mt-6 text-center text-sm leading-relaxed text-[var(--color-bara-muted)]">
          Vérifiez votre boîte mail pour confirmer votre compte, puis{" "}
          <Link to="/connexion" className="text-orange-600 hover:underline dark:text-orange-400">
            connectez-vous
          </Link>
          .
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="register-email" className="block text-sm font-medium">
              E-mail
            </label>
            <input
              id="register-email"
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
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {password.length > 0 && (
            <div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-black/10 dark:bg-white/10">
                <div
                  className={`h-2 rounded-full transition-all ${strength.color}`}
                  style={{ width: strength.width }}
                />
              </div>
              <p className="mt-1 text-xs text-[var(--color-bara-muted)]">
                Force : {strength.label}. Il faut 8 caractères, une majuscule, une
                minuscule, un chiffre et un symbole.
              </p>
            </div>
          )}
          {err && (
            <p className="text-sm text-red-600" role="alert">
              {err}
            </p>
          )}
          <GdprChecks
            ageChecked={ageChecked}
            privacyChecked={privacyChecked}
            onAgeChange={setAgeChecked}
            onPrivacyChange={setPrivacyChecked}
            ageId="register-age"
            privacyId="register-privacy"
          />
          <button
            type="submit"
            disabled={pending || strength.label !== "Fort" || !ageChecked || !privacyChecked}
            className="bara-cta w-full rounded-xl bg-orange-600 py-3 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-60"
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
    </AuthShell>
  );
}
