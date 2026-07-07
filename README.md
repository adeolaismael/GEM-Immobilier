## GEM Immobilier — Site Web

Application web moderne pour GEM IMMOBILIER, basée sur Next.js (App Router) et Tailwind, avec reprise des contenus de l’ancien site `https://gem-immobilier.info/` dans un nouveau design responsive.

---

## Stack technique

- **Framework**: Next.js 16 (App Router, SSG)
- **Langage**: TypeScript
- **UI / CSS**:
  - Tailwind CSS (via `@tailwindcss/postcss`)
  - Thème custom dans `src/app/globals.css` (couleurs, ombres, fonts)
- **Fonts**: Geist (`next/font/google`)
- **Images**:
  - `next/image`
  - Placeholders SVG dans `public/placeholders/*`
- **Backend / données**:
  - Supabase (PostgreSQL managé + Storage)
  - Clients Supabase browser / serveur via `@supabase/supabase-js` et `@supabase/ssr`
- **Qualité**:
  - ESLint (config Next.js) — `npm run lint`
  - TypeScript (via `next build`)
- **SEO**:
  - `metadata` dans `src/app/layout.tsx`
  - `src/app/sitemap.ts` → `sitemap.xml`
  - `src/app/robots.ts` → `robots.txt`

---

## Structure principale

- `src/app/layout.tsx`
  - Layout global HTML
  - Métadonnées (title, description, OpenGraph, robots)
  - Import `globals.css`
  - Inclusion du header et du footer sur toutes les pages

- `src/components/SiteHeader.tsx`
  - Logo texte “GEM IMMOBILIER”
  - Menu: Accueil, Nos offres, Services, À propos, Conseils
  - Icône de recherche (non branchée)
  - CTA “Nous-contactez”

- `src/components/SiteFooter.tsx`
  - Copyright dynamique
  - Liens “Mentions légales” et “Contact”

### Intégration Supabase

- `src/lib/supabase.ts`
  - `createBrowserSupabaseClient()` : client côté navigateur
  - `createServerSupabaseClient()` : client côté serveur (App Router, cookies `next/headers`)

- `src/types/index.ts`
  - Types partagés pour la base de données:
    - `BienType`, `BienStatut`
    - `Bien`, `BienPhoto`
    - `Agent`
    - `MessageContact`

- `src/lib/biens.ts`
  - Fonctions de data fetching (Server Side, async/await direct):
    - `getBiens()` : tous les biens + photos (`bien_photos`)
    - `getBienBySlug(slug)` : détail d’un bien
    - `getBiensFeatured()` : biens en vitrine (`featured = true`)
    - `getAgents()` : liste des agents

### Schéma Supabase

- `supabase/schema.sql` :
  - Types ENUM :
    - `bien_type` (`'vente' | 'location'`)
    - `bien_statut` (`'disponible' | 'sous_compromis' | 'vendu' | 'loue'`)
  - Tables :
    - `biens` : métadonnées des biens (slug, titre, prix, surface, localisation, etc.)
    - `bien_photos` : photos associées aux biens (url, ordre, `est_principale`)
    - `agents` : équipe / conseillers
    - `messages_contact` : messages envoyés via le formulaire (lié éventuellement à un bien)
  - Trigger :
    - `update_updated_at` + trigger `biens_updated_at` pour mettre à jour `updated_at` automatiquement.

### Pages (App Router)

- `src/app/page.tsx` — **Accueil**
  - Hero: “Gem Immobilier, votre agence de référence.”
  - Baseline: “Le partenaire qui sécurise vos biens et optimise vos investissements.”
  - CTA: “Découvrir les biens”, “Prendre rendez-vous”
  - Collage d’images (placeholders SVG)
  - Bloc **Offres à la une** (cartes statiques avec statut, prix, localisation)
  - Bloc **Qui nous sommes ?** (résumé + chiffres clés)
  - Grille **Services** (6 cartes, libellés alignés sur GEM PRESTATIONS)
  - Témoignages
  - Bloc **Contact rapide** (phone/email + formulaire simplifié)

- `src/app/biens/page.tsx` — **Nos offres**
  - Page Server Component qui consomme Supabase via `getBiens()`
  - Grille de cartes Tailwind pour chaque bien :
    - Photo principale (si disponible) via `bien_photos`
    - Titre, ville/quartier, prix (format XOF), type (vente/location), statut, surface, nombre de pièces
  - Gestion de l’état vide (aucun bien) avec message et lien vers la page contact

- `src/app/services/page.tsx` — **Services / GEM Prestations**
  - Contenu inspiré de la section GEM PRESTATIONS de l’ancien site:
    - Administration de biens
    - Suivi / gestion juridique et fiscale des biens
    - Recherche et mise à disposition de biens à acheter et à louer
    - Conciergerie et suivi des travaux
    - Estimation de bien immobilier
    - Vente de biens immobiliers

- `src/app/a-propos/page.tsx` — **À propos**
  - Texte repris de l’ancien site:
    - Agence agréée (Arrêté ministériel N° 14-0018 du 20 Juin 2014)
    - Adresse: Cocody, 2 Plateaux Las Palmas, Cité SICOGI Bâtiment C, Porte 35
  - Bloc “Ce que tu obtiens” + “Principes” (Clarté, Efficacité, Sécurité)

- `src/app/contact/page.tsx` — **Contact**
  - Coordonnées (téléphone, email, zone – à compléter)
  - Formulaire de contact (front uniquement, pas encore relié à un backend)

- `src/app/mentions-legales/page.tsx` — **Mentions légales**
  - Éditeur du site, hébergement, propriété intellectuelle, données personnelles (texte générique à adapter)

- `src/app/sitemap.ts`
  - Génère `sitemap.xml` à partir d’une liste de routes et de `NEXT_PUBLIC_SITE_URL`

- `src/app/robots.ts`
  - Génère `robots.txt` en exposant le sitemap

---

## Configuration d’environnement

Fichiers:

- `.env.example` (garde une valeur générique)
- `.env.local` (pour le développement local, non commité)

Variables utilisées :

```bash
NEXT_PUBLIC_SITE_URL=https://gem-immobilier.info
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Les trois variables Supabase sont à récupérer dans l’interface Supabase du projet (Settings → API).

### Supabase Storage (photos des biens)

Créez un bucket **public** nommé `bien-photos` dans Supabase :
1. Storage → New bucket
2. Nom : `bien-photos`
3. Cochez "Public bucket" pour permettre l'affichage des images

---

## Installation & commandes

Depuis le dossier `gem-immobilier-site/` :

```bash
npm install         # installation des dépendances

npm run dev         # serveur de développement (http://localhost:3000 par défaut)

npm run lint        # linting ESLint

npm run build       # build de production
npm run start       # serveur de production après build
```

---

## Prochaines étapes possibles

- Activer l’envoi du **formulaire de contact** (route API Next.js avec Supabase ou service d’email dédié).
- Ajouter une page de détail **`/biens/[slug]`** basée sur `getBienBySlug()`.
- Ajouter une interface d’administration (back-office léger) pour gérer les biens, photos et agents.
- Affiner le design en reprenant précisément les **tokens Figma** (typo exacte, palette, rayons, espacement).
- Ajouter une solution d’analytics (Plausible, Google Analytics, etc.).

