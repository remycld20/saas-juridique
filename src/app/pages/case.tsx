import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { ArrowLeft, Send, Scale, User, LogOut } from "lucide-react";
import { AIOrb } from "../components/ai-orb";
import { CaseInfoPanel } from "../components/case-info-panel";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface Document {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
}

const mockDocuments: Document[] = [
  {
    id: "1",
    name: "constat_accident.pdf",
    type: "application/pdf",
    size: "2.3 MB",
    uploadedAt: "Il y a 2 heures"
  },
  {
    id: "2",
    name: "photo_vehicule.jpg",
    type: "image/jpeg",
    size: "1.8 MB",
    uploadedAt: "Il y a 2 heures"
  }
];

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Bonjour, je suis votre Assistant Juridique IA. J'ai examiné votre dossier concernant l'accident de circulation. Je suis là pour vous guider avec attention et clarté.\n\n**Résumé de votre situation :**\nVous avez été victime d'une collision par l'arrière le 3 février 2026. Les documents que vous avez fournis sont en cours d'analyse.\n\n**Prochaines étapes recommandées :**\n• Vérifier que le constat amiable est correctement rempli et signé\n• Contacter votre assurance dans les 5 jours ouvrés\n• Conserver tous les justificatifs de frais médicaux et de réparation\n• Faire établir un certificat médical si nécessaire\n\n**Rappel important :**\nEn cas de désaccord avec l'autre partie, vous disposez de droits spécifiques. Je peux vous guider dans chaque étape.\n\nComment puis-je vous aider aujourd'hui ?",
    timestamp: new Date()
  }
];

export function CasePage() {
  const navigate = useNavigate();
  const { caseId } = useParams();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getCaseData = () => {
    if (caseId === "new") {
      return {
        title: "Nouveau dossier juridique",
        status: "active" as const,
        type: "Non défini",
        createdAt: "Aujourd'hui",
        lastUpdate: "À l'instant",
        description: "Nouveau dossier en cours de création. Décrivez votre situation pour commencer."
      };
    }

    const casesData: Record<string, any> = {
      "1": {
        title: "Incident de circulation",
        status: "active" as const,
        type: "Accident de la route",
        createdAt: "3 février 2026",
        lastUpdate: "Il y a 2 heures",
        description: "Collision par l'arrière survenue le 3 février 2026 sur l'autoroute A6 près de Lyon. Le véhicule adverse n'a pas respecté la distance de sécurité lors d'un ralentissement. Dégâts matériels importants à l'arrière du véhicule. Constat amiable rempli sur place avec l'autre conducteur."
      },
      "2": {
        title: "Litige professionnel",
        status: "pending" as const,
        type: "Droit du travail",
        createdAt: "28 janvier 2026",
        lastUpdate: "Il y a 1 jour",
        description: "Situation de licenciement abusif présumé. Employé depuis 5 ans dans l'entreprise, licencié sans procédure régulière suite à un désaccord avec la direction. Recherche de conseils pour contester le licenciement et obtenir réparation."
      },
      "3": {
        title: "Réclamation consommateur",
        status: "resolved" as const,
        type: "Protection du consommateur",
        createdAt: "15 janvier 2026",
        lastUpdate: "Il y a 1 semaine",
        description: "Achat d'un appareil électroménager défectueux. Le vendeur refusait initialement le remboursement. Après médiation et rappel des droits du consommateur, accord obtenu pour un remboursement complet."
      }
    };

    return casesData[caseId || "1"] || casesData["1"];
  };

  const caseData = getCaseData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Je comprends votre préoccupation. D'après ce que vous avez partagé, voici mon analyse :\n\n**Analyse de la situation :**\nVotre cas présente plusieurs éléments importants à prendre en compte. La documentation que vous avez fournie est essentielle pour la suite.\n\n**Actions recommandées :**\n• Rassemblez tous les documents pertinents (photos, reçus, correspondances)\n• Documentez précisément le déroulement des événements avec dates et heures\n• Conservez toutes les preuves de communication avec les autres parties\n• Évaluez vos options juridiques avant de prendre une décision\n\n**Important :**\nChaque situation est unique. Je suis là pour vous guider à travers chaque étape avec soin. N'hésitez pas à me poser des questions spécifiques.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Bar */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
                <Scale className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h1 className="text-lg text-white">Assistant Juridique IA</h1>
                <p className="text-xs text-muted-foreground">Dossier ouvert</p>
              </div>
            </div>
          </div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary">
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm text-white">Jean Dupont</span>
            </button>
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-xl py-2 z-50">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-sm text-left text-muted-foreground hover:text-white hover:bg-secondary transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Se déconnecter
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content - Two Panel Layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel - Case Information */}
        <aside className="w-96 border-r border-border p-6 overflow-hidden">
          <CaseInfoPanel
            caseTitle={caseData.title}
            caseStatus={caseData.status}
            caseType={caseData.type}
            createdAt={caseData.createdAt}
            lastUpdate={caseData.lastUpdate}
            description={caseData.description}
            documents={caseId === "1" ? mockDocuments : []}
          />
        </aside>

        {/* Right Panel - AI Assistant */}
        <div className="flex-1 flex flex-col bg-[#0D1F31]">
          {/* AI Orb Section */}
          <div className="flex items-center justify-center pt-8 pb-6">
            <AIOrb isActive={isTyping} />
          </div>

          {/* Messages Area */}
          <div className="flex-1 px-6 pb-6 overflow-y-auto">
            <div className="space-y-8 max-w-3xl mx-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] rounded-3xl px-6 py-5 ${
                      message.role === "user"
                        ? "bg-primary text-white shadow-lg shadow-primary/10"
                        : "bg-card/60 backdrop-blur-sm text-white"
                    }`}
                  >
                    <p className="leading-relaxed whitespace-pre-line">{message.content}</p>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-card/60 backdrop-blur-sm rounded-3xl px-6 py-5">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="bg-background/60 backdrop-blur-sm">
            <div className="max-w-3xl mx-auto px-6 py-6">
              <form onSubmit={handleSubmit} className="flex gap-3">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Décrivez votre situation ou posez votre question…"
                  className="flex-1 px-5 py-4 bg-input-background border border-input rounded-2xl text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="px-6 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-white rounded-2xl transition-colors duration-200 flex items-center justify-center shadow-lg shadow-primary/20"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
              <p className="text-xs text-muted-foreground mt-3 text-center">
                Cette IA fournit des informations juridiques générales. Pour des conseils spécifiques, consultez un avocat agréé.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}