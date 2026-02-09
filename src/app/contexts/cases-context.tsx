import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Case {
  id: string;
  title: string;
  type: string;
  status: "active" | "pending" | "resolved";
  lastUpdated: string;
  description: string;
  createdAt: string;
}

interface CasesContextType {
  cases: Case[];
  addCase: (newCase: Omit<Case, "id" | "lastUpdated" | "createdAt">) => void;
  updateCase: (id: string, updates: Partial<Case>) => void;
  deleteCase: (id: string) => void;
}

const CasesContext = createContext<CasesContextType | undefined>(undefined);

const defaultCases: Case[] = [
  {
    id: "1",
    title: "Incident de circulation",
    type: "Accident de la route",
    status: "active",
    lastUpdated: "Il y a 2 heures",
    description: "Collision par l'arrière le 3 février 2026",
    createdAt: "3 février 2026"
  },
  {
    id: "2",
    title: "Litige professionnel",
    type: "Droit du travail",
    status: "pending",
    lastUpdated: "Il y a 1 jour",
    description: "Révision de réclamation pour licenciement abusif",
    createdAt: "28 janvier 2026"
  },
  {
    id: "3",
    title: "Réclamation consommateur",
    type: "Protection du consommateur",
    status: "resolved",
    lastUpdated: "Il y a 1 semaine",
    description: "Indemnisation produit défectueux",
    createdAt: "15 janvier 2026"
  }
];

export function CasesProvider({ children }: { children: ReactNode }) {
  const [cases, setCases] = useState<Case[]>(() => {
    // Load from localStorage on init
    const stored = localStorage.getItem("legalAICases");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return defaultCases;
      }
    }
    return defaultCases;
  });

  // Save to localStorage whenever cases change
  useEffect(() => {
    localStorage.setItem("legalAICases", JSON.stringify(cases));
  }, [cases]);

  const addCase = (newCase: Omit<Case, "id" | "lastUpdated" | "createdAt">) => {
    const now = new Date();
    const case_: Case = {
      ...newCase,
      id: Date.now().toString(),
      lastUpdated: "À l'instant",
      createdAt: now.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
    };
    setCases(prev => [case_, ...prev]);
  };

  const updateCase = (id: string, updates: Partial<Case>) => {
    setCases(prev =>
      prev.map(c =>
        c.id === id
          ? { ...c, ...updates, lastUpdated: "À l'instant" }
          : c
      )
    );
  };

  const deleteCase = (id: string) => {
    setCases(prev => prev.filter(c => c.id !== id));
  };

  return (
    <CasesContext.Provider value={{ cases, addCase, updateCase, deleteCase }}>
      {children}
    </CasesContext.Provider>
  );
}

export function useCases() {
  const context = useContext(CasesContext);
  if (!context) {
    throw new Error("useCases must be used within CasesProvider");
  }
  return context;
}
