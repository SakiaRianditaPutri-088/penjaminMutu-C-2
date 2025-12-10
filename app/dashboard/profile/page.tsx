"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getUser, getAccounts, saveAccounts } from "@/lib/storage"
import { translations, type Language } from "@/lib/translations"
import type { User } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { UserIcon, Mail, Calendar, LogOut, Edit2, Save } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [language, setLanguage] = useState<Language>("en")
  const [user, setUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState("")

  useEffect(() => {
    const savedLanguage = (localStorage.getItem("language") as Language) || "en"
    setLanguage(savedLanguage)

    const currentUser = getUser()
    if (!currentUser) {
      router.push("/")
      return
    }
    setUser(currentUser)
    setEditedName(currentUser.name || "")
  }, [router])

  const t = translations[language]

  const handleSaveName = () => {
    if (user && editedName.trim()) {
      const accounts = getAccounts()
      const updatedAccounts = accounts.map((acc) => (acc.id === user.id ? { ...acc, name: editedName } : acc))
      saveAccounts(updatedAccounts)

      const updatedUser = { ...user, name: editedName }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setIsEditing(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  if (!user) {
    return null
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profil Saya</h1>
        <p className="text-muted-foreground mt-1">Kelola informasi akun Anda</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserIcon className="w-5 h-5" />
            Informasi Akun
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
              <UserIcon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-2">
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    placeholder="Nama lengkap"
                    className="text-lg font-semibold"
                  />
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveName}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Simpan
                    </Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>
                      Batal
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-semibold text-foreground">{user.name || "Pengguna"}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.provider === "facebook" ? "Facebook" : "Email"}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-border pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium text-foreground">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Bergabung Sejak</p>
                <p className="font-medium text-foreground">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString("id-ID") : "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <Button onClick={handleLogout} variant="destructive" className="w-full">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
