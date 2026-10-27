import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { PublicShell } from "@/components/PublicShell";
import { LEGAL } from "@/lib/legal";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-[var(--color-bara-muted)]">
        {children}
      </div>
    </section>
  );
}

export function Confidentialite() {
  return (
    <PublicShell>
      <h1 className="text-3xl font-bold tracking-tight">Politique de confidentialité</h1>
      <p className="mt-3 text-sm text-[var(--color-bara-muted)]">
        Version du {LEGAL.lastUpdated}. Cette page décrit comment BARA traite les données
        personnelles, conformément au RGPD et à la loi Informatique et Libertés.
      </p>

      <Section title="Responsable du traitement">
        <p>
          {LEGAL.publisherName}, personne physique, pour le projet personnel BARA. Pas de
          délégué à la protection des données : ce rôle n’est pas exigé pour ce traitement.
        </p>
        <p>
          Contact :{" "}
          <a
            href={`mailto:${LEGAL.contactEmail}`}
            className="text-orange-600 hover:underline dark:text-orange-400"
          >
            {LEGAL.contactEmail}
          </a>
          . Les demandes liées à vos droits reçoivent une réponse dans un délai d’un mois.
        </p>
      </Section>

      <Section title="Données collectées">
        <p>Compte : adresse e-mail, mot de passe (hashé par l’hébergeur, jamais lisible dans l’application), date de création, horodatage de la confirmation d’âge et de la lecture de cette politique.</p>
        <p>Profil facultatif : prénom, nom, URL d’avatar.</p>
        <p>Contenus que vous saisissez : matières, tâches (titre, type, échéance, difficulté, statut), sessions de travail (date, durée), planning généré.</p>
        <p>Données techniques : jeton de session dans le navigateur, préférence de thème, réglages de planning, indicateur de fermeture du guide de démarrage.</p>
        <p>
          Connexion {LEGAL.oauthProviderName}, seulement si vous la choisissez : adresse e-mail
          et, si le fournisseur les transmet, nom et photo.
        </p>
      </Section>

      <Section title="Finalités et bases légales">
        <p>
          <strong className="font-semibold">Fournir le service.</strong> Compte, profil, matières,
          tâches, sessions et planning : exécution du service que vous demandez (article 6.1.b).
        </p>
        <p>
          <strong className="font-semibold">Sécurité.</strong> Session, contrôle d’accès et
          journaux techniques de l’hébergeur : intérêt légitime à protéger les comptes (article
          6.1.f).
        </p>
        <p>
          <strong className="font-semibold">Rappel par e-mail.</strong> Uniquement quand vous
          cliquez sur « Recevoir par mail ». Aucun envoi automatique, aucune prospection
          (article 6.1.b).
        </p>
        <p>
          <strong className="font-semibold">Âge.</strong> La confirmation que vous avez{" "}
          {LEGAL.minAge} ans ou plus est conservée pour respecter l’article 8 du RGPD et
          l’article 7-1 de la loi Informatique et Libertés (article 6.1.c).
        </p>
      </Section>

      <Section title="Destinataires et transferts">
        <p>Aucun partage entre utilisateurs. Les destinataires sont des sous-traitants techniques.</p>
        <p>
          <strong className="font-semibold">{LEGAL.dataHostName}</strong> héberge la base, l’authentification
          et les fonctions, dans la région {LEGAL.dataRegionLabel}. Les données du compte restent
          dans l’Union européenne.
        </p>
        <p>
          <strong className="font-semibold">{LEGAL.siteHostName}</strong>, {LEGAL.siteHostAddress},
          sert les fichiers du site. Les journaux d’accès peuvent enregistrer votre adresse IP
          aux États-Unis.
        </p>
        <p>
          <strong className="font-semibold">{LEGAL.emailProcessorName}</strong> ({LEGAL.emailProcessorRegion})
          reçoit votre e-mail et les titres des tâches non terminées seulement lors d’un rappel
          demandé. Le transfert hors Union européenne s’appuie sur les clauses contractuelles
          types de ce prestataire. BARA n’en garde pas de copie.
        </p>
        <p>
          <strong className="font-semibold">{LEGAL.oauthProviderName}</strong> intervient seulement
          si vous choisissez cette connexion. Les polices de caractères sont hébergées avec
          l’application : aucune requête vers les serveurs de polices de Google.
        </p>
      </Section>

      <Section title="Durées de conservation">
        <p>Les données du compte et les contenus sont conservés tant que le compte est ouvert, puis supprimés dès sa clôture (suppression en cascade).</p>
        <p>Le jeton de session disparaît à la déconnexion ou à la suppression du compte. Les réglages locaux liés au compte sont effacés à la clôture. Le thème du navigateur, commun à l’appareil, est conservé.</p>
        <p>Les journaux techniques de l’hébergeur et les traces d’acheminement de {LEGAL.emailProcessorName} suivent la durée propre à ces prestataires, limitée à la sécurité et à la preuve d’envoi.</p>
      </Section>

      <Section title="Stockage dans le navigateur">
        <p>BARA n’utilise pas de cookie de mesure d’audience ni de publicité. Le stockage local sert au fonctionnement que vous demandez : session, thème, réglages de planning, guide de démarrage. Ces éléments sont décrits ici, sans bandeau de consentement, parce qu’ils sont nécessaires au service.</p>
      </Section>

      <Section title="Mineurs">
        <p>
          Le service est réservé aux personnes de {LEGAL.minAge} ans ou plus. Aucune donnée
          n’est demandée en connaissance de cause pour un enfant plus jeune. Si un compte a été
          créé par erreur, écrivez à {LEGAL.contactEmail} ou supprimez-le depuis le profil.
        </p>
      </Section>

      <Section title="Sécurité">
        <p>Chaque ligne n’est lisible que par le compte qui l’a créée. Les fonctions serveur vérifient le jeton de session. Les mots de passe ne sont pas stockés en clair par l’application. Les échanges passent par HTTPS.</p>
      </Section>

      <Section title="Vos droits">
        <p>Accès et portabilité : bouton « Télécharger mes données » sur la page Profil (fichier JSON).</p>
        <p>Rectification : prénom, nom et avatar sur le profil. Changement d’e-mail depuis la même page, avec confirmation.</p>
        <p>Effacement : « Supprimer mon compte » efface le compte, le profil, les matières, les tâches, les sessions et le planning.</p>
        <p>Limitation : « Limiter le traitement » conserve les données mais bloque l’affichage, le planning et les e-mails jusqu’à ce que vous leviez la limitation.</p>
        <p>Opposition : il n’y a pas de prospection. Pour le rappel e-mail, il suffit de ne pas le demander. Pour le reste du service, nécessaire au compte, l’opposition se traduit par la suppression du compte.</p>
        <p>
          Vous pouvez aussi saisir la CNIL, 3 place de Fontenoy, TSA 80715, 75334 Paris Cedex 07,{" "}
          <a
            href="https://www.cnil.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="text-orange-600 hover:underline dark:text-orange-400"
          >
            cnil.fr
          </a>
          .
        </p>
      </Section>

      <Section title="Modification">
        <p>
          Une nouvelle version de cette politique redemande une confirmation à la connexion.
          Version actuelle : {LEGAL.policyVersion}.
        </p>
      </Section>

      <p className="mt-12 text-center">
        <Link to="/" className="text-sm font-medium text-orange-600 hover:underline dark:text-orange-400">
          ← Retour à l’accueil
        </Link>
      </p>
    </PublicShell>
  );
}
