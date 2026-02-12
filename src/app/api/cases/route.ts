import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createCaseSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().optional(),
  type: z.string().optional(),
  status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED", "ARCHIVED"]).optional(),
})

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const limit = searchParams.get("limit")
    const status = searchParams.get("status")

    const where: any = {
      userId: session.user.id,
    }

    if (status) {
      where.status = status
    }

    const cases = await prisma.case.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      take: limit ? parseInt(limit) : undefined,
    })

    return NextResponse.json({ cases })
  } catch (error) {
    console.error("Error fetching cases:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des dossiers" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createCaseSchema.parse(body)

    const newCase = await prisma.case.create({
      data: {
        title: validatedData.title,
        description: validatedData.description || null,
        type: validatedData.type || null,
        status: validatedData.status || "OPEN",
        userId: session.user.id,
      },
    })

    return NextResponse.json({ case: newCase }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("Error creating case:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création du dossier" },
      { status: 500 }
    )
  }
}
