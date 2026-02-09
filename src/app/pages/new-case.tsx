import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft, Car, Home, Briefcase, ShoppingCart, FileQuestion, ChevronRight, Check, Edit3, Scale } from "lucide-react";
import { useCases } from "../contexts/cases-context";

type CaseType = "traffic" | "housing" | "work" | "consumer" | "other" | null;

interface CaseTypeOption {
  id: CaseType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}

interface Question {
  id: string;
  question: string;
  type: "text" | "select" | "yesno";
  options?: string[];
}

const caseTypes: CaseTypeOption[] = [
  {
    id: "traffic",
    label: "Accident de la route",
    icon: Car,
    description: "Collision, responsabilité, assurance"
  },
  {
    id: "housing",
    label: "Logement",
    icon: Home,
    description: "Bail, travaux, expulsion, voisinage"
  },
  {
    id: "work",
    label: "Travail",
    icon: Briefcase,
    description: "Licenciement, salaire, harcèlement"
  },
  {
    id: "consumer",
    label: "Consommation",
    icon: ShoppingCart,
    description: "Produit défectueux, remboursement"
  },
  {
    id: "other",
    label: "Autre situation",
    icon: FileQuestion,
    description: "Autre problème juridique"
  }
];

const questionsMap: Record<string, Question[]> = {
  traffic: [
    {
      id: "when",
      question: "Quand l'accident a-t-il eu lieu ?",
      type: "text"
    },
    {
      id: "where",
      question: "Où s'est produit l'accident ?",
      type: "text"
    },
    {
      id: "responsible",
      question: "Qui était responsable selon vous ?",
      type: "select",
      options: ["L'autre conducteur", "Responsabilité partagée", "Je ne sais pas"]
    },
    {
      id: "injuries",
      question: "Y a-t-il eu des blessures ?",
      type: "yesno"
    },
    {
      id: "statement",
      question: "Avez-vous rempli un constat amiable ?",
      type: "yesno"
    },
    {
      id: "insurance",
      question: "Avez-vous contacté votre assurance ?",
      type: "yesno"
    }
  ],
  housing: [
    {
      id: "issue",
      question: "Quel est le problème principal ?",
      type: "select",
      options: ["Travaux non réalisés", "Augmentation de loyer", "Expulsion", "Voisinage", "Autre"]
    },
    {
      id: "tenant",
      question: "Êtes-vous locataire ou propriétaire ?",
      type: "select",
      options: ["Locataire", "Propriétaire"]
    },
    {
      id: "when",
      question: "Depuis quand cette situation dure-t-elle ?",
      type: "text"
    },
    {
      id: "contact",
      question: "Avez-vous contacté votre propriétaire/locataire ?",
      type: "yesno"
    }
  ],
  work: [
    {
      id: "issue",
      question: "Quel est le problème ?",
      type: "select",
      options: ["Licenciement", "Salaire impayé", "Harcèlement", "Discrimination", "Autre"]
    },
    {
      id: "duration",
      question: "Depuis combien de temps travaillez-vous dans cette entreprise ?",
      type: "text"
    },
    {
      id: "when",
      question: "Quand le problème a-t-il commencé ?",
      type: "text"
    },
    {
      id: "documented",
      question: "Avez-vous des preuves écrites (emails, courriers) ?",
      type: "yesno"
    }
  ],
  consumer: [
    {
      id: "product",
      question: "Quel type de produit ou service ?",
      type: "text"
    },
    {
      id: "when",
      question: "Date d'achat ou de souscription ?",
      type: "text"
    },
    {
      id: "issue",
      question: "Quel est le problème ?",
      type: "select",
      options: ["Produit défectueux", "Service non rendu", "Remboursement refusé", "Autre"]
    },
    {
      id: "contact",
      question: "Avez-vous contacté le vendeur ?",
      type: "yesno"
    }
  ],
  other: [
    {
      id: "category",
      question: "De quel domaine s'agit-il ?",
      type: "text"
    },
    {
      id: "description",
      question: "Décrivez brièvement votre situation",
      type: "text"
    },
    {
      id: "when",
      question: "Quand cela s'est-il produit ?",
      type: "text"
    },
    {
      id: "help",
      question: "Quel type d'aide recherchez-vous ?",
      type: "text"
    }
  ]
};

export function NewCasePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<CaseType>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [summary, setSummary] = useState("");
  const { addCase } = useCases();

  const handleTypeSelect = (type: CaseType) => {
    setSelectedType(type);
    setAnswers({});
  };

  const handleNext = () => {
    if (step === 1 && selectedType) {
      setStep(2);
    } else if (step === 2) {
      generateSummary();
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate("/dashboard");
    }
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const generateSummary = () => {
    const typeLabel = caseTypes.find(t => t.id === selectedType)?.label || "";
    let summaryText = `Type de dossier : ${typeLabel}\n\n`;
    
    const questions = questionsMap[selectedType as string] || [];
    questions.forEach(q => {
      const answer = answers[q.id];
      if (answer) {
        summaryText += `${q.question}\n${answer}\n\n`;
      }
    });

    setSummary(summaryText.trim());
  };

  const handleCreateCase = () => {
    const typeLabel = caseTypes.find(t => t.id === selectedType)?.label || "Nouveau dossier";
    
    // Extract first question answer as a brief description
    const questions = questionsMap[selectedType as string] || [];
    const firstAnswer = questions[0] ? answers[questions[0].id] : "";
    const description = firstAnswer || summary.substring(0, 100);
    
    // Create the new case
    addCase({
      title: typeLabel,
      type: typeLabel,
      status: "active",
      description: description
    });
    
    // Redirect to dashboard to see the new case
    navigate("/dashboard");
  };

  const canProceed = () => {
    if (step === 1) return selectedType !== null;
    if (step === 2) {
      const questions = questionsMap[selectedType as string] || [];
      return questions.every(q => answers[q.id]);
    }
    return true;
  };

  const currentQuestions = selectedType ? questionsMap[selectedType] || [] : [];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="flex items-center justify-center w-9 h-9 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary/10">
                <Scale className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h1 className="text-lg text-white">Créer un nouveau dossier</h1>
                <p className="text-xs text-muted-foreground">Étape {step} sur 3</p>
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`w-2 h-2 rounded-full transition-colors ${
                  s <= step ? "bg-primary" : "bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-3xl">
          {/* Step 1: Case Type Selection */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-3xl text-white mb-3">
                  Quelle est votre situation ?
                </h2>
                <p className="text-muted-foreground">
                  Choisissez le type de dossier qui correspond à votre besoin
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {caseTypes.map((type) => {
                  const Icon = type.icon;
                  const isSelected = selectedType === type.id;
                  return (
                    <button
                      key={type.id}
                      onClick={() => handleTypeSelect(type.id)}
                      className={`p-6 rounded-2xl border-2 transition-all duration-200 text-left group hover:scale-105 ${
                        isSelected
                          ? "border-primary bg-primary/10 shadow-lg shadow-primary/20"
                          : "border-border bg-card hover:border-primary/50"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0 ${
                          isSelected ? "bg-primary text-white" : "bg-primary/10 text-primary"
                        }`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg text-white mb-1">{type.label}</h3>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                        </div>
                        {isSelected && (
                          <Check className="w-5 h-5 text-primary flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Step 2: Guided Questions */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-3xl text-white mb-3">
                  Parlez-nous de votre situation
                </h2>
                <p className="text-muted-foreground">
                  Répondez à quelques questions pour nous aider à mieux comprendre
                </p>
              </div>

              <div className="space-y-6 bg-card border border-border rounded-2xl p-8">
                {currentQuestions.map((question, index) => (
                  <div key={question.id} className="space-y-3">
                    <label className="block">
                      <span className="text-sm text-muted-foreground">Question {index + 1}</span>
                      <p className="text-white mt-1 mb-3">{question.question}</p>
                      
                      {question.type === "text" && (
                        <input
                          type="text"
                          value={answers[question.id] || ""}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                          placeholder="Votre réponse..."
                        />
                      )}

                      {question.type === "select" && question.options && (
                        <div className="space-y-2">
                          {question.options.map((option) => (
                            <button
                              key={option}
                              onClick={() => handleAnswerChange(question.id, option)}
                              className={`w-full px-4 py-3 rounded-xl border-2 transition-all text-left ${
                                answers[question.id] === option
                                  ? "border-primary bg-primary/10 text-white"
                                  : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/50 hover:text-white"
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}

                      {question.type === "yesno" && (
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleAnswerChange(question.id, "Oui")}
                            className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${
                              answers[question.id] === "Oui"
                                ? "border-primary bg-primary/10 text-white"
                                : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/50 hover:text-white"
                            }`}
                          >
                            Oui
                          </button>
                          <button
                            onClick={() => handleAnswerChange(question.id, "Non")}
                            className={`flex-1 px-4 py-3 rounded-xl border-2 transition-all ${
                              answers[question.id] === "Non"
                                ? "border-primary bg-primary/10 text-white"
                                : "border-border bg-secondary/50 text-muted-foreground hover:border-primary/50 hover:text-white"
                            }`}
                          >
                            Non
                          </button>
                        </div>
                      )}
                    </label>
                    {index < currentQuestions.length - 1 && (
                      <div className="border-t border-border/50 pt-6" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Summary */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-3xl text-white mb-3">
                  Récapitulatif de votre dossier
                </h2>
                <p className="text-muted-foreground">
                  Vérifiez les informations avant de créer votre dossier
                </p>
              </div>

              <div className="bg-card border border-border rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg text-white">Informations collectées</h3>
                  <button
                    onClick={() => setStep(2)}
                    className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                    Modifier
                  </button>
                </div>

                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={12}
                  className="w-full px-4 py-3 bg-input-background border border-input rounded-xl text-white placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
                />

                <p className="text-xs text-muted-foreground mt-4">
                  Vous pourrez modifier ces informations et ajouter des documents après la création du dossier.
                </p>
              </div>

              <button
                onClick={handleCreateCase}
                className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors duration-200 text-lg shadow-lg shadow-primary/20"
              >
                Créer le dossier
              </button>
            </div>
          )}

          {/* Navigation Buttons */}
          {step < 3 && (
            <div className="flex justify-end mt-8">
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground text-white rounded-xl transition-colors duration-200 shadow-lg shadow-primary/20"
              >
                Continuer
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}