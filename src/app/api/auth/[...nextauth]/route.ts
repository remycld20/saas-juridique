import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is not set in environment variables")
}

if (!process.env.NEXTAUTH_URL) {
  console.warn("⚠️  NEXTAUTH_URL is not set. This may cause issues in production.")
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          // Vérifier que la table User existe
          try {
            await prisma.$queryRaw`SELECT 1 FROM "User" LIMIT 1`
          } catch (error: any) {
            console.error("Database error in auth:", error)
            if (error?.code === "42P01" || error?.message?.includes("does not exist")) {
              console.error("❌ La table User n'existe pas. Exécutez: npm run db:push")
              throw new Error("Database not initialized")
            }
            throw error
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email }
          })

          if (!user) {
            console.log(`⚠️  Login attempt with unknown email: ${credentials.email}`)
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            console.log(`⚠️  Invalid password for: ${credentials.email}`)
            return null
          }

          console.log(`✅ Login successful: ${user.email}`)
          return {
            id: user.id,
            email: user.email,
            name: user.name || undefined,
          }
        } catch (error) {
          console.error("Auth error:", error)
          if (error instanceof Error && error.message === "Database not initialized") {
            throw error
          }
          return null
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login",
    signOut: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
      }
      return session
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
