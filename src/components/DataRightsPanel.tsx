import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { friendlyAuthError } from "@/lib/authErrors";
import {
  downloadAccountExport,
  exportAccountData,
  invokeDeleteAccount,
} from "@/lib/api";
import { clearAccountLocalData } from "@/lib/gdpr";
import { LEGAL } from "@/lib/legal";

export function DataRightsPanel({ mode }: { mode: "full" | "restricted" }) {
  const { user, signOut, updateEmail, restrictProcessing, liftProcessingRestriction } = useAuth();
  const navigate = useNavigate();
  const uid = user?.id;
  const [exportPending, setExportPending] = useState(false);
  const [exportErr, setExportErr] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [emailOk, setEmailOk] = useState(false);
  const [emailPending, setEmailPending] = useState(false);
  const [restrictArmed, setRestrictArmed] = useState(false);
  const [restrictErr, setRestrictErr] = useState<string | null>(null);
  const [restrictPending, setRestrictPending] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [deleteErr, setDeleteErr] = useState<string | null>(null);
  const [deletePending, setDeletePending] = useState(false);

  const emailMatches =
    confirmEmail.trim().toLowerCase() === (user?.email ?? "").trim().toLowerCase() &&
    confirmEmail.trim().length > 0;

  async function onExport() {
    if (!uid || !user) return;
    setExportPending(true);
    setExportErr(null);
    try {
      const meta = user.user_metadata ?? {};
      const data = await exportAccountData(uid, {
        email: user.email ?? null,
        created_at: user.created_at ?? null,
        age_confirmed_at:
          typeof meta.age_confirmed_at === "string" ? meta.age_confirmed_at : null,
        privacy_accepted_at:
          typeof meta.privacy_accepted_at === "string" ? meta.privacy_accepted_at : null,
        privacy_policy_version:
          typeof meta.privacy_policy_version === "string" ? meta.privacy_policy_version : null,
      });
      downloadAccountExport(data);
    } catch (e) {
      setExportErr(e instanceof Error ? e.message : "Export impossible.");
    } finally {
      setExportPending(false);
    }
  }

  async function onEmail(e: FormEvent) {
    e.preventDefault();
    setEmailErr(null);
    setEmailOk(false);
    if (!newEmail.includes("@")) {
      setEmailErr("Indiquez une adresse e-mail valide.");
      return;
    }
    setEmailPending(true);
    const { error } = await updateEmail(newEmail.trim());
    setEmailPending(false);
    if (error) {
      setEmailErr(friendlyAuthError(error));
      return;
    }
    setNewEmail("");
    setEmailOk(true);
  }

  async function onRestrict() {
    setRestrictErr(null);
    setRestrictPending(true);
    const { error } = await restrictProcessing();
    setRestrictPending(false);
    if (error) setRestrictErr(friendlyAuthError(error));
  }

  async function onLift() {
    setRestrictErr(null);
    setRestrictPending(true);
    const { error } = await liftProcessingRestriction();
    setRestrictPending(false);
    if (error) setRestrictErr(friendlyAuthError(error));
  }

  async function onDelete() {
    if (!uid || !emailMatches) return;
    setDeleteErr(null);
    setDeletePending(true);
    try {
      await invokeDeleteAccount();
      clearAccountLocalData(uid);
      await signOut();
      navigate("/", { replace: true, state: { accountDeleted: true } });
    } catch (e) {
      setDeleteErr(e instanceof Error ? e.message : "Suppression impossible.");
      setDeletePending(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-6">
        <h2 className="font-semibold">Accès et portabilité</h2>
        <p className="mt-2 text-sm text-[var(--color-bara-muted)]">
          Téléchargez un fichier JSON avec votre compte, votre profil, vos matières, vos tâches,
          vos sessions et votre planning. Le mot de passe n’y figure pas.
        </p>
        {exportErr && <p className="mt-3 text-sm text-red-600">{exportErr}</p>}
        <button
          type="button"
          disabled={!uid || exportPending}
          onClick={() => void onExport()}
          className="mt-4 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-60"
        >
          {exportPending ? "Préparation…" : "Télécharger mes données"}
        </button>
      </section>

      {mode === "full" && (
        <section className="rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-6">
          <h2 className="font-semibold">Changer d’e-mail</h2>
          <p className="mt-2 text-sm text-[var(--color-bara-muted)]">
            Un lien de confirmation est envoyé à la nouvelle adresse. L’ancienne peut recevoir un
            avis.
          </p>
          <form onSubmit={(e) => void onEmail(e)} className="mt-4 space-y-3">
            <div>
              <label htmlFor="new-email" className="text-sm font-medium">
                Nouvelle adresse
              </label>
              <input
                id="new-email"
                type="email"
                required
                autoComplete="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[var(--color-bara-border)] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            {emailErr && <p className="text-sm text-red-600">{emailErr}</p>}
            {emailOk && (
              <p className="text-sm text-green-600 dark:text-green-400">
                Vérifiez la nouvelle boîte mail pour confirmer le changement.
              </p>
            )}
            <button
              type="submit"
              disabled={emailPending}
              className="rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-60"
            >
              {emailPending ? "Envoi…" : "Mettre à jour l’e-mail"}
            </button>
          </form>
        </section>
      )}

      <section className="rounded-2xl border border-[var(--color-bara-border)] bg-[var(--color-bara-surface)] p-6">
        <h2 className="font-semibold">Limitation du traitement</h2>
        <p className="mt-2 text-sm text-[var(--color-bara-muted)]">
          {mode === "restricted"
            ? "Vos données restent stockées, mais BARA ne les affiche plus et ne lance ni planning ni e-mail."
            : "Vous pouvez conserver vos données tout en bloquant leur affichage, le planning et les e-mails, jusqu’à ce que vous leviez la limitation."}
        </p>
        {restrictErr && <p className="mt-3 text-sm text-red-600">{restrictErr}</p>}
        {mode === "restricted" ? (
          <button
            type="button"
            disabled={restrictPending}
            onClick={() => void onLift()}
            className="mt-4 rounded-lg bg-orange-600 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-500 disabled:opacity-60"
          >
            {restrictPending ? "Mise à jour…" : "Lever la limitation"}
          </button>
        ) : restrictArmed ? (
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              disabled={restrictPending}
              onClick={() => void onRestrict()}
              className="rounded-lg border border-orange-600 px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-600/10 disabled:opacity-60 dark:text-orange-300"
            >
              {restrictPending ? "Mise à jour…" : "Confirmer la limitation"}
            </button>
            <button
              type="button"
              onClick={() => setRestrictArmed(false)}
              className="rounded-lg px-4 py-2 text-sm text-[var(--color-bara-muted)] hover:underline"
            >
              Annuler
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setRestrictArmed(true)}
            className="mt-4 rounded-lg border border-[var(--color-bara-border)] px-4 py-2 text-sm font-semibold hover:bg-black/[0.03] dark:hover:bg-white/[0.05]"
          >
            Limiter le traitement
          </button>
        )}
      </section>

      <section className="rounded-2xl border border-red-500/40 bg-[var(--color-bara-surface)] p-6">
        <h2 className="font-semibold text-red-700 dark:text-red-400">Supprimer mon compte</h2>
        <p className="mt-2 text-sm text-[var(--color-bara-muted)]">
          La suppression est définitive : compte, profil, matières, tâches, sessions et planning.
          Vous pouvez aussi écrire à{" "}
          <a
            href={`mailto:${LEGAL.contactEmail}`}
            className="text-orange-600 hover:underline dark:text-orange-400"
          >
            {LEGAL.contactEmail}
          </a>
          .
        </p>
        <label htmlFor="confirm-delete-email" className="mt-4 block text-sm font-medium">
          Saisissez votre e-mail pour confirmer
        </label>
        <input
          id="confirm-delete-email"
          type="email"
          autoComplete="off"
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-[var(--color-bara-border)] bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-red-500"
        />
        {deleteErr && <p className="mt-3 text-sm text-red-600">{deleteErr}</p>}
        <button
          type="button"
          disabled={!emailMatches || deletePending}
          onClick={() => void onDelete()}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-500 disabled:opacity-60"
        >
          {deletePending ? "Suppression…" : "Supprimer définitivement"}
        </button>
        <p className="mt-4 text-sm">
          <Link
            to="/confidentialite"
            className="text-orange-600 hover:underline dark:text-orange-400"
          >
            Politique de confidentialité
          </Link>
        </p>
      </section>
    </div>
  );
}
