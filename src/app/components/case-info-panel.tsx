import { useState } from "react";
import { ChevronDown, ChevronUp, FileText, Image, Upload, Calendar, Tag } from "lucide-react";

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
}

interface CaseInfoPanelProps {
  caseTitle: string;
  caseStatus: "active" | "pending" | "resolved";
  caseType: string;
  createdAt: string;
  lastUpdate: string;
  description: string;
  documents: Document[];
}

export function CaseInfoPanel({
  caseTitle,
  caseStatus,
  caseType,
  createdAt,
  lastUpdate,
  description,
  documents
}: CaseInfoPanelProps) {
  const [descriptionOpen, setDescriptionOpen] = useState(true);
  const [documentsOpen, setDocumentsOpen] = useState(true);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-primary bg-primary/10 border-primary/20";
      case "pending":
        return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
      case "resolved":
        return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      default:
        return "";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "active":
        return "En cours";
      case "pending":
        return "En attente";
      case "resolved":
        return "Résolu";
      default:
        return status;
    }
  };

  const getFileIcon = (type: string) => {
    if (type.includes("image")) {
      return <Image className="w-4 h-4" />;
    }
    return <FileText className="w-4 h-4" />;
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 h-full overflow-y-auto">
      {/* Case Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-2xl text-white">{caseTitle}</h2>
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs ${getStatusColor(
              caseStatus
            )}`}
          >
            <span>{getStatusLabel(caseStatus)}</span>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Assistance juridique pour votre situation
        </p>
      </div>

      {/* Metadata */}
      <div className="space-y-3 mb-6 pb-6 border-b border-border/50">
        <div className="flex items-center gap-3">
          <Tag className="w-4 h-4 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Type de dossier</p>
            <p className="text-sm text-white">{caseType}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Date de création</p>
            <p className="text-sm text-white">{createdAt}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <div className="flex-1">
            <p className="text-xs text-muted-foreground">Dernière mise à jour</p>
            <p className="text-sm text-white">{lastUpdate}</p>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="mb-6">
        <button
          onClick={() => setDescriptionOpen(!descriptionOpen)}
          className="w-full flex items-center justify-between py-3 text-left group"
        >
          <h3 className="text-lg text-white group-hover:text-primary transition-colors">
            Description
          </h3>
          {descriptionOpen ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
        {descriptionOpen && (
          <div className="mt-2 pt-3 border-t border-border/50">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        )}
      </div>

      {/* Documents Section */}
      <div>
        <button
          onClick={() => setDocumentsOpen(!documentsOpen)}
          className="w-full flex items-center justify-between py-3 text-left group"
        >
          <h3 className="text-lg text-white group-hover:text-primary transition-colors">
            Documents
          </h3>
          {documentsOpen ? (
            <ChevronUp className="w-5 h-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-5 h-5 text-muted-foreground" />
          )}
        </button>
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
                      <p className="text-sm text-white truncate">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {doc.size} · {doc.uploadedAt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <button className="w-full mt-3 py-3 px-4 bg-secondary hover:bg-secondary/70 border border-border rounded-lg text-sm text-white transition-colors flex items-center justify-center gap-2">
              <Upload className="w-4 h-4" />
              Ajouter un document
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
