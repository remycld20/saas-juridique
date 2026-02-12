import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"
import { checkEnvVariables } from "@/lib/env-check"

const inter = Inter({ subsets: ["latin"] })

// Vérifier les variables d'environnement au démarrage (uniquement en développement)
if (process.env.NODE_ENV === "development") {
  try {
    checkEnvVariables()
  } catch (error) {
    console.error(error)
  }
}

export const metadata: Metadata = {
  title: "SaaS Legal AI Assistant",
  description: "Assistant juridique IA pour professionnels du droit",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
