import { useNavigate, useLocation } from "react-router";
import { Scale, LayoutDashboard, FolderOpen, Plus, HelpCircle, Settings, LogOut, User, Clock, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useCases } from "../contexts/cases-context";

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { cases } = useCases();

  // Get the 3 most recent cases
  const recentCases = cases.slice(0, 3);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    { path: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    { path: "/dashboard", label: "Mes dossiers", icon: FolderOpen },
  ];

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <aside className="w-72 h-screen bg-card border-r border-border flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <Scale className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg text-white">Assistant Juridique</h1>
            <p className="text-xs text-muted-foreground">IA légale</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-white hover:bg-secondary"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{item.label}</span>
            </button>
          );
        })}
        
        <button
          onClick={() => navigate("/dashboard/new-case")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white transition-all duration-200 shadow-lg shadow-primary/20 mt-2"
        >
          <Plus className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">Nouveau dossier</span>
        </button>
      </nav>

      {/* Recent Cases */}
      <div className="px-3 py-4 flex-1 overflow-y-auto">
        <h3 className="px-4 text-xs text-muted-foreground mb-3 uppercase tracking-wider">
          Dossiers récents
        </h3>
        <div className="space-y-1">
          {recentCases.map((case_) => (
            <button
              key={case_.id}
              onClick={() => navigate(`/case/${case_.id}`)}
              className="w-full flex items-start gap-3 px-4 py-3 rounded-xl text-left hover:bg-secondary transition-colors group"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 flex-shrink-0 mt-0.5">
                {case_.status === "active" ? (
                  <Clock className="w-4 h-4 text-primary" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate group-hover:text-primary transition-colors">
                  {case_.title}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {case_.status === "active" ? "En cours" : "Résolu"}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-border">
        <div className="px-3 py-3 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-white hover:bg-secondary transition-all duration-200">
            <HelpCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">Aide & cadre légal</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:text-white hover:bg-secondary transition-all duration-200">
            <Settings className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">Paramètres</span>
          </button>
        </div>

        {/* User Profile */}
        <div className="px-3 py-3 border-t border-border">
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary transition-colors"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/20 text-primary flex-shrink-0">
                <User className="w-4 h-4" />
              </div>
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm text-white truncate">Jean Dupont</p>
                <p className="text-xs text-muted-foreground">Voir le profil</p>
              </div>
            </button>
            {showUserMenu && (
              <div className="absolute bottom-full left-3 right-3 mb-2 bg-card border border-border rounded-xl shadow-xl py-2 z-50">
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
      </div>
    </aside>
  );
}