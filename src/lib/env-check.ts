/**
 * Vérifie que toutes les variables d'environnement requises sont présentes
 * Affiche des warnings clairs si des variables manquent
 */
export function checkEnvVariables() {
  const required = {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  }

  const missing: string[] = []
  const warnings: string[] = []

  // Vérifier les variables requises
  Object.entries(required).forEach(([key, value]) => {
    if (!value) {
      missing.push(key)
    }
  })

  // Vérifier NEXTAUTH_URL en local
  if (process.env.NODE_ENV === "development") {
    const port = process.env.PORT || "3000"
    const expectedUrl = `http://localhost:${port}`
    if (process.env.NEXTAUTH_URL && process.env.NEXTAUTH_URL !== expectedUrl) {
      warnings.push(
        `⚠️  NEXTAUTH_URL=${process.env.NEXTAUTH_URL} mais le serveur tourne sur le port ${port}.`
      )
      warnings.push(`   Utilisez: NEXTAUTH_URL=${expectedUrl}`)
    }
  }

  // Afficher les erreurs
  if (missing.length > 0) {
    console.error("\n❌ Variables d'environnement manquantes:")
    missing.forEach((key) => {
      console.error(`   - ${key}`)
    })
    console.error("\n💡 Créez un fichier .env.local avec ces variables.")
    console.error("   Voir .env.example pour le format.\n")
    throw new Error(`Variables d'environnement manquantes: ${missing.join(", ")}`)
  }

  // Afficher les warnings
  if (warnings.length > 0) {
    console.warn("\n⚠️  Avertissements de configuration:")
    warnings.forEach((warning) => console.warn(warning))
    console.warn("")
  }

  // Confirmation
  if (process.env.NODE_ENV === "development") {
    console.log("✅ Variables d'environnement OK")
    console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? "✓" : "✗"}`)
    console.log(`   NEXTAUTH_SECRET: ${process.env.NEXTAUTH_SECRET ? "✓" : "✗"}`)
    console.log(`   NEXTAUTH_URL: ${process.env.NEXTAUTH_URL || "✗"}\n`)
  }
}
