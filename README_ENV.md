# Configuration des variables d'environnement

## Créer `.env.local`

Créez un fichier `.env.local` à la racine du projet avec ce contenu :

```env
# Database - Connection string Supabase (avec pooling)
# Récupérez depuis Supabase > Settings > Database > Connection string > URI
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Database - Direct connection (pour migrations Prisma)
# Récupérez depuis Supabase > Settings > Database > Connection string > Direct connection
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# NextAuth - OBLIGATOIRE
# Générer avec: openssl rand -base64 32
NEXTAUTH_SECRET="votre-secret-genere-avec-openssl"

# NextAuth URL - OBLIGATOIRE
# En local: http://localhost:3000 (ou le port affiché après npm run dev)
# En production: https://votre-domaine.vercel.app
NEXTAUTH_URL="http://localhost:3000"
```

## Récupérer les credentials Supabase

1. Allez sur https://supabase.com
2. Ouvrez votre projet
3. **Settings > Database**
4. **Connection string > URI** → Copiez pour `DATABASE_URL`
5. **Connection string > Direct connection** → Copiez pour `DIRECT_URL`

## Générer NEXTAUTH_SECRET

```bash
# Windows PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Mac/Linux
openssl rand -base64 32
```

## Vérifier le port local

Après `npm run dev`, notez le port affiché :
- Si c'est `http://localhost:3001`, mettez `NEXTAUTH_URL="http://localhost:3001"`
- Si c'est `http://localhost:3000`, mettez `NEXTAUTH_URL="http://localhost:3000"`
