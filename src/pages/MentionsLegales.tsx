import { Link } from "react-router-dom";
import { PublicShell } from "@/components/PublicShell";
import { LEGAL } from "@/lib/legal";

export function MentionsLegales() {
  return (
    <PublicShell>
      <h1 className="text-3xl font-bold tracking-tight">Mentions légales</h1>
      <p className="mt-3 text-sm leading-relaxed text-[var(--color-bara-muted)]">
        Informations publiées au titre de l’article 6 de la loi pour la confiance dans
        l’économie numérique.
      </p>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Éditeur</h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-bara-muted)]">
          {LEGAL.publisherName}, personne physique, projet personnel non professionnel. Directeur
          de la publication : {LEGAL.publisherName}.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-bara-muted)]">
          Contact :{" "}
          <a
            href={`mailto:${LEGAL.contactEmail}`}
            className="text-orange-600 hover:underline dark:text-orange-400"
          >
            {LEGAL.contactEmail}
          </a>
          . L’adresse postale et le téléphone ne sont pas affichés. Site : {LEGAL.siteUrl}
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Hébergement du site</h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-bara-muted)]">
          {LEGAL.siteHostName}, {LEGAL.siteHostAddress}.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">Hébergement des données</h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-bara-muted)]">
          {LEGAL.dataHostName}, région {LEGAL.dataRegionLabel}. Les traitements sont décrits dans
          la{" "}
          <Link
            to="/confidentialite"
            className="text-orange-600 hover:underline dark:text-orange-400"
          >
            politique de confidentialité
          </Link>
          .
        </p>
      </section>

      <p className="mt-12 text-center">
        <Link to="/" className="text-sm font-medium text-orange-600 hover:underline dark:text-orange-400">
          ← Retour à l’accueil
        </Link>
      </p>
    </PublicShell>
  );
}
