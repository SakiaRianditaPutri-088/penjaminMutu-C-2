"use client"

import { useEffect, useState } from "react"
import { getCourses, saveCourses } from "@/lib/storage"
import { translations, type Language } from "@/lib/translations"
import type { Course } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import CourseDialog from "@/components/courses/course-dialog"
import CourseCard from "@/components/courses/course-card"
import { Plus } from "lucide-react"

export default function CoursesPage() {
  const [language, setLanguage] = useState<Language>("en")
  const [courses, setCourses] = useState<Course[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)

  useEffect(() => {
    const savedLanguage = (localStorage.getItem("language") as Language) || "en"
    setLanguage(savedLanguage)

    const coursesData = getCourses()
    setCourses(coursesData)
  }, [])

  const t = translations[language]

  const handleAddCourse = (course: Omit<Course, "id" | "createdAt" | "tasks">) => {
    const newCourse: Course = {
      ...course,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      tasks: [], // Initialize empty tasks array
    }

    const updatedCourses = [...courses, newCourse]
    setCourses(updatedCourses)
    saveCourses(updatedCourses)
    setIsDialogOpen(false)
  }

  const handleEditCourse = (course: Course) => {
    const updatedCourses = courses.map((c) => (c.id === course.id ? course : c))
    setCourses(updatedCourses)
    saveCourses(updatedCourses)
    setEditingCourse(null)
    setIsDialogOpen(false)
  }

  const handleDeleteCourse = (courseId: string) => {
    const updatedCourses = courses.filter((c) => c.id !== courseId)
    setCourses(updatedCourses)
    saveCourses(updatedCourses)
  }

  const handleOpenDialog = (course?: Course) => {
    if (course) {
      setEditingCourse(course)
    } else {
      setEditingCourse(null)
    }
    setIsDialogOpen(true)
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
        onSave={editingCourse ? handleEditCourse : handleAddCourse}
        course={editingCourse}
        language={language}
      />
    </div>
  )
}
