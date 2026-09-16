# Déploiement Vercel

## Préparation

Le projet est une application Next.js App Router standard. Vercel détecte automatiquement Next.js; `vercel.json` fixe explicitement le framework et le script `npm run build`.

1. Importer le dépôt dans Vercel et sélectionner le dossier racine du projet.
2. Conserver `npm install` comme installation et `npm run build` comme commande de build.
3. Ajouter les variables de `.env.example` dans les environnements Preview et Production selon le besoin.
4. Déployer une Preview, puis renseigner `NEXT_PUBLIC_APP_URL` avec l’URL publique retenue avant de configurer Stripe.
5. Exécuter `supabase/migrations/*.sql` dans Supabase, puis ajouter l’URL Vercel aux URL autorisées Supabase.
6. Configurer le webhook Stripe vers `/api/stripe/webhook` et renseigner `STRIPE_WEBHOOK_SECRET`.

## Variables

Minimum pour connecter Supabase : `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

Pour le traitement serveur Supabase, ajouter `SUPABASE_SERVICE_ROLE_KEY` uniquement comme variable serveur Vercel; ne jamais la préfixer par `NEXT_PUBLIC_`.

Pour Stripe : `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_PRO`, `STRIPE_PRICE_AGENCY` et `NEXT_PUBLIC_APP_URL`.

Sans ces variables, le site reste déployable en mode démonstration : auth, persistance, provider vidéo et Stripe utilisent les fallbacks mock déjà documentés dans le README.

## État de la tentative depuis cet environnement

La CLI est exécutable ponctuellement via `npx vercel@latest`, mais `vercel whoami` ne peut pas lire/écrire son fichier d’authentification dans le profil système (`AppData\Roaming\com.vercel.cli\Data\auth.json`, erreur `EPERM`). Aucun `.vercel/project.json`, token `VERCEL_TOKEN` ou identifiant de projet n’est disponible. Aucun déploiement externe n’a donc été lancé et aucune URL n’a été inventée. Après authentification Vercel dans un environnement autorisé et liaison du projet, la commande standard sera `vercel` pour une Preview puis `vercel --prod` si la mise en production est souhaitée.
