"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import DashboardHeader from "@/components/dashboard/header"
import DashboardSidebar from "@/components/dashboard/sidebar"
import NotificationCenter from "@/components/reminders/notification-center"
import { getUser } from "@/lib/storage"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isDark, setIsDark] = useState(false)
  const [language, setLanguage] = useState<"en" | "id">("en")

  useEffect(() => {
    const checkAuth = () => {
      const user = getUser()

      if (!user) {
        router.push("/")
        return
      }

      const savedTheme = localStorage.getItem("theme")
      const savedLanguage = localStorage.getItem("language") as "en" | "id" | null

      if (savedTheme === "dark") {
        setIsDark(true)
        document.documentElement.classList.add("dark")
      }

      if (savedLanguage) {
        setLanguage(savedLanguage)
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const toggleTheme = () => {
    const newTheme = !isDark
    setIsDark(newTheme)

    if (newTheme) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  const changeLanguage = (lang: "en" | "id") => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar language={language} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader
          isDark={isDark}
          onToggleTheme={toggleTheme}
          language={language}
          onChangeLanguage={changeLanguage}
        />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
      <NotificationCenter />
    </div>
  )
}
