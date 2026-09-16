# Architecture courte

## Flux principal

`Landing → Auth → Dashboard → Nouveau actif → choix du type → Upload manuel 10–30 images + droits → Storyboard JSON typé → Preview filigranée → Pricing / abonnement`

Les écrans sont rendus par l’App Router. Les données visibles dans le dashboard sont des fixtures de démonstration pour permettre un parcours immédiat sans service externe. Les catégories supportées sont `villa`, `rental`, `yacht`, `private_jet` et `supercar`.

## Domaine Asset

`lib/assets.ts` centralise le type discriminant, les labels, les métadonnées spécifiques, les validateurs et les fixtures. Les champs sont progressifs et optionnels lorsqu’ils sont pertinents; s’ils sont fournis, les valeurs numériques sont contrôlées par catégorie. L’upload reste volontairement manuel et la confirmation des droits est bloquante.

## Seams d’intégration

- `lib/supabase/browser.ts` et `lib/supabase/server.ts` encapsulent les clients Supabase SSR.
- `middleware.ts` rafraîchit la session Supabase sur les routes `/dashboard/*` lorsqu’un projet est configuré.
- `lib/storyboard.ts` garde un pipeline unique mais sélectionne un template nommé par type d’actif, avec captions et directions visuelles adaptées.
- `lib/video/types.ts` définit le contrat provider avec `assetType` et `metadata`. `lib/video/mock-provider.ts` est le provider local déterministe; `selectVideoProvider(assetType)` est le point de routage à remplacer par des providers spécialisés.
- `lib/video/assembler.ts` est la couture d’assemblage final (Remotion, Mux ou worker dédié).
- `lib/stripe.ts` prépare Checkout et renvoie un parcours local si `STRIPE_SECRET_KEY` est absent.
- `app/api/stripe/webhook/route.ts` valide les événements Stripe et documente l’endroit où synchroniser Supabase.

## Données et sécurité

La migration initiale crée profils, logements historiques, assets photo et jobs vidéo. `202609160002_assets.sql` introduit la table canonique `assets`, migre les propriétés existantes comme `villa`, copie les médias dans `asset_media` et rattache les jobs à `asset_id` sans casser `property_id`. Toutes les tables métier utilisent `auth.uid() = user_id` avec RLS. Les médias génériques sont rangés sous `<user_id>/...` dans le bucket privé `asset-media`.
