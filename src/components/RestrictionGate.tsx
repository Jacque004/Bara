import { DataRightsPanel } from "@/components/DataRightsPanel";
import { useAuth } from "@/hooks/useAuth";

export function RestrictionGate() {
  const { signOut } = useAuth();

  return (
    <div className="min-h-dvh bg-[var(--color-bara-bg)]">
      <main className="mx-auto w-full max-w-2xl px-4 py-12">
        <h1 className="text-2xl font-bold tracking-tight">Traitement limité</h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-bara-muted)]">
          BARA ne charge plus vos matières, tâches, sessions ni planning. Vous pouvez lever la
          limitation, télécharger vos données ou supprimer le compte.
        </p>
        <div className="mt-8">
          <DataRightsPanel mode="restricted" />
        </div>
        <button
          type="button"
          onClick={() => void signOut()}
          className="mt-6 text-sm text-[var(--color-bara-muted)] hover:underline"
        >
          Se déconnecter
        </button>
      </main>
    </div>
  );
}
