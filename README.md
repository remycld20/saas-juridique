# SaaS Legal AI Assistant

Application Next.js 14 pour assistant juridique IA professionnel.

## Stack Technique

- **Next.js 14** (App Router)
- **TypeScript** (strict mode)
- **Tailwind CSS** + **shadcn/ui**
- **Prisma** + **PostgreSQL**
- **NextAuth** (Credentials)
- **Zod** (validation)
- **Zustand** (state management)
- **TanStack Query** (React Query)

## Phase 0 - Setup Projet ✅

### Fichiers créés/modifiés

**Configuration:**
- `package.json` - Dépendances Next.js 14 complètes
- `tsconfig.json` - Configuration TypeScript strict
- `next.config.js` - Configuration Next.js
- `tailwind.config.ts` - Configuration Tailwind + shadcn
- `postcss.config.mjs` - Configuration PostCSS
- `.eslintrc.json` - Configuration ESLint
- `.gitignore` - Fichiers à ignorer

**Structure App Router:**
- `src/app/layout.tsx` - Layout racine
- `src/app/page.tsx` - Page d'accueil
- `src/app/globals.css` - Styles globaux + variables CSS

**Composants UI (shadcn):**
- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/label.tsx`
- `src/components/ui/textarea.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/tabs.tsx`
- `src/components/ui/dropdown-menu.tsx`

**Utilitaires:**
- `src/lib/utils.ts` - Utilitaires (cn, etc.)
- `src/lib/prisma.ts` - Client Prisma singleton

**Base de données:**
- `prisma/schema.prisma` - Schema Prisma complet avec:
  - User, Account, Session (NextAuth)
  - Case (dossiers)
  - Message (chat)
  - Document (fichiers)
  - Task (tâches)
  - Template (modèles)
  - GeneratedDocument (documents générés)

**Environnement:**
- `.env.example` - Template variables d'environnement

## Installation

1. **Installer les dépendances:**
```bash
npm install
```

2. **Configurer les variables d'environnement:**
```bash
cp .env.example .env
```

Éditer `.env` et configurer:
- `DATABASE_URL` - URL PostgreSQL
- `NEXTAUTH_SECRET` - Générer avec `openssl rand -base64 32`
- `NEXTAUTH_URL` - URL de l'application (ex: http://localhost:3000)

3. **Initialiser la base de données:**
```bash
npm run db:generate
npm run db:push
```

4. **Lancer le serveur de développement:**
```bash
npm run dev
```

## Commandes disponibles

- `npm run dev` - Serveur de développement
- `npm run build` - Build production
- `npm run start` - Serveur production
- `npm run lint` - Linter ESLint
- `npm run db:generate` - Générer Prisma Client
- `npm run db:push` - Pousser schema vers DB (dev)
- `npm run db:migrate` - Créer migration
- `npm run db:studio` - Ouvrir Prisma Studio

## Points de test Phase 0

1. **Page d'accueil:** http://localhost:3000
   - Doit afficher "SaaS Legal AI Assistant" et "Phase 0 - Setup projet terminé"

2. **Vérifier compilation:**
   - `npm run build` doit réussir sans erreurs

3. **Vérifier Prisma:**
   - `npm run db:studio` doit ouvrir l'interface Prisma

## Prochaines phases

- **Phase 1:** Auth + Layout + Navigation
- **Phase 2:** CRUD Dossiers
- **Phase 3:** Chat (MVP puis streaming)
- **Phase 4:** Documents (upload + listing)
- **Phase 5:** Tâches + Timeline + Templates

## Important - Compliance Legal

⚠️ **Ces informations sont indicatives et ne constituent pas un avis juridique. Consultez un avocat.**

L'application refuse toute aide à frauder, mentir ou contourner la loi.
