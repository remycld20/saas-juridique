import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const registerSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  name: z.string().min(1, "Le nom est requis").optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registerSchema.parse(body)

    // Vérifier que la table User existe
    try {
      await prisma.$queryRaw`SELECT 1 FROM "User" LIMIT 1`
    } catch (error: any) {
      console.error("Database error:", error)
      if (error?.code === "42P01" || error?.message?.includes("does not exist")) {
        return NextResponse.json(
          { 
            error: "Base de données non initialisée",
            details: "Exécutez 'npm run db:push' pour créer les tables"
          },
          { status: 500 }
        )
      }
      throw error
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "Un compte avec cet email existe déjà" },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(validatedData.password, 10)

    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        password: hashedPassword,
        name: validatedData.name || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
      }
    })

    console.log(`✅ User créé: ${user.email} (${user.id})`)

    return NextResponse.json(
      { message: "Compte créé avec succès", user },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("Registration error:", error)
    
    // Erreur plus détaillée en développement
    const errorMessage = process.env.NODE_ENV === "development" 
      ? (error instanceof Error ? error.message : "Erreur inconnue")
      : "Erreur lors de la création du compte"

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}
