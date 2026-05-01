# RegenX — Plateforme SaaS Fitness IA

> Coach fitness IA personnalisé, disponible sur **Web** et **Mobile**. Abonnement unique 99€/mois.

## Stack Technique

| Couche | Technologie |
|---|---|
| Web Frontend | Next.js 14 (App Router) + Tailwind CSS + TypeScript |
| Mobile | React Native + Expo SDK 51 + Expo Router |
| Backend | Supabase (PostgreSQL + Auth + Storage) |
| IA | OpenAI GPT-4o (streaming) |
| Paiement | Stripe (abonnement 99€/mois) |
| Analytics | PostHog |
| Déploiement Web | Vercel |
| Déploiement Mobile | Expo EAS Build |

## Architecture du Projet

```
RegenX/
├── app/                          # Next.js App Router (Web)
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Layout principal
│   ├── globals.css
│   ├── (auth)/
│   │   ├── login/page.tsx        # Connexion
│   │   └── register/page.tsx     # Inscription
│   ├── dashboard/
│   │   ├── page.tsx              # Dashboard principal ✅
│   │   ├── coach/page.tsx        # Chat IA (streaming) ✅
│   │   ├── workouts/page.tsx     # Programmes entraînement ✅
│   │   ├── nutrition/page.tsx    # Plans nutritionnels ✅
│   │   └── progress/page.tsx     # Suivi de progression ✅
│   ├── account/page.tsx          # Compte + RGPD + abonnement ✅
│   ├── pricing/page.tsx          # Tarification ✅
│   ├── privacy/page.tsx          # Politique confidentialité ✅
│   ├── terms/page.tsx            # CGU ✅
│   ├── gdpr/page.tsx             # Droits RGPD ✅
│   └── api/
│       ├── ai/coach/route.ts     # Chat IA streaming GPT-4o ✅
│       ├── stripe/               # Webhook + checkout + billing portal ✅
│       ├── gdpr/route.ts         # Export/suppression données ✅
│       ├── workouts/route.ts     # CRUD workouts ✅
│       ├── nutrition/route.ts    # CRUD plans nutritionnels ✅
│       └── progress/route.ts     # CRUD progress tracking ✅
│
├── mobile/                       # React Native Expo
│   ├── app.json                  # Config Expo ✅
│   ├── package.json              # Dépendances Expo ✅
│   ├── eas.json                  # Config EAS Build ✅
│   ├── lib/supabase/client.ts    # Client Supabase RN (AsyncStorage) ✅
│   └── app/
│       ├── _layout.tsx           # Layout racine + AuthGuard ✅
│       ├── (auth)/
│       │   ├── _layout.tsx       # Layout auth ✅
│       │   ├── login.tsx         # Écran connexion ✅
│       │   └── register.tsx      # Écran inscription ✅
│       └── (tabs)/
│           ├── _layout.tsx       # Tab bar (5 onglets) ✅
│           ├── index.tsx         # Accueil / Dashboard ✅
│           ├── coach.tsx         # Coach IA ✅
│           ├── workouts.tsx      # Programmes entraînement ✅
│           ├── nutrition.tsx     # Plans nutritionnels ✅
│           └── progress.tsx      # Suivi de progression ✅
│
├── lib/                          # Utilitaires partagés (Web)
│   ├── supabase/
│   │   ├── client.ts             # Client navigateur ✅
│   │   └── server.ts             # Client SSR + helpers ✅
│   ├── openai.ts                 # Helper OpenAI ✅
│   ├── stripe.ts                 # Helper Stripe ✅
│   └── utils.ts                  # Utilitaires généraux ✅
│
├── supabase/migrations/
│   └── 001_initial_schema.sql    # Schéma BDD complet ✅
│
├── types/
│   └── database.ts               # Types TypeScript ✅
│
├── middleware.ts                  # Protection routes auth ✅
├── next.config.js
├── tailwind.config.ts
└── vercel.json
```

## Installation Web

```bash
npm install
cp .env.example .env.local
# Remplir les variables d'environnement
npm run dev
```

## Installation Mobile

```bash
cd mobile
npm install
# Créer .env avec les variables EXPO_PUBLIC_*
npx expo start
```

## Variables d'environnement

Voir `.env.example` pour la liste complète.

### Web (.env.local)
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_ID=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
OPENAI_API_KEY=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Mobile (.env)
```
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_API_URL=https://your-app.vercel.app
```

## Base de données

Exécuter dans votre projet Supabase :
```sql
-- supabase/migrations/001_initial_schema.sql
```

Tables créées : `profiles`, `subscriptions`, `workouts`, `nutrition_plans`, `ai_sessions`, `progress_tracking`

## Déploiement

### Web (Vercel)
```bash
vercel --prod
```

### Mobile (Expo EAS)
```bash
cd mobile
eas build --platform all --profile production
eas submit --platform all
```

## Modèle Commercial

- **Abonnement unique** : 99€/mois
- Accès illimité à toutes les fonctionnalités
- Sans engagement, résiliable à tout moment

## Conformité RGPD

- Consentement explicite à l'inscription
- Export des données : `GET /api/gdpr`
- Suppression du compte : `DELETE /api/gdpr`
- Stockage sécurisé UE (région Supabase EU)
- Politique de confidentialité complète

## Pays cibles

France, Allemagne, Espagne, Italie, Portugal, Pays-Bas, Belgique, Suisse, Royaume-Uni

## Fonctionnalités

### 🤖 Coach IA (GPT-4o)
- Chat en temps réel avec streaming
- Conseils sport, nutrition, récupération
- Gestion d'abonnement (paywall 402)

### 💪 Programmes d'entraînement
- Génération automatique par IA
- 6 types : force, cardio, HIIT, yoga, récupération, mobilité
- Suivi complétion

### 🥗 Nutrition
- Plans générés par IA
- Suivi des macros (calories, protéines, glucides, lipides)
- 6 régimes : équilibré, keto, vegan, végétarien, paleo, méditerranéen

### 📈 Progression
- Suivi quotidien : poids, masse grasse, masse musculaire
- Métriques bien-être : énergie, sommeil, stress (1-10)
- Historique 30 jours

### 💳 Stripe
- Checkout sécurisé
- Portail de gestion abonnement
- Webhooks pour synchronisation
