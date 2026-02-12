"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Send, Scale } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Case, Message, Document, Task } from "@prisma/client"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { CaseInfoPanel } from "@/components/case-info-panel"
import { AIOrb } from "@/components/ai-orb"

interface MessageWithUser extends Message {
  user: { name: string | null; email: string }
}

interface CaseWithRelations extends Case {
  messages: MessageWithUser[]
  documents: Document[]
  tasks: Task[]
}

export default function CaseDetailPage() {
  const router = useRouter()
  const params = useParams()
  const caseId = params.id as string
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  const { data: caseData, isLoading } = useQuery<{ case: CaseWithRelations }>({
    queryKey: ["case", caseId],
    queryFn: async () => {
      const res = await fetch(`/api/cases/${caseId}`)
      if (!res.ok) throw new Error("Failed to fetch case")
      return res.json()
    },
  })

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const res = await fetch(`/api/cases/${caseId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
      if (!res.ok) throw new Error("Failed to send message")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["case", caseId] })
      setInputValue("")
      setIsTyping(false)
    },
  })

  const case_ = caseData?.case

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [case_?.messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    setIsTyping(true)
    sendMessageMutation.mutate(inputValue)
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  if (!case_) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Dossier non trouvé</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
                <Scale className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h1 className="text-lg text-foreground">{case_.title}</h1>
                <p className="text-xs text-muted-foreground">Dossier ouvert</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        <aside className="w-96 border-r border-border p-6 overflow-y-auto">
          <CaseInfoPanel
            caseTitle={case_.title}
            caseStatus={case_.status}
            caseType={case_.type || "Non défini"}
            createdAt={format(new Date(case_.createdAt), "d MMMM yyyy", { locale: fr })}
            lastUpdate={format(new Date(case_.updatedAt), "d MMMM yyyy", { locale: fr })}
            description={case_.description || "Aucune description"}
            documents={case_.documents.map((doc) => ({
              id: doc.id,
              name: doc.name,
              type: doc.type,
              size: `${(doc.size || 0) / 1024} KB`,
              uploadedAt: format(new Date(doc.createdAt), "d MMM yyyy", { locale: fr }),
            }))}
          />
        </aside>

        <div className="flex-1 flex flex-col bg-[#0D1F31]">
          <Tabs defaultValue="chat" className="flex-1 flex flex-col">
            <div className="border-b border-border/50 px-6">
              <TabsList className="bg-transparent">
                <TabsTrigger value="apercu">Aperçu</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="taches">Tâches</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="apercu" className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Informations du dossier</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Statut</p>
                      <p className="text-foreground">{getStatusLabel(case_.status)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <p className="text-foreground">{case_.type || "Non défini"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Description</p>
                      <p className="text-foreground">{case_.description || "Aucune description"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Créé le</p>
                      <p className="text-foreground">
                        {format(new Date(case_.createdAt), "d MMMM yyyy à HH:mm", { locale: fr })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Dernière mise à jour</p>
                      <p className="text-foreground">
                        {format(new Date(case_.updatedAt), "d MMMM yyyy à HH:mm", { locale: fr })}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="chat" className="flex-1 flex flex-col">
              <div className="flex items-center justify-center pt-8 pb-6">
                <AIOrb isActive={isTyping} />
              </div>

              <div className="flex-1 px-6 pb-6 overflow-y-auto">
                <div className="space-y-8 max-w-3xl mx-auto">
                  {case_.messages.length === 0 ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">
                        Aucun message pour le moment. Commencez la conversation.
                      </p>
                    </div>
                  ) : (
                    case_.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.role === "USER" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-3xl px-6 py-5 ${
                            message.role === "USER"
                              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10"
                              : "bg-card/60 backdrop-blur-sm text-foreground"
                          }`}
                        >
                          <p className="leading-relaxed whitespace-pre-line">{message.content}</p>
                          <p className="text-xs opacity-70 mt-2">
                            {format(new Date(message.createdAt), "HH:mm", { locale: fr })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-card/60 backdrop-blur-sm rounded-3xl px-6 py-5">
                        <div className="flex gap-2">
                          <div
                            className="w-2 h-2 rounded-full bg-primary animate-pulse"
                            style={{ animationDelay: "0ms" }}
                          />
                          <div
                            className="w-2 h-2 rounded-full bg-primary animate-pulse"
                            style={{ animationDelay: "150ms" }}
                          />
                          <div
                            className="w-2 h-2 rounded-full bg-primary animate-pulse"
                            style={{ animationDelay: "300ms" }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              <div className="bg-background/60 backdrop-blur-sm border-t border-border/50">
                <div className="max-w-3xl mx-auto px-6 py-6">
                  <form onSubmit={handleSubmit} className="flex gap-3">
                    <Input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Décrivez votre situation ou posez votre question…"
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      disabled={!inputValue.trim() || sendMessageMutation.isPending}
                    >
                      <Send className="w-5 h-5" />
                    </Button>
                  </form>
                  <p className="text-xs text-muted-foreground mt-3 text-center">
                    ⚠️ Ces informations sont indicatives et ne constituent pas un avis juridique. Consultez un avocat.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Documents</CardTitle>
                    <CardDescription>Gérez les documents de ce dossier</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {case_.documents.length === 0 ? (
                      <p className="text-center py-8 text-muted-foreground">
                        Aucun document pour le moment
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {case_.documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border/50"
                          >
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                              <span className="text-primary">📄</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-foreground truncate">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {format(new Date(doc.createdAt), "d MMM yyyy", { locale: fr })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="taches" className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle>Tâches</CardTitle>
                    <CardDescription>Suivez les tâches liées à ce dossier</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {case_.tasks.length === 0 ? (
                      <p className="text-center py-8 text-muted-foreground">
                        Aucune tâche pour le moment
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {case_.tasks.map((task) => (
                          <div
                            key={task.id}
                            className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border/50"
                          >
                            <input
                              type="checkbox"
                              checked={task.completed}
                              readOnly
                              className="w-4 h-4"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-foreground">{task.title}</p>
                              {task.description && (
                                <p className="text-xs text-muted-foreground">{task.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
