"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { translations, type Language } from "@/lib/translations"
import { LayoutDashboard, BookOpen, User } from "lucide-react"

interface DashboardSidebarProps {
  language: Language
}

export default function DashboardSidebar({ language }: DashboardSidebarProps) {
  const pathname = usePathname()
  const t = translations[language]

  const menuItems = [
    {
      label: t.dashboard,
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: t.courses,
      href: "/dashboard/courses",
      icon: BookOpen,
    },
    {
      label: "Profil",
      href: "/dashboard/profile",
      icon: User,
    },
  ]

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col">
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                isActive ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
