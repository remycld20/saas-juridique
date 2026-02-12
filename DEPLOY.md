# 🚀 Guide de déploiement - SaaS Legal AI Assistant

## ✅ Checklist complète pour local ET production

### 📋 Prérequis

- [ ] Compte Supabase créé
- [ ] Projet Supabase avec base de données PostgreSQL
- [ ] Compte Vercel (gratuit suffit)
- [ ] Repository Git (GitHub/GitLab/Bitbucket)

---

## 🔧 Configuration locale

### 1. Cloner et installer

```bash
git clone <votre-repo>
cd "SaaS Legal AI Assistant UI"
npm install
```

### 2. Créer `.env.local`

```bash
cp .env.example .env.local
```

### 3. Récupérer les credentials Supabase

1. Allez sur https://supabase.com
2. Ouvrez votre projet
3. **Settings > Database**
4. **Connection string > URI** (pas "Session mode")
5. Copiez la connection string

**Format attendu :**
```
postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1
```

### 4. Configurer `.env.local`

```env
# Database - Connection string Supabase (avec pooling)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Database - Direct connection (pour migrations Prisma)
# Récupérez depuis Supabase > Settings > Database > Connection string > Direct connection
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# NextAuth - OBLIGATOIRE
# Générer avec: openssl rand -base64 32
NEXTAUTH_SECRET="votre-secret-genere-avec-openssl"

# NextAuth URL - OBLIGATOIRE
# Vérifiez le port après "npm run dev"
NEXTAUTH_URL="http://localhost:3000"
```

**⚠️ IMPORTANT - DIRECT_URL :**
- Nécessaire pour les migrations Prisma avec Supabase
- Utilisez la connection string "Direct connection" (port 5432, pas 6543)
- Sans `?pgbouncer=true`

### 5. Générer NEXTAUTH_SECRET

```bash
# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Mac/Linux
openssl rand -base64 32
```

### 6. Initialiser la base de données

```bash
# Générer Prisma Client
npm run db:generate

# Créer les tables dans Supabase
npm run db:push

# Vérifier que tout fonctionne
npm run db:init
```

**✅ Résultat attendu :**
```
✅ Connexion réussie
📊 Tables trouvées: 9
   - Account
   - Case
   - Document
   - GeneratedDocument
   - Message
   - Session
   - Task
   - Template
   - User
✅ Toutes les tables sont présentes
```

### 7. Lancer l'application

```bash
npm run dev
```

**Vérifiez le port dans le terminal :**
```
▲ Next.js 14.2.18
- Local:        http://localhost:3000
```

**Si le port est différent (3001, 3002, etc.) :**
- Mettez à jour `NEXTAUTH_URL` dans `.env.local`
- Exemple : `NEXTAUTH_URL="http://localhost:3001"`

### 8. Tester l'authentification

1. Ouvrez http://localhost:3000 (ou le port affiché)
2. Allez sur `/signup`
3. Créez un compte
4. Connectez-vous sur `/login`

**✅ Si ça fonctionne :**
- Le compte est créé dans Supabase
- Vous pouvez vous connecter
- Vous êtes redirigé vers `/dashboard`

---

## 🌐 Configuration Vercel (Production)

### 1. Préparer le repository

```bash
# Vérifier que .env.local n'est PAS commité
git status

# Si .env.local apparaît, il est déjà dans .gitignore (normal)
```

### 2. Connecter Vercel au repository

1. Allez sur https://vercel.com
2. **Add New Project**
3. Importez votre repository Git
4. Vercel détecte automatiquement Next.js

### 3. Configurer les variables d'environnement

Dans Vercel > Votre projet > **Settings > Environment Variables**, ajoutez :

| Variable | Valeur | Où trouver |
|----------|--------|------------|
| `DATABASE_URL` | `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1` | Supabase > Settings > Database > Connection string > URI |
| `DIRECT_URL` | `postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres` | Supabase > Settings > Database > Connection string > Direct connection |
| `NEXTAUTH_SECRET` | `[votre-secret-genere]` | Générer avec `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://votre-projet.vercel.app` | Après le premier deploy (voir ci-dessous) |

**⚠️ IMPORTANT :**
- `DATABASE_URL` = Connection pooling (port 6543, avec `?pgbouncer=true`)
- `DIRECT_URL` = Direct connection (port 5432, sans `?pgbouncer=true`)
- `NEXTAUTH_URL` = URL complète de votre app Vercel (https://...)

### 4. Premier déploiement

```bash
# Push sur votre repository
git add .
git commit -m "Ready for production"
git push
```

Vercel déploie automatiquement.

### 5. Récupérer l'URL Vercel

**Option 1 - Après le deploy :**
1. Vercel > Votre projet > Deployments
2. Cliquez sur le dernier deployment
3. L'URL est affichée en haut
4. Format : `https://votre-projet-xyz.vercel.app`

**Option 2 - Dans Settings :**
1. Vercel > Votre projet > Settings > Domains
2. Copiez le domaine par défaut
3. Format : `https://votre-projet.vercel.app`

### 6. Mettre à jour NEXTAUTH_URL

1. Vercel > Votre projet > Settings > Environment Variables
2. Modifiez `NEXTAUTH_URL`
3. Valeur : `https://votre-projet.vercel.app` (sans trailing slash)
4. **Redeploy** (Vercel > Deployments > ... > Redeploy)

### 7. Vérifier le build

Dans Vercel > Deployments, vérifiez que :
- ✅ Build succeeded
- ✅ No errors dans les logs
- ✅ Les variables d'environnement sont chargées

### 8. Tester en production

1. Ouvrez `https://votre-projet.vercel.app`
2. Testez `/signup` et `/login`
3. Vérifiez dans Supabase que les données sont créées

---

## 🔍 Diagnostic des problèmes

### Erreur: "The table public.User does not exist"

**Cause :** Les tables n'ont pas été créées dans Supabase

**Solution :**
```bash
# En local
npm run db:push

# Vérifier
npm run db:init
```

### Erreur: "DATABASE_URL is not set"

**Cause :** Variable d'environnement manquante

**Solution :**
- Local : Vérifiez `.env.local`
- Production : Vérifiez Vercel > Settings > Environment Variables

### Erreur: "Configuration (Server error)" dans le navigateur

**Causes possibles :**
1. `NEXTAUTH_SECRET` manquant
2. `NEXTAUTH_URL` incorrect (port mismatch en local)
3. Tables non créées

**Solution :**
1. Vérifiez les logs du terminal (`npm run dev`)
2. Vérifiez que toutes les variables sont définies
3. Exécutez `npm run db:push`

### Erreur: Connection timeout avec Supabase

**Cause :** Mauvaise connection string ou firewall

**Solution :**
1. Vérifiez que vous utilisez la bonne connection string
2. Vérifiez que `DIRECT_URL` est défini pour les migrations
3. Vérifiez les paramètres de sécurité Supabase (Settings > Database > Connection pooling)

### Build Vercel échoue

**Causes possibles :**
1. Prisma Client non généré
2. Variables d'environnement manquantes
3. Erreur TypeScript

**Solution :**
1. Vérifiez les logs de build dans Vercel
2. Ajoutez `"postinstall": "prisma generate"` dans `package.json` (déjà fait)
3. Vérifiez que toutes les variables sont définies

---

## 📝 Commandes utiles

```bash
# Générer Prisma Client
npm run db:generate

# Créer les tables (sans migration)
npm run db:push

# Créer une migration
npm run db:migrate

# Vérifier la base de données
npm run db:init

# Ouvrir Prisma Studio
npm run db:studio

# Build local (test production)
npm run build
npm run start
```

---

## ✅ Checklist finale

**Local :**
- [ ] `.env.local` créé avec toutes les variables
- [ ] `DATABASE_URL` = Connection string Supabase (pooling)
- [ ] `DIRECT_URL` = Connection string Supabase (direct)
- [ ] `NEXTAUTH_SECRET` généré et ajouté
- [ ] `NEXTAUTH_URL` = Port correct (vérifié après `npm run dev`)
- [ ] `npm run db:push` exécuté avec succès
- [ ] `npm run db:init` confirme que les tables existent
- [ ] `/signup` crée un utilisateur
- [ ] `/login` fonctionne

**Production (Vercel):**
- [ ] Variables d'environnement ajoutées dans Vercel
- [ ] `DATABASE_URL` = Connection string Supabase (pooling)
- [ ] `DIRECT_URL` = Connection string Supabase (direct)
- [ ] `NEXTAUTH_SECRET` ajouté
- [ ] `NEXTAUTH_URL` = URL Vercel complète (https://...)
- [ ] Build Vercel réussit
- [ ] `/signup` et `/login` fonctionnent sur l'URL de production
- [ ] Les données sont visibles dans Supabase

---

## 🎯 Résultat attendu

✅ **Local :** L'app fonctionne sur `http://localhost:3000` (ou autre port)
✅ **Production :** L'app fonctionne sur `https://votre-projet.vercel.app`
✅ **Base de données :** Une seule base Supabase utilisée partout
✅ **Authentification :** Signup et login fonctionnent en local ET en production
