"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { translations, type Language } from "@/lib/translations"
import type { Course } from "@/lib/types"

interface CourseDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (course: Course | Omit<Course, "id" | "createdAt">) => void
  course?: Course | null
  language: Language
}

const colors = [
  "from-blue-500 to-blue-600",
  "from-purple-500 to-purple-600",
  "from-pink-500 to-pink-600",
  "from-green-500 to-green-600",
  "from-yellow-500 to-yellow-600",
  "from-red-500 to-red-600",
  "from-indigo-500 to-indigo-600",
  "from-cyan-500 to-cyan-600",
]

export default function CourseDialog({ isOpen, onClose, onSave, course, language }: CourseDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [selectedColor, setSelectedColor] = useState(colors[0])

  useEffect(() => {
    if (course) {
      setName(course.name)
      setDescription(course.description)
      setSelectedColor(course.color)
    } else {
      setName("")
      setDescription("")
      setSelectedColor(colors[0])
    }
  }, [course, isOpen])

  const t = translations[language]

  const handleSave = () => {
    if (!name.trim()) {
      alert("Course name is required")
      return
    }

    if (course) {
      onSave({
        ...course,
        name,
        description,
        color: selectedColor,
      })
    } else {
      onSave({
        name,
        description,
        color: selectedColor,
        tasks: [], // Initialize empty tasks array for new courses
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{course ? t.editCourse : t.addCourse}</DialogTitle>
          <DialogDescription>
            {course ? "Update your course details" : "Create a new course to organize your tasks"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">{t.courseName}</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Data Structures"
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">{t.courseDescription}</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Learn about data structures and algorithms"
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">{t.selectColor}</label>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`h-10 rounded-lg bg-gradient-to-r ${color} ${selectedColor === color ? "ring-2 ring-offset-2 ring-primary" : ""
                    }`}
                />
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            {t.cancel}
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {t.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
