import { useNavigate } from "react-router";
import { Plus, Folder, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Sidebar } from "../components/sidebar";
import { useCases } from "../contexts/cases-context";

export function DashboardPage() {
  const navigate = useNavigate();
  const { cases } = useCases();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="w-4 h-4" />;
      case "pending":
        return <AlertCircle className="w-4 h-4" />;
      case "resolved":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

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

  const handleCreateCase = () => {
    // Navigate to new case creation flow
    navigate("/dashboard/new-case");
  };

  const handleCaseClick = (caseId: string) => {
    navigate(`/case/${caseId}`);
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

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-12">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-4xl text-white mb-4">Bienvenue</h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
              Gérez vos dossiers juridiques en toute simplicité. Notre assistant IA vous accompagne à chaque étape avec bienveillance et professionnalisme.
            </p>
            <button
              onClick={handleCreateCase}
              className="flex items-center gap-3 px-6 py-4 bg-primary hover:bg-primary/90 text-white rounded-xl transition-colors duration-200 shadow-lg shadow-primary/20"
            >
              <Plus className="w-5 h-5" />
              <span className="text-lg">Créer un nouveau dossier</span>
            </button>
          </div>

          {/* Cases Grid */}
          <div>
            <h2 className="text-2xl text-white mb-6">Vos dossiers</h2>
            {cases.length === 0 ? (
              <div className="bg-card border border-border rounded-xl p-12 text-center">
                <Folder className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Aucun dossier pour le moment. Créez votre premier dossier pour commencer.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cases.map((case_) => (
                  <button
                    key={case_.id}
                    onClick={() => handleCaseClick(case_.id)}
                    className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-200 text-left group hover:shadow-lg hover:shadow-primary/5 flex flex-col"
                  >
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

                    <div className="flex-1">
                      <h4 className="text-lg mb-2 text-white group-hover:text-primary transition-colors">
                        {case_.title}
                      </h4>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {case_.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-border/50 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Type</span>
                        <span className="text-white">{case_.type}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Mis à jour</span>
                        <span className="text-white">{case_.lastUpdated}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}