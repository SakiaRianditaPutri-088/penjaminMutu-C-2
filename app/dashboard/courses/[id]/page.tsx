"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getCourses, addTaskToCourse, updateTaskInCourse, deleteTaskFromCourse } from "@/lib/storage"
import { translations, type Language } from "@/lib/translations"
import type { Course, Task } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, ArrowLeft, Edit2, Trash2, CheckCircle2, Circle, Clock } from "lucide-react"
import TaskDialog from "@/components/tasks/task-dialog"

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [language, setLanguage] = useState<Language>("en")
  const [course, setCourse] = useState<Course | null>(null)
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)

  useEffect(() => {
    const savedLanguage = (localStorage.getItem("language") as Language) || "en"
    setLanguage(savedLanguage)

    const courses = getCourses()
    const foundCourse = courses.find((c) => c.id === courseId)
    setCourse(foundCourse || null)
  }, [courseId])

  const t = translations[language]

  if (!course) {
    return (
      <div className="p-6">
        <Button onClick={() => router.back()} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali
        </Button>
        <p className="mt-4 text-muted-foreground">Mata kuliah tidak ditemukan</p>
      </div>
    )
  }

  const handleAddTask = (task: Omit<Task, "id" | "createdAt">) => {
    addTaskToCourse(courseId, task)
    const courses = getCourses()
    const updatedCourse = courses.find((c) => c.id === courseId)
    if (updatedCourse) setCourse(updatedCourse)
    setIsTaskDialogOpen(false)
  }

  const handleEditTask = (task: Task) => {
    updateTaskInCourse(courseId, task.id, task)
    const courses = getCourses()
    const updatedCourse = courses.find((c) => c.id === courseId)
    if (updatedCourse) setCourse(updatedCourse)
    setEditingTask(null)
    setIsTaskDialogOpen(false)
  }

  const handleDeleteTask = (taskId: string) => {
    if (confirm("Hapus tugas ini?")) {
      deleteTaskFromCourse(courseId, taskId)
      const courses = getCourses()
      const updatedCourse = courses.find((c) => c.id === courseId)
      if (updatedCourse) setCourse(updatedCourse)
    }
  }

  const handleStatusChange = (taskId: string, newStatus: "belum" | "proses" | "selesai") => {
    const task = course.tasks.find((t) => t.id === taskId)
    if (task) {
      updateTaskInCourse(courseId, taskId, { ...task, status: newStatus })
      const courses = getCourses()
      const updatedCourse = courses.find((c) => c.id === courseId)
      if (updatedCourse) setCourse(updatedCourse)
    }
  }

  const completedCount = course.tasks.filter((t) => t.status === "selesai").length
  const completionPercentage = course.tasks.length > 0 ? Math.round((completedCount / course.tasks.length) * 100) : 0

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button onClick={() => router.back()} variant="outline" size="sm">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-foreground">{course.name}</h1>
          <p className="text-muted-foreground mt-1">{course.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">{course.tasks.length}</p>
              <p className="text-sm text-muted-foreground">Total Tugas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">{completedCount}</p>
              <p className="text-sm text-muted-foreground">Selesai</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">{completionPercentage}%</p>
              <p className="text-sm text-muted-foreground">Progres</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Daftar Tugas</h2>
        <Button
          onClick={() => {
            setEditingTask(null)
            setIsTaskDialogOpen(true)
          }}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Tugas
        </Button>
      </div>

      {course.tasks.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Belum ada tugas di mata kuliah ini</p>
              <Button
                onClick={() => {
                  setEditingTask(null)
                  setIsTaskDialogOpen(true)
                }}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Tugas Pertama
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {course.tasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <button
                    onClick={() => {
                      const nextStatus =
                        task.status === "belum" ? "proses" : task.status === "proses" ? "selesai" : "belum"
                      handleStatusChange(task.id, nextStatus)
                    }}
                    className="mt-1 flex-shrink-0"
                  >
                    {task.status === "selesai" ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : task.status === "proses" ? (
                      <Clock className="w-6 h-6 text-blue-600" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3
                          className={`font-semibold ${task.status === "selesai" ? "line-through text-muted-foreground" : ""}`}
                        >
                          {task.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                          task.priority === "high"
                            ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                            : task.priority === "medium"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-muted-foreground">
                        Deadline: {new Date(task.deadline).toLocaleDateString("id-ID")}
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingTask(task)
                            setIsTaskDialogOpen(true)
                          }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteTask(task.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <TaskDialog
        isOpen={isTaskDialogOpen}
        onClose={() => {
          setIsTaskDialogOpen(false)
          setEditingTask(null)
        }}
        onSave={editingTask ? handleEditTask : handleAddTask}
        task={editingTask}
        language={language}
      />
    </div>
  )
}
