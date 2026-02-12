"use client"

import { useRouter } from "next/navigation"
import { Plus, Folder, Clock, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useQuery } from "@tanstack/react-query"
import { Case } from "@prisma/client"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default function DashboardPage() {
  const router = useRouter()

  const { data: casesData, isLoading } = useQuery<{ cases: Case[] }>({
    queryKey: ["cases"],
    queryFn: async () => {
      const res = await fetch("/api/cases")
      if (!res.ok) throw new Error("Failed to fetch cases")
      return res.json()
    },
  })

  const cases = casesData?.cases || []

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "OPEN":
      case "IN_PROGRESS":
        return <Clock className="w-4 h-4" />
      case "CLOSED":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <AlertCircle className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
      case "IN_PROGRESS":
        return "text-primary bg-primary/10 border-primary/20"
      case "CLOSED":
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
      default:
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "OPEN":
        return "Ouvert"
      case "IN_PROGRESS":
        return "En cours"
      case "CLOSED":
        return "Fermé"
      case "ARCHIVED":
        return "Archivé"
      default:
        return status
    }
  }

  const stats = {
    total: cases.length,
    open: cases.filter((c) => c.status === "OPEN" || c.status === "IN_PROGRESS").length,
    closed: cases.filter((c) => c.status === "CLOSED").length,
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl text-foreground mb-4">Bienvenue</h1>
        <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
          Gérez vos dossiers juridiques en toute simplicité. Notre assistant IA vous accompagne à chaque étape avec bienveillance et professionnalisme.
        </p>
        <Button
          onClick={() => router.push("/dossiers/nouveau")}
          className="flex items-center gap-3"
        >
          <Plus className="w-5 h-5" />
          <span className="text-lg">Créer un nouveau dossier</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total des dossiers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dossiers en cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.open}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dossiers fermés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-500">{stats.closed}</div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl text-foreground mb-6">Vos dossiers</h2>
        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Chargement...
          </div>
        ) : cases.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Folder className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                Aucun dossier pour le moment. Créez votre premier dossier pour commencer.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.slice(0, 6).map((case_) => (
              <Card
                key={case_.id}
                className="cursor-pointer hover:border-primary/50 transition-all duration-200 group"
                onClick={() => router.push(`/dossiers/${case_.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 flex-shrink-0">
                      <Folder className="w-6 h-6 text-primary" />
                    </div>
                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs ${getStatusColor(
                        case_.status
                      )}`}
                    >
                      {getStatusIcon(case_.status)}
                      <span>{getStatusLabel(case_.status)}</span>
                    </div>
                  </div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    {case_.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {case_.description || "Aucune description"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Type</span>
                      <span className="text-foreground">{case_.type || "Non défini"}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Mis à jour</span>
                      <span className="text-foreground">
                        {format(new Date(case_.updatedAt), "d MMM yyyy", { locale: fr })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
