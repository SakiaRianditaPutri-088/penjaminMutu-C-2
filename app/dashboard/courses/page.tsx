"use client"

import { useEffect, useState } from "react"
import { getCourses, saveCourses } from "@/lib/storage"
import { courseService } from "@/lib/supabase-service"
import { translations, type Language } from "@/lib/translations"
import type { Course } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import CourseDialog from "@/components/courses/course-dialog"
import CourseCard from "@/components/courses/course-card"
import { Plus, Loader2 } from "lucide-react"

export default function CoursesPage() {
  const [language, setLanguage] = useState<Language>("en")
  const [courses, setCourses] = useState<Course[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const savedLanguage = (localStorage.getItem("language") as Language) || "en"
    setLanguage(savedLanguage)

    loadCourses()
  }, [])

  const loadCourses = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await courseService.getCourses()
      // Transform Supabase data to match Course type
      const transformedCourses: Course[] = data.map((c: any) => ({
        id: c.id,
        name: c.title,
        description: c.description || "",
        color: c.color || "from-blue-500 to-blue-600",
        createdAt: c.created_at,
        tasks: [], // Tasks will be loaded separately in course detail
      }))
      setCourses(transformedCourses)
      // Also save to localStorage as fallback
      saveCourses(transformedCourses)
    } catch (err: any) {
      console.error("Error loading courses:", err)
      // Fallback to localStorage
      const localCourses = getCourses()
      setCourses(localCourses)
      if (localCourses.length === 0) {
        setError(err.message || "Failed to load courses")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const t = translations[language]

  const handleAddCourse = async (course: Omit<Course, "id" | "createdAt" | "tasks">) => {
    try {
      // Try Supabase first
      await courseService.createCourse({
        title: course.name,
        description: course.description,
        color: course.color,
      })
      // Reload courses from Supabase
      await loadCourses()
    } catch (err: any) {
      console.error("Error creating course:", err)
      // Fallback to localStorage
      const newCourse: Course = {
        ...course,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        tasks: [],
      }
      const updatedCourses = [...courses, newCourse]
      setCourses(updatedCourses)
      saveCourses(updatedCourses)
    }
    setIsDialogOpen(false)
  }

  const handleEditCourse = async (course: Course) => {
    try {
      await courseService.updateCourse(course.id, {
        title: course.name,
        description: course.description,
        color: course.color,
      })
      await loadCourses()
    } catch (err: any) {
      console.error("Error updating course:", err)
      // Fallback to localStorage
      const updatedCourses = courses.map((c) => (c.id === course.id ? course : c))
      setCourses(updatedCourses)
      saveCourses(updatedCourses)
    }
    setEditingCourse(null)
    setIsDialogOpen(false)
  }

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm(language === "id" ? "Hapus mata kuliah ini?" : "Delete this course?")) return

    try {
      await courseService.deleteCourse(courseId)
      await loadCourses()
    } catch (err: any) {
      console.error("Error deleting course:", err)
      // Fallback to localStorage
      const updatedCourses = courses.filter((c) => c.id !== courseId)
      setCourses(updatedCourses)
      saveCourses(updatedCourses)
    }
  }

  const handleOpenDialog = (course?: Course) => {
    if (course) {
      setEditingCourse(course)
    } else {
      setEditingCourse(null)
    }
    setIsDialogOpen(true)
  }

  // Wrapper to handle both add and edit with proper types
  const handleSave = async (course: Course | Omit<Course, "id" | "createdAt">) => {
    if ("id" in course && course.id) {
      await handleEditCourse(course as Course)
    } else {
      await handleAddCourse(course as Omit<Course, "id" | "createdAt" | "tasks">)
    }
  }

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{t.courses}</h1>
          <p className="text-muted-foreground mt-1">Kelola mata kuliah dan tugas Anda</p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t.addCourse}
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {courses.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">{t.noCourses}</p>
              <Button
                onClick={() => handleOpenDialog()}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                {t.addCourse}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onEdit={() => handleOpenDialog(course)}
              onDelete={() => handleDeleteCourse(course.id)}
              language={language}
            />
          ))}
        </div>
      )}

      <CourseDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false)
          setEditingCourse(null)
        }}
        onSave={handleSave}
        course={editingCourse}
        language={language}
      />
    </div>
  )
}
