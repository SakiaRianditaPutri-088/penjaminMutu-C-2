"use client"

import * as React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "@/lib/translations"
import RobotLogo from "@/components/logo/robot-logo"
import { apiClient } from "@/lib/api-client"

export default function LoginForm() {
  const router = useRouter()
  const { t, language } = useTranslation()
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (!email || !password) {
        setError(language === "id" ? "Email dan password harus diisi" : "Email and password are required")
        setIsLoading(false)
        return
      }

      const response = await apiClient.login(email, password)

      // Store user data
      const userData = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.full_name,
        loginTime: new Date().toISOString(),
      }
      localStorage.setItem("user", JSON.stringify(userData))

      router.push("/dashboard")
    } catch (err: any) {
      let errorMessage = err.message || (language === "id" ? "Login gagal. Silakan coba lagi." : "Login failed. Please try again.")

      // Translate common errors
      if (errorMessage.includes("Invalid") || errorMessage.includes("credentials")) {
        errorMessage = language === "id"
          ? "Email atau password salah."
          : "Invalid email or password."
      } else if (errorMessage.includes("Failed to connect")) {
        errorMessage = language === "id"
          ? "Tidak dapat terhubung ke server. Pastikan backend berjalan di http://localhost:8000"
          : "Failed to connect to server. Make sure backend is running on http://localhost:8000"
      }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      if (!email || !password || !name) {
        setError(language === "id" ? "Semua field harus diisi" : "All fields are required")
        setIsLoading(false)
        return
      }

      if (password.length < 6) {
        setError(language === "id" ? "Password minimal 6 karakter" : "Password must be at least 6 characters")
        setIsLoading(false)
        return
      }

      console.log('Registering user...', { email, name })
      const response = await apiClient.register(email, password, name)
      console.log('Register response:', response)

      if (!response || !response.user) {
        throw new Error(language === "id" ? "Registrasi gagal: Response tidak valid" : "Registration failed: Invalid response")
      }

      // Show success message and switch to login mode
      setError(
        language === "id"
          ? "Registrasi berhasil! Silakan login dengan email dan password Anda."
          : "Registration successful! Please login with your email and password."
      )

      // Clear form and switch to login mode
      setName("")
      setPassword("")
      // Keep email so user can login easily
      setIsLogin(true)
    } catch (err: any) {
      console.error('Registration error:', err)

      // Extract error message
      let errorMessage = err.message ||
        (language === "id" ? "Registrasi gagal. Silakan coba lagi." : "Registration failed. Please try again.")

      // Translate common errors
      if (errorMessage.includes('already registered') || errorMessage.includes('already exists')) {
        errorMessage = language === "id"
          ? "Email sudah terdaftar. Silakan login atau gunakan email lain."
          : "Email already registered. Please login or use a different email."
      } else if (errorMessage.includes('Failed to connect')) {
        errorMessage = language === "id"
          ? "Tidak dapat terhubung ke server. Pastikan backend berjalan di http://localhost:8000"
          : "Failed to connect to server. Make sure backend is running on http://localhost:8000"
      }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFacebookLogin = async () => {
    setError("")
    setIsLoading(true)

    try {
      setError(
        language === "id"
          ? "Facebook login tidak tersedia di versi ini"
          : "Facebook login not available in this version",
      )
    } catch (err) {
      setError(language === "id" ? "Login Facebook gagal" : "Facebook login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-center mb-4">
            <RobotLogo size={48} className="text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl text-center">Si Tugas</CardTitle>
          <CardDescription className="text-center">Task Management Dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => {
                setIsLogin(true)
                setError("")
                setEmail("")
                setPassword("")
                setName("")
              }}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${isLogin
                ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
            >
              {language === "id" ? "Masuk" : "Login"}
            </button>
            <button
              onClick={() => {
                setIsLogin(false)
                setError("")
                setEmail("")
                setPassword("")
                setName("")
              }}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${!isLogin
                ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
            >
              {language === "id" ? "Daftar" : "Register"}
            </button>
          </div>

          <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
            {error && (
              <div
                className={`p-3 rounded-lg text-sm ${error.includes("berhasil") || error.includes("successful") || error.includes("sent")
                  ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
                  : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
                  }`}
              >
                {error}
              </div>
            )}

            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {language === "id" ? "Nama Lengkap" : "Full Name"}
                </label>
                <Input
                  type="text"
                  placeholder={language === "id" ? "Masukkan nama lengkap" : "Enter your full name"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  className="dark:bg-slate-800 dark:border-slate-700"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <Input
                type="email"
                placeholder={language === "id" ? "Masukkan email" : "Enter your email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="dark:bg-slate-800 dark:border-slate-700"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                {language === "id" ? "Kata Sandi" : "Password"}
              </label>
              <Input
                type="password"
                placeholder={language === "id" ? "Masukkan kata sandi" : "Enter your password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="dark:bg-slate-800 dark:border-slate-700"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {isLoading
                ? language === "id"
                  ? "Memproses..."
                  : "Processing..."
                : isLogin
                  ? language === "id"
                    ? "Masuk"
                    : "Login"
                  : language === "id"
                    ? "Daftar"
                    : "Register"}
            </Button>
          </form>

          {!isLogin && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400">
                    {language === "id" ? "atau" : "or"}
                  </span>
                </div>
              </div>

              <Button
                type="button"
                onClick={handleFacebookLogin}
                disabled={isLoading}
                variant="outline"
                className="w-full flex items-center justify-center gap-2 dark:border-slate-700 dark:hover:bg-slate-800 bg-transparent"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                {language === "id" ? "Daftar dengan Facebook" : "Register with Facebook"}
              </Button>
            </>
          )}

          <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-4">
            {isLogin
              ? language === "id"
                ? "Belum punya akun? Klik tab Daftar"
                : "Don't have an account? Click Register tab"
              : language === "id"
                ? "Sudah punya akun? Klik tab Masuk"
                : "Already have an account? Click Login tab"}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
