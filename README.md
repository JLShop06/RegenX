# RegenX - SaaS Fitness IA Platform
<!-- Deploy trigger: 2026-05-01 -->

RegenX est une plateforme SaaS complète de coaching fitness par IA, disponible sur Web et Mobile.

## Stack

- **Web**: Next.js 14 (App Router) + Tailwind CSS + TypeScript
- **Mobile**: React Native Expo
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Paiement**: Stripe (99EUR/mois)
- **IA**: OpenAI GPT-4o
- **Analytics**: PostHog
- **Déploiement Web**: Vercel
- **Déploiement Mobile**: Expo EAS

## Structure

```
/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Pages auth (login, register)
│   ├── (dashboard)/        # Pages protegees
│   ├── api/                # API Routes
│   │   ├── ai/             # Chat IA, generation workout
│   │   ├── stripe/         # Webhook, checkout, billing
│   │   └── gdpr/           # Export/suppression donnees
│   ├── pricing/            # Page tarifs
│   ├── privacy/            # Politique confidentialite
│   ├── terms/              # CGU
│   └── gdpr/               # Droits RGPD
├── mobile/                 # React Native Expo
│   └── app/
│       ├── (auth)/         # Login/Register mobile
│       └── (tabs)/         # Dashboard, Coach, Sport, Nutrition, Progres
├── lib/                    # Utilitaires
│   ├── supabase/           # Client Supabase
│   ├── stripe.ts           # Stripe helpers
│   ├── openai.ts           # OpenAI helpers
│   └── utils.ts            # Utilitaires generaux
├── supabase/               # Migrations SQL
└── types/                  # Types TypeScript

```

## Installation

### Web
```bash
npm install
cp .env.example .env.local
# Remplir les variables d environnement
npm run dev
```

### Mobile
```bash
cd mobile
npm install
# Creer .env avec EXPO_PUBLIC_SUPABASE_URL et EXPO_PUBLIC_SUPABASE_ANON_KEY
npx expo start
```

## Variables d environnement

Voir `.env.example` pour la liste complete.

## Base de données

Executer le fichier `supabase/migrations/001_initial_schema.sql` dans votre projet Supabase.

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

## Business Model

- Abonnement unique: **99EUR/mois**
- Acces illimite a toutes les fonctionnalites
- Sans engagement, resiliable a tout moment

## Conformite RGPD

- Consentement explicite a l inscription
- Export des donnees (GET /api/gdpr)
- Suppression du compte (DELETE /api/gdpr)
- Stockage securise UE (Supabase EU region)
- Politique de confidentialite complete

## Pays cibles

France, Allemagne, Espagne, Italie, Portugal, Pays-Bas, Belgique, Suisse, Royaume-Uni
