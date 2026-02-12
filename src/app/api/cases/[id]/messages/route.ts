import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const createMessageSchema = z.object({
  content: z.string().min(1, "Le message ne peut pas être vide"),
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = createMessageSchema.parse(body)

    const case_ = await prisma.case.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    })

    if (!case_) {
      return NextResponse.json({ error: "Dossier non trouvé" }, { status: 404 })
    }

    const userMessage = await prisma.message.create({
      data: {
        content: validatedData.content,
        role: "USER",
        userId: session.user.id,
        caseId: params.id,
      },
    })

    setTimeout(async () => {
      await prisma.message.create({
        data: {
          content:
            "Je comprends votre préoccupation. D'après ce que vous avez partagé, voici mon analyse :\n\n**Analyse de la situation :**\nVotre cas présente plusieurs éléments importants à prendre en compte. La documentation que vous avez fournie est essentielle pour la suite.\n\n**Actions recommandées :**\n• Rassemblez tous les documents pertinents (photos, reçus, correspondances)\n• Documentez précisément le déroulement des événements avec dates et heures\n• Conservez toutes les preuves de communication avec les autres parties\n• Évaluez vos options juridiques avant de prendre une décision\n\n**Important :**\nChaque situation est unique. Je suis là pour vous guider à travers chaque étape avec soin. N'hésitez pas à me poser des questions spécifiques.\n\n⚠️ Ces informations sont indicatives et ne constituent pas un avis juridique. Consultez un avocat.",
          role: "ASSISTANT",
          userId: session.user.id,
          caseId: params.id,
        },
      })
    }, 1500)

    return NextResponse.json({ message: userMessage }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      )
    }

    console.error("Error creating message:", error)
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message" },
      { status: 500 }
    )
  }
}
