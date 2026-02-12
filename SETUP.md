# Checklist de configuration - SaaS Legal AI Assistant

## 🔧 Configuration locale

### 1. Variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```bash
cp .env.example .env.local
```

Éditez `.env.local` et remplissez :

```env
# Database - Connection string Supabase
DATABASE_URL="postgresql://postgres:[VOTRE-MOT-DE-PASSE]@[HOST]:5432/postgres?pgbouncer=true&connection_limit=1"

# NextAuth - OBLIGATOIRE
# Générer avec: openssl rand -base64 32
NEXTAUTH_SECRET="votre-secret-genere-avec-openssl"

# NextAuth URL - OBLIGATOIRE
# Vérifiez le port avec: npm run dev
# Si le serveur dit "Ready on http://localhost:3001", utilisez 3001
NEXTAUTH_URL="http://localhost:3000"
```

**⚠️ IMPORTANT - Port local :**
- Si le port 3000 est déjà utilisé, Next.js utilisera 3001, 3002, etc.
- Vérifiez le port dans le terminal après `npm run dev`
- Mettez à jour `NEXTAUTH_URL` avec le bon port (ex: `http://localhost:3001`)

### 2. Générer NEXTAUTH_SECRET

```bash
# Sur Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Sur Mac/Linux
openssl rand -base64 32
```

### 3. Récupérer DATABASE_URL depuis Supabase

1. Allez sur https://supabase.com
2. Ouvrez votre projet
3. Settings > Database
4. Connection string > URI
5. Copiez la string (remplacez `[YOUR-PASSWORD]` par votre mot de passe)

### 4. Commandes à exécuter

```bash
# Installer les dépendances
npm install

# Générer Prisma Client
npm run db:generate

# Créer les tables dans la base de données
npm run db:push

# OU créer une migration (recommandé pour la prod)
npm run db:migrate

# Lancer le serveur de développement
npm run dev
```

**Vérifiez le port dans le terminal :**
```
▲ Next.js 14.2.18
- Local:        http://localhost:3000  ← Si c'est 3001, mettez à jour NEXTAUTH_URL
```

Si le port est différent de 3000, mettez à jour `.env.local` :
```env
NEXTAUTH_URL="http://localhost:3001"  # ou le port affiché
```

### 5. Tester l'authentification

1. Ouvrez http://localhost:3000 (ou le port affiché)
2. Créez un compte via `/signup`
3. Connectez-vous via `/login`

---

## 🚀 Configuration Vercel (Production)

### 1. Variables d'environnement dans Vercel

Allez sur https://vercel.com > Votre projet > Settings > Environment Variables

Ajoutez ces variables :

| Variable | Valeur | Où la trouver |
|----------|--------|---------------|
| `DATABASE_URL` | `postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres?pgbouncer=true&connection_limit=1` | Supabase > Settings > Database > Connection string > URI |
| `NEXTAUTH_SECRET` | `[votre-secret-genere]` | Générer avec `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://votre-projet.vercel.app` | Vercel > Votre projet > Settings > Domains (ou après le premier deploy) |

**⚠️ IMPORTANT :**
- `NEXTAUTH_URL` doit être l'URL complète de votre app Vercel
- Format : `https://votre-projet.vercel.app` (sans trailing slash)
- Vous pouvez trouver l'URL après le premier deploy ou dans Settings > Domains

### 2. Récupérer l'URL Vercel

**Option 1 - Après le premier deploy :**
1. Faites un push sur votre repo
2. Vercel déploie automatiquement
3. L'URL est affichée dans le dashboard Vercel
4. Format : `https://votre-projet-xyz.vercel.app`

**Option 2 - Dans Settings :**
1. Vercel > Votre projet > Settings
2. Domains
3. Copiez le domaine par défaut (ex: `votre-projet.vercel.app`)
4. Utilisez : `https://votre-projet.vercel.app`

### 3. Build Command Vercel

Vercel détecte automatiquement Next.js, mais vérifiez dans Settings > General :

- **Build Command:** `npm run build` (ou `prisma generate && next build`)
- **Output Directory:** `.next` (automatique)
- **Install Command:** `npm install`

### 4. Prisma avec Supabase sur Vercel

Si vous utilisez Supabase avec connection pooling :

1. Ajoutez `DIRECT_URL` dans Vercel (pour les migrations) :
   ```
   DIRECT_URL="postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"
   ```
   (Sans `?pgbouncer=true`)

2. Modifiez `prisma/schema.prisma` :
   ```prisma
   datasource db {
     provider  = "postgresql"
     url       = env("DATABASE_URL")
     directUrl = env("DIRECT_URL")
   }
   ```

### 5. Deploy Checklist

- [ ] Variables d'environnement ajoutées dans Vercel
- [ ] `NEXTAUTH_URL` = URL Vercel complète (https://...)
- [ ] `NEXTAUTH_SECRET` généré et ajouté
- [ ] `DATABASE_URL` = Connection string Supabase
- [ ] Push sur le repo principal
- [ ] Vérifier les logs Vercel après deploy
- [ ] Tester `/login` et `/signup` sur l'URL de production

---

## 🐛 Diagnostic des erreurs

### Erreur: "Configuration (Server error)" dans le navigateur

**Causes possibles :**
1. `NEXTAUTH_SECRET` manquant ou invalide
2. `NEXTAUTH_URL` incorrect (port mismatch en local)
3. `DATABASE_URL` invalide

**Solution :**
1. Vérifiez les logs du terminal pour voir quelle variable manque
2. Regardez les warnings au démarrage (`npm run dev`)
3. Vérifiez que `.env.local` existe et contient toutes les variables

### Erreur: "NO_SECRET" dans les logs

**Solution :**
```bash
# Générer un secret
openssl rand -base64 32

# Ajouter dans .env.local
NEXTAUTH_SECRET="le-secret-genere"
```

### Erreur: Port mismatch (3000 vs 3001)

**Symptôme :**
- Le serveur tourne sur `http://localhost:3001`
- Mais `NEXTAUTH_URL="http://localhost:3000"`

**Solution :**
Mettez à jour `.env.local` :
```env
NEXTAUTH_URL="http://localhost:3001"
```

### Erreur: Database connection failed

**Vérifications :**
1. `DATABASE_URL` est correcte (copiée depuis Supabase)
2. Le mot de passe dans l'URL est correct
3. La base de données Supabase est active
4. Les migrations Prisma ont été exécutées : `npm run db:push`

---

## 📝 Commandes utiles

```bash
# Vérifier les variables d'environnement (en dev)
npm run dev  # Affiche les warnings si variables manquantes

# Générer Prisma Client
npm run db:generate

# Créer les tables
npm run db:push

# Créer une migration
npm run db:migrate

# Ouvrir Prisma Studio (visualiser la DB)
npm run db:studio

# Build pour production
npm run build
```

---

## ✅ Checklist finale

**Local :**
- [ ] `.env.local` créé avec toutes les variables
- [ ] `NEXTAUTH_SECRET` généré et ajouté
- [ ] `NEXTAUTH_URL` correspond au port réel (vérifié dans le terminal)
- [ ] `DATABASE_URL` = Connection string Supabase valide
- [ ] `npm run db:push` exécuté avec succès
- [ ] `npm run dev` démarre sans erreurs
- [ ] `/login` et `/signup` fonctionnent

**Production (Vercel):**
- [ ] Variables d'environnement ajoutées dans Vercel
- [ ] `NEXTAUTH_URL` = URL Vercel complète
- [ ] `NEXTAUTH_SECRET` ajouté
- [ ] `DATABASE_URL` ajouté
- [ ] Build Vercel réussit
- [ ] `/login` et `/signup` fonctionnent sur l'URL de production
