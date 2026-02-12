"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, FileText, Image, Upload, Calendar, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Document {
  id: string
  name: string
  type: string
  size: string
  uploadedAt: string
}

interface CaseInfoPanelProps {
  caseTitle: string
  caseStatus: "OPEN" | "IN_PROGRESS" | "CLOSED" | "ARCHIVED"
  caseType: string
  createdAt: string
  lastUpdate: string
  description: string
  documents: Document[]
}

export function CaseInfoPanel({
  caseTitle,
  caseStatus,
  caseType,
  createdAt,
  lastUpdate,
  description,
  documents,
}: CaseInfoPanelProps) {
  const [descriptionOpen, setDescriptionOpen] = useState(true)
  const [documentsOpen, setDocumentsOpen] = useState(true)

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

  const getFileIcon = (type: string) => {
    if (type.includes("image")) {
      return <Image className="w-4 h-4" />
    }
    return <FileText className="w-4 h-4" />
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-start justify-between mb-3">
          <CardTitle className="text-2xl">{caseTitle}</CardTitle>
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs ${getStatusColor(
              caseStatus
            )}`}
          >
            <span>{getStatusLabel(caseStatus)}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">Assistance juridique pour votre situation</p>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3 pb-6 border-b border-border/50">
          <div className="flex items-center gap-3">
            <Tag className="w-4 h-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Type de dossier</p>
              <p className="text-sm text-foreground">{caseType}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Date de création</p>
              <p className="text-sm text-foreground">{createdAt}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">Dernière mise à jour</p>
              <p className="text-sm text-foreground">{lastUpdate}</p>
            </div>
          </div>
        </div>

        <div>
          <Button
            variant="ghost"
            onClick={() => setDescriptionOpen(!descriptionOpen)}
            className="w-full justify-between p-0 h-auto"
          >
            <h3 className="text-lg">Description</h3>
            {descriptionOpen ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </Button>
          {descriptionOpen && (
            <div className="mt-2 pt-3 border-t border-border/50">
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          )}
        </div>

        <div>
          <Button
            variant="ghost"
            onClick={() => setDocumentsOpen(!documentsOpen)}
            className="w-full justify-between p-0 h-auto"
          >
            <h3 className="text-lg">Documents</h3>
            {documentsOpen ? (
              <ChevronUp className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronDown className="w-5 h-5 text-muted-foreground" />
            )}
          </Button>
          {documentsOpen && (
            <div className="mt-2 pt-3 border-t border-border/50 space-y-3">
              {documents.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Aucun document ajouté
                </p>
              ) : (
                <div className="space-y-2">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border/50 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 flex-shrink-0">
                        {getFileIcon(doc.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {doc.size} · {doc.uploadedAt}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <Button variant="outline" className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                Ajouter un document
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
