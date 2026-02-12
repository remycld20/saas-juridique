"use client"

import { usePathname, useRouter } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { useState } from "react"
import {
  Scale,
  LayoutDashboard,
  FolderOpen,
  Plus,
  HelpCircle,
  Settings,
  LogOut,
  User,
  Clock,
  CheckCircle,
  FileText,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useQuery } from "@tanstack/react-query"
import { Case } from "@prisma/client"

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const { data: recentCases } = useQuery<Case[]>({
    queryKey: ["cases", "recent"],
    queryFn: async () => {
      const res = await fetch("/api/cases?limit=3")
      if (!res.ok) return []
      const data = await res.json()
      return data.cases || []
    },
  })

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + "/")
  }

  const navItems = [
    { path: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
    { path: "/dossiers", label: "Mes dossiers", icon: FolderOpen },
  ]

  const handleLogout = async () => {
    await signOut({ redirect: true, callbackUrl: "/login" })
  }

  return (
    <aside className="w-72 h-screen bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
            <Scale className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg text-foreground">Assistant Juridique</h1>
            <p className="text-xs text-muted-foreground">IA légale</p>
          </div>
        </div>
      </div>

      <nav className="px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.path)
          return (
            <Link
              key={item.label}
              href={item.path}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{item.label}</span>
            </Link>
          )
        })}

        <Link
          href="/dossiers/nouveau"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 shadow-lg shadow-primary/20 mt-2"
        >
          <Plus className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm">Nouveau dossier</span>
        </Link>
      </nav>

      <div className="px-3 py-4 flex-1 overflow-y-auto">
        <h3 className="px-4 text-xs text-muted-foreground mb-3 uppercase tracking-wider">
          Dossiers récents
        </h3>
        <div className="space-y-1">
          {recentCases && recentCases.length > 0 ? (
            recentCases.map((case_) => (
              <Link
                key={case_.id}
                href={`/dossiers/${case_.id}`}
                className="w-full flex items-start gap-3 px-4 py-3 rounded-xl text-left hover:bg-secondary transition-colors group"
              >
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 flex-shrink-0 mt-0.5">
                  {case_.status === "OPEN" || case_.status === "IN_PROGRESS" ? (
                    <Clock className="w-4 h-4 text-primary" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate group-hover:text-primary transition-colors">
                    {case_.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {case_.status === "OPEN" || case_.status === "IN_PROGRESS"
                      ? "En cours"
                      : "Résolu"}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="px-4 text-sm text-muted-foreground">
              Aucun dossier récent
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-border">
        <div className="px-3 py-3 space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
          >
            <HelpCircle className="w-5 h-5 flex-shrink-0 mr-3" />
            <span className="text-sm">Aide & cadre légal</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-muted-foreground hover:text-foreground"
          >
            <Settings className="w-5 h-5 flex-shrink-0 mr-3" />
            <span className="text-sm">Paramètres</span>
          </Button>
        </div>

        <div className="px-3 py-3 border-t border-border">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start h-auto p-3"
              >
                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-primary/20 text-primary flex-shrink-0 mr-3">
                  <User className="w-4 h-4" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="text-sm text-foreground truncate">
                    {session?.user?.name || session?.user?.email || "Utilisateur"}
                  </p>
                  <p className="text-xs text-muted-foreground">Voir le profil</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </aside>
  )
}
