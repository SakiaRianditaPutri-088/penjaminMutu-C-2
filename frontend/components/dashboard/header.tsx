"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/storage"
import { translations, type Language } from "@/lib/translations"
import { Moon, Sun, LogOut } from "lucide-react"
import RobotLogo from "@/components/logo/robot-logo"

interface DashboardHeaderProps {
  isDark: boolean
  onToggleTheme: () => void
  language: Language
  onChangeLanguage: (lang: Language) => void
}

export default function DashboardHeader({ isDark, onToggleTheme, language, onChangeLanguage }: DashboardHeaderProps) {
  const router = useRouter()
  const t = translations[language]

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  return (
    <header className="border-b border-border bg-card">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center gap-3">
          <RobotLogo size={32} className="text-blue-600 dark:text-blue-400" />
          <h1 className="text-lg font-semibold text-foreground">Si Tugas</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            <Button
              variant={language === "en" ? "default" : "ghost"}
              size="sm"
              onClick={() => onChangeLanguage("en")}
              className="text-xs"
            >
              EN
            </Button>
            <Button
              variant={language === "id" ? "default" : "ghost"}
              size="sm"
              onClick={() => onChangeLanguage("id")}
              className="text-xs"
            >
              ID
            </Button>
          </div>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" onClick={onToggleTheme} title={isDark ? "Light mode" : "Dark mode"}>
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>

          {/* Logout */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            title={t.logout}
            className="text-destructive hover:text-destructive"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}
