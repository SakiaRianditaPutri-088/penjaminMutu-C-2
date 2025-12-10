"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { getCourses } from "@/lib/storage"
import { translations, type Language } from "@/lib/translations"
import type { Course, Task } from "@/lib/types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { BookOpen, CheckCircle2, Clock, AlertCircle } from "lucide-react"

export default function DashboardPage() {
  const [language, setLanguage] = useState<Language>("en")
  const [courses, setCourses] = useState<Course[]>([])
  const [stats, setStats] = useState({
    totalCourses: 0,
    totalTasks: 0,
    completedTasks: 0,
    upcomingDeadlines: 0,
  })

  useEffect(() => {
    const savedLanguage = (localStorage.getItem("language") as Language) || "en"
    setLanguage(savedLanguage)

    const coursesData = getCourses()
    setCourses(coursesData)

    let totalTasks = 0
    let completedTasks = 0
    let upcomingDeadlines = 0

    coursesData.forEach((course) => {
      course.tasks.forEach((task) => {
        totalTasks++
        if (task.status === "selesai") {
          completedTasks++
        } else {
          const deadline = new Date(task.deadline)
          const now = new Date()
          if (deadline > now) {
            upcomingDeadlines++
          }
        }
      })
    })

    setStats({
      totalCourses: coursesData.length,
      totalTasks,
      completedTasks,
      upcomingDeadlines,
    })
  }, [])

  const t = translations[language]

  const allTasks: (Task & { courseId: string; courseName: string })[] = []
  courses.forEach((course) => {
    course.tasks.forEach((task) => {
      allTasks.push({
        ...task,
        courseId: course.id,
        courseName: course.name,
      })
    })
  })

  const chartData = [
    {
      name: "Tugas",
      total: stats.totalTasks,
      completed: stats.completedTasks,
      pending: stats.totalTasks - stats.completedTasks,
    },
  ]

  const pieData = [
    { name: "Selesai", value: stats.completedTasks, color: "hsl(var(--color-chart-1))" },
    {
      name: "Proses",
      value: stats.totalTasks - stats.completedTasks - stats.upcomingDeadlines,
      color: "hsl(var(--color-chart-2))",
    },
    { name: "Belum", value: stats.upcomingDeadlines, color: "hsl(var(--color-chart-3))" },
  ].filter((item) => item.value > 0)

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Selamat Datang Kembali!</h1>
        <p className="text-muted-foreground mt-1">Kelola mata kuliah dan tugas Anda dengan efisien</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Total Mata Kuliah
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground mt-1">Mata kuliah aktif</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Total Tugas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats.totalTasks}</div>
            <p className="text-xs text-muted-foreground mt-1">Semua tugas</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Tingkat Penyelesaian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Tugas selesai</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Tugas Tertunda
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.upcomingDeadlines}</div>
            <p className="text-xs text-muted-foreground mt-1">Menunggu penyelesaian</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Tugas</CardTitle>
            <CardDescription>Visualisasi tugas Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="hsl(var(--color-chart-1))" name="Selesai" />
                <Bar dataKey="pending" fill="hsl(var(--color-chart-2))" name="Tertunda" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {pieData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Distribusi Status</CardTitle>
              <CardDescription>Breakdown status semua tugas</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Upcoming Deadlines */}
      <Card>
        <CardHeader>
          <CardTitle>Deadline Mendatang</CardTitle>
          <CardDescription>Tugas dengan deadline yang akan datang</CardDescription>
        </CardHeader>
        <CardContent>
          {allTasks.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">Belum ada tugas</p>
          ) : (
            <div className="space-y-3">
              {allTasks
                .filter((t) => t.status !== "selesai")
                .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                .slice(0, 5)
                .map((task) => {
                  const daysLeft = Math.ceil(
                    (new Date(task.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                  )
                  return (
                    <Link key={task.id} href={`/dashboard/courses/${task.courseId}`}>
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer">
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{task.title}</p>
                          <p className="text-sm text-muted-foreground">{task.courseName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">
                            {new Date(task.deadline).toLocaleDateString("id-ID")}
                          </p>
                          <span
                            className={`text-xs px-2 py-1 rounded inline-block mt-1 ${
                              daysLeft < 0
                                ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                : daysLeft <= 3
                                  ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                                  : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            }`}
                          >
                            {daysLeft < 0 ? `${Math.abs(daysLeft)} hari terlewat` : `${daysLeft} hari tersisa`}
                          </span>
                        </div>
                      </div>
                    </Link>
                  )
                })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
