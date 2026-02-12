"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Folder, Clock, CheckCircle, AlertCircle, Archive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useQuery } from "@tanstack/react-query"
import { Case } from "@prisma/client"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default function DossiersPage() {
  const router = useRouter()
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { data: casesData, isLoading } = useQuery<{ cases: Case[] }>({
    queryKey: ["cases", statusFilter],
    queryFn: async () => {
      const url = statusFilter === "all" ? "/api/cases" : `/api/cases?status=${statusFilter}`
      const res = await fetch(url)
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
      case "ARCHIVED":
        return <Archive className="w-4 h-4" />
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
      case "ARCHIVED":
        return "text-muted-foreground bg-muted/10 border-muted/20"
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

  return (
    <div className="max-w-6xl mx-auto px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl text-foreground mb-2">Mes dossiers</h1>
          <p className="text-muted-foreground">
            Gérez tous vos dossiers juridiques en un seul endroit
          </p>
        </div>
        <Button onClick={() => router.push("/dossiers/nouveau")}>
          <Plus className="w-5 h-5 mr-2" />
          Nouveau dossier
        </Button>
      </div>

      <div className="mb-6 flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="OPEN">Ouvert</SelectItem>
            <SelectItem value="IN_PROGRESS">En cours</SelectItem>
            <SelectItem value="CLOSED">Fermé</SelectItem>
            <SelectItem value="ARCHIVED">Archivé</SelectItem>
          </SelectContent>
        </Select>
        <div className="text-sm text-muted-foreground">
          {cases.length} dossier{cases.length > 1 ? "s" : ""}
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-muted-foreground">
          Chargement...
        </div>
      ) : cases.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Folder className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              {statusFilter === "all"
                ? "Aucun dossier pour le moment. Créez votre premier dossier pour commencer."
                : "Aucun dossier avec ce statut."}
            </p>
            {statusFilter === "all" && (
              <Button onClick={() => router.push("/dossiers/nouveau")}>
                <Plus className="w-5 h-5 mr-2" />
                Créer un dossier
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cases.map((case_) => (
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
                    <span className="text-muted-foreground">Créé le</span>
                    <span className="text-foreground">
                      {format(new Date(case_.createdAt), "d MMM yyyy", { locale: fr })}
                    </span>
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
  )
}
