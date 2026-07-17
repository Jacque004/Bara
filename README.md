# BARA

Application SaaS pour étudiants : matières, tâches, planning intelligent (Supabase Edge Function), tableau de bord, mode Focus (Pomodoro) et analytics.

## Stack

- **Frontend** : React 19, TypeScript, Vite, Tailwind CSS v4, TanStack Query, React Router
- **Backend** : Supabase (PostgreSQL, Auth, Edge Functions)

## Prérequis

- Node.js 20+
- Un projet [Supabase](https://supabase.com) (gratuit)

## Configuration Supabase

1. Créez un projet Supabase.
2. Dans **SQL Editor**, exécutez les migrations SQL dans l’ordre :
   - `supabase/migrations/20250415000000_init.sql` (tables + RLS)
   - `supabase/migrations/20260415120000_realtime_tasks.sql` (Realtime sur `tasks`)
   - `supabase/migrations/20260415140000_profiles.sql` (profil utilisateur éditable)
3. **Authentication** → activez Email / mot de passe.
4. **Project Settings → API** : copiez l’URL du projet et la clé `anon` publique.

### Edge Function `generate-study-plan` (déploiement)

La fonction lit le JWT de l’utilisateur, recalcule les priorités et réécrit la table `study_plans`. Les variables **`SUPABASE_URL`** et **`SUPABASE_ANON_KEY`** sont injectées automatiquement par Supabase au runtime (ne les mettez pas en dur dans le code).

#### 1. Installer la CLI Supabase

- **Windows** : [télécharger le binaire](https://github.com/supabase/cli/releases) ou, avec Scoop : `scoop bucket add supabase https://github.com/supabase/scoop-bucket.git` puis `scoop install supabase`.
- Vérifier : `supabase --version`.

Sans installation globale, vous pouvez utiliser **`npx supabase@latest`** (voir script npm ci-dessous).

#### 2. Se connecter à Supabase

```bash
supabase login
```

Un lien s’ouvre dans le navigateur pour coller un token (compte Supabase).

#### 3. Lier ce dépôt à votre projet cloud

1. Dans le [dashboard Supabase](https://supabase.com/dashboard) : **Project Settings → General**.
2. Copier le **Reference ID** (ex. `abcdxyz123`).

À la racine du projet (`BARA/`) :

```bash
supabase link --project-ref VOTRE_REFERENCE_ID
```

Cela crée le dossier local `.supabase/` (déjà ignoré par git).

#### 4. Déployer la fonction

À la racine du projet :

```bash
npm run deploy:function
```

Si la CLI n’est pas dans le `PATH` :

```bash
npm run deploy:function:npx
```

Équivalent manuel :

```bash
supabase functions deploy generate-study-plan
```

Premier déploiement : la fonction apparaît sous **Edge Functions** dans le dashboard. Les prochains déploiements écrasent la version distante.

#### 5. Vérifier côté app

1. Utilisateur connecté dans BARA.
2. Page **Planning** → bouton **Générer le planning** (appelle `supabase.functions.invoke('generate-study-plan', { body: { user_id } })`).
3. En cas d’erreur : onglet **Edge Functions → generate-study-plan → Logs** dans Supabase.

#### 6. JWT (`verify_jwt`)

Le fichier `supabase/config.toml` fixe **`verify_jwt = true`** pour `generate-study-plan` : seules les requêtes avec un en-tête **`Authorization: Bearer`** + jeton d’accès valide sont acceptées (comportement attendu pour BARA).

---

**Je ne peux pas déployer à votre place** depuis cet environnement : il faut exécuter les commandes ci-dessus sur votre machine (ou dans votre CI) avec un compte Supabase autorisé sur le projet.

## Configuration locale

```bash
cp .env.example .env
```

Renseignez :

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

## Parcours visiteur

- **`/`** : page publique (présentation des services, sans compte).
- **`/app`** et sous-routes : réservées aux utilisateurs connectés (redirection vers `/connexion` sinon).

## Développement

```bash
npm install
npm run dev
```

Build de production :

```bash
npm run build
npm run preview
```

### PWA (installable)

Après `npm run build`, lancez `npm run preview` et ouvrez le site en **HTTPS** ou sur `localhost` : le **service worker** est généré par `vite-plugin-pwa` (mise à jour automatique des assets). Pour tester le SW pendant `npm run dev`, dans `vite.config.ts` passez `devOptions.enabled` à `true` (désactivé par défaut).

### Realtime (tâches)

Une fois la migration `20260415120000_realtime_tasks.sql` appliquée, les listes de tâches se **rafraîchissent automatiquement** si une ligne `tasks` change (autre onglet, autre appareil, ou trigger serveur), via invalidation React Query.

## Fonctionnalités

| Zone | Description |
|------|-------------|
| Auth | Inscription, connexion, réinitialisation mot de passe |
| Matières | CRUD avec couleur |
| Tâches | Types révision / examen / devoir, deadline, difficulté, statut |
| Planning | Génération via Edge Function (priorité + créneaux stricts de 25 min) |
| Dashboard | Tâches à venir, retards, progression, temps étudié, alertes |
| Focus | Pomodoro 25/5, enregistrement des sessions |
| Analytics | Temps par matière, indicateur simple d’efficacité |
| Realtime | Écoute Supabase sur `tasks` (même `user_id`) |
| PWA | Manifeste + service worker (hors `dev` par défaut) |

## Sécurité

- Les politiques RLS limitent chaque table à `auth.uid() = user_id`.
- La fonction Edge vérifie le JWT et refuse un `user_id` différent du compte connecté.

## Licence

Projet de démonstration (portfolio).
