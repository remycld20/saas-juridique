# ⚡ Quick Start - SaaS Legal AI Assistant

## 🎯 Objectif : Faire fonctionner l'app en 5 minutes

### 1. Installer les dépendances

```bash
npm install
```

### 2. Configurer Supabase

1. Créez un projet sur https://supabase.com
2. Allez dans **Settings > Database**
3. Copiez les 2 connection strings :
   - **Connection string > URI** (pour `DATABASE_URL`)
   - **Connection string > Direct connection** (pour `DIRECT_URL`)

### 3. Créer `.env.local`

```bash
cp .env.example .env.local
```

Éditez `.env.local` :

```env
# Remplacez [PASSWORD], [HOST], etc. par vos valeurs Supabase
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
NEXTAUTH_SECRET="[générer avec: openssl rand -base64 32]"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Générer NEXTAUTH_SECRET

```bash
# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Mac/Linux
openssl rand -base64 32
```

### 5. Créer les tables

```bash
npm run db:generate
npm run db:push
```

**✅ Vérifier :**
```bash
npm run db:init
```

Vous devriez voir :
```
✅ Connexion réussie
📊 Tables trouvées: 9
   - User
   - Account
   - Session
   ...
```

### 6. Lancer l'app

```bash
npm run dev
```

**⚠️ IMPORTANT :** Notez le port affiché (ex: `http://localhost:3001`)
Si différent de 3000, mettez à jour `NEXTAUTH_URL` dans `.env.local`

### 7. Tester

1. Ouvrez http://localhost:3000 (ou le port affiché)
2. Allez sur `/signup`
3. Créez un compte
4. Connectez-vous sur `/login`

**✅ Si ça fonctionne :** Vous êtes prêt !

---

## 🐛 Problèmes courants

### "The table public.User does not exist"

```bash
npm run db:push
```

### "DATABASE_URL is not set"

Vérifiez que `.env.local` existe et contient `DATABASE_URL`

### "Configuration (Server error)"

1. Vérifiez que `NEXTAUTH_SECRET` est défini
2. Vérifiez que `NEXTAUTH_URL` correspond au port réel
3. Vérifiez les logs du terminal

---

## 📚 Documentation complète

- **DEPLOY.md** - Guide complet de déploiement (local + Vercel)
- **SETUP.md** - Configuration détaillée
