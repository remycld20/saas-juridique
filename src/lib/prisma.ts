import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in environment variables")
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma

// Test connection on startup (development only)
if (process.env.NODE_ENV === "development") {
  prisma.$connect()
    .then(() => {
      console.log("✅ Prisma connected to database")
    })
    .catch((error) => {
      console.error("❌ Prisma connection error:", error)
      console.error("💡 Check your DATABASE_URL in .env.local")
    })
}
