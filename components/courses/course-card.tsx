"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { translations, type Language } from "@/lib/translations"
import type { Course } from "@/lib/types"
import { Edit2, Trash2, ChevronRight, BookOpen } from "lucide-react"

interface CourseCardProps {
  course: Course
  onEdit: () => void
  onDelete: () => void
  language: Language
}

export default function CourseCard({ course, onEdit, onDelete, language }: CourseCardProps) {
  const t = translations[language]

  const handleDelete = () => {
    if (confirm(t.confirmDelete)) {
      onDelete()
    }
  }

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all hover:scale-105">
      <div className={`h-3 bg-gradient-to-r ${course.color}`}></div>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{course.name}</CardTitle>
            <CardDescription className="mt-1">{course.description}</CardDescription>
          </div>
          <BookOpen className="w-5 h-5 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{course.tasks.length} tugas</span>
          <span className="text-xs bg-muted px-2 py-1 rounded-full">
            {course.tasks.filter((t) => t.status === "selesai").length}/{course.tasks.length}
          </span>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/courses/${course.id}`} className="flex-1">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
              <ChevronRight className="w-4 h-4 mr-2" />
              Buka
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={onEdit} className="bg-transparent">
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            className="text-destructive hover:text-destructive bg-transparent"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
