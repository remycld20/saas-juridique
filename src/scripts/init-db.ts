/**
 * Script d'initialisation de la base de données
 * À exécuter une fois après avoir configuré DATABASE_URL
 * 
 * Usage: npx tsx src/scripts/init-db.ts
 * OU: npm run db:init
 */

import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
})

async function main() {
  console.log("🔄 Initialisation de la base de données...\n")

  try {
    // Test de connexion
    console.log("1️⃣ Test de connexion...")
    await prisma.$connect()
    console.log("✅ Connexion réussie\n")

    // Vérifier si les tables existent
    console.log("2️⃣ Vérification des tables...")
    const tables = await prisma.$queryRaw<Array<{ tablename: string }>>`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `
    
    const tableNames = tables.map(t => t.tablename)
    console.log(`📊 Tables trouvées: ${tableNames.length}`)
    tableNames.forEach(name => console.log(`   - ${name}`))
    
    if (!tableNames.includes("User")) {
      console.log("\n⚠️  La table 'User' n'existe pas")
      console.log("💡 Exécutez: npm run db:push\n")
    } else {
      console.log("\n✅ Toutes les tables sont présentes\n")
    }

    // Compter les utilisateurs
    const userCount = await prisma.user.count()
    console.log(`3️⃣ Utilisateurs dans la base: ${userCount}\n`)

    console.log("✅ Initialisation terminée\n")
  } catch (error) {
    console.error("❌ Erreur lors de l'initialisation:", error)
    if (error instanceof Error) {
      console.error(`   Message: ${error.message}`)
    }
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
