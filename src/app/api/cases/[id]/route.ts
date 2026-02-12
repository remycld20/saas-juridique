import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const updateCaseSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  type: z.string().optional(),
  status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED", "ARCHIVED"]).optional(),
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const case_ = await prisma.case.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
      include: {
        documents: {
          orderBy: { createdAt: "desc" },
        },
        tasks: {
          orderBy: { createdAt: "desc" },
        },
        messages: {
          orderBy: { createdAt: "asc" },
          take: 50,
        },
      },
    })

    if (!case_) {
      return NextResponse.json({ error: "Dossier non trouvé" }, { status: 404 })
    }

    return NextResponse.json({ case: case_ })
  } catch (error) {
    console.error("Error fetching case:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération du dossier" },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateCaseSchema.parse(body)

    const case_ = await prisma.case.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!case_) {
      return NextResponse.json({ error: "Dossier non trouvé" }, { status: 404 })
    }

    const updatedCase = await prisma.case.update({
      where: { id: params.id },
      data: validatedData,
    })

    return NextResponse.json({ case: updatedCase })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("Error updating case:", error)
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour du dossier" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const case_ = await prisma.case.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!case_) {
      return NextResponse.json({ error: "Dossier non trouvé" }, { status: 404 })
    }

    await prisma.case.delete({
      where: { id: params.id },
    })

    return NextResponse.json({ message: "Dossier supprimé" })
  } catch (error) {
    console.error("Error deleting case:", error)
    return NextResponse.json(
      { error: "Erreur lors de la suppression du dossier" },
      { status: 500 }
    )
  }
}
