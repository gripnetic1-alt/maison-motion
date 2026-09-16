# Maison Motion

Maison Motion est un starter SaaS Next.js pour créer une **vidéo cinématique pour actifs premium à partir de vos photos**. L’expérience est pensée pour les propriétaires, agents, brokers et agences : un regard éditorial, une création guidée et un aperçu partageable.

Actifs supportés : villa, location, yacht, jet privé et supercar. Le parcours est unique pour les cinq catégories; seuls le vocabulaire du storyboard et les métadonnées proposées changent.

## Démarrer en local

```bash
npm install
npm run dev
```

Puis ouvrir [http://localhost:3000](http://localhost:3000). Le parcours fonctionne sans secrets : landing → créer un espace → dashboard → nouveau film → choisir un actif → upload manuel → storyboard spécialisé → aperçu filigrané. Chaque image est choisie manuellement : rien n’est scrapé, auto-importé ou collecté.

Commandes de vérification :

```bash
npm run build
npm run typecheck
npm run lint
npm test
```

## Services optionnels

Copier `.env.example` vers `.env.local`.

### Supabase

Renseigner `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`, puis exécuter les migrations dans l’ordre dans le SQL Editor Supabase. `202609160002_assets.sql` est la migration canonique du modèle générique `assets`; elle convertit les `properties` existantes en villas, migre les médias vers `asset_media` et rattache les jobs via `asset_id`, tout en conservant les colonnes historiques pour compatibilité. Le bucket privé canonique est `asset-media`. Le service role n’est destiné qu’aux routes serveur/worker et ne doit jamais être exposé au navigateur.

### Stripe

Renseigner `STRIPE_SECRET_KEY`, les trois price IDs et `STRIPE_WEBHOOK_SECRET`. Le helper `lib/stripe.ts` couvre Checkout; le portail client et la persistance des statuts sont les prochains branchements naturels. Sans secret, Checkout reste en mode mock et retourne un lien local.

## Ce qui est fonctionnel maintenant

- Landing responsive avec direction visuelle éditoriale premium et grille des cinq catégories.
- Shell d’authentification avec états inscription/connexion et feedback de soumission.
- Dashboard responsive avec bibliothèque d’actifs premium, activité récente, plan et CTA.
- Création d’actif avec sélection villa/location/yacht/jet privé/supercar, champs metadata progressifs, labels accessibles, upload multi-fichiers, filtre images, compteur 10–30 et validation des droits.
- Générateur de storyboard JSON déterministe avec template nommé pour chaque catégorie, affichage des scènes et preview filigranée locale.
- Modèle `Asset` discriminé, fixtures, validation metadata, contrats `VideoProvider` enrichis et sélection de provider par type.
- Clients Supabase browser/server, middleware de session, migrations SQL avec RLS et bucket privé.
- Helper Stripe Checkout + squelette webhook avec fallback mock.
- Tests unitaires des validateurs, du modèle Asset et du storyboard.

## Ce qui reste mocké

- Auth : la soumission d’auth ouvre un espace de démonstration; brancher `supabase.auth.signUp` / `signInWithPassword`.
- Persistance des actifs, assets photo et jobs : les écrans utilisent encore des fixtures et le navigateur local.
- Génération image-vers-vidéo : `mock-local` réutilise une preview visuelle; remplacer par un provider asynchrone et un worker. Le seam `selectVideoProvider(assetType)` est prêt pour des providers spécialisés.
- Assemblage, audio, export et téléchargement final : contrat présent, implémentation non branchée.
- Stripe Portal et synchronisation persistée des abonnements : webhook skeleton prêt à compléter.

## Arborescence

```text
app/                 routes App Router, landing, auth, dashboard, pricing, webhook
components/          shell et icônes SVG accessibles
lib/                 modèle Asset, validateurs, storyboard, seams vidéo, Supabase, Stripe
supabase/migrations/ schéma initial, migration Asset et RLS
tests/               tests unitaires TS
docs/                architecture courte
```

Voir [docs/architecture.md](docs/architecture.md) pour le plan d’intégration.

## Déploiement Vercel

Le projet est prêt pour un import Vercel : `vercel.json` fixe Next.js et `npm run build`. Les étapes de liaison Supabase, de configuration des variables Preview/Production et de webhook Stripe sont détaillées dans [docs/deployment.md](docs/deployment.md). Aucun secret n’est inclus dans le dépôt. Sans variables externes, le déploiement reste utilisable en mode démonstration mock.
