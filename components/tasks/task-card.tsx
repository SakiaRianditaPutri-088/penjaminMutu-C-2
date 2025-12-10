"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { translations, type Language } from "@/lib/translations"
import type { Course, Task } from "@/lib/types"
import { Edit2, Trash2, CheckCircle2, Circle, Clock } from "lucide-react"

interface TaskCardProps {
  task: Task
  course?: Course
  onEdit: () => void
  onDelete: () => void
  onStatusChange: (status: "belum" | "proses" | "selesai") => void
  language: Language
}

export default function TaskCard({ task, course, onEdit, onDelete, onStatusChange, language }: TaskCardProps) {
  const t = translations[language]

  const handleDelete = () => {
    if (confirm(t.confirmDelete)) {
      onDelete()
    }
  }

  const isOverdue = new Date(task.deadline) < new Date() && task.status !== "selesai"
  const daysUntilDeadline = Math.ceil(
    (new Date(task.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  )

  const statusColors = {
    belum: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
    proses: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    selesai: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  }

  const priorityColors = {
    low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  }

  return (
    <Card className={`overflow-hidden ${isOverdue ? "border-red-300 dark:border-red-700" : ""}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-foreground text-lg">{task.title}</h3>
              {task.status === "selesai" && <CheckCircle2 className="w-5 h-5 text-green-600" />}
            </div>

            <p className="text-sm text-muted-foreground mb-3">{task.description}</p>

            <div className="flex flex-wrap gap-2 mb-3">
              {course && (
                <span className="text-xs px-2 py-1 rounded bg-muted text-muted-foreground">{course.name}</span>
              )}
              <span className={`text-xs px-2 py-1 rounded ${statusColors[task.status]}`}>{t[task.status]}</span>
              <span className={`text-xs px-2 py-1 rounded ${priorityColors[task.priority]}`}>{t[task.priority]}</span>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>{new Date(task.deadline).toLocaleDateString()}</span>
              </div>
              {isOverdue && <span className="text-red-600 dark:text-red-400 font-medium">Overdue</span>}
              {!isOverdue && daysUntilDeadline <= 3 && daysUntilDeadline > 0 && (
                <span className="text-orange-600 dark:text-orange-400 font-medium">
                  {daysUntilDeadline} day{daysUntilDeadline > 1 ? "s" : ""} left
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                title={t.edit}
                className="text-muted-foreground hover:text-foreground"
              >
                <Edit2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                title={t.delete}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Status Quick Change */}
            <div className="flex gap-1">
              <Button
                variant={task.status === "belum" ? "default" : "outline"}
                size="sm"
                onClick={() => onStatusChange("belum")}
                title={t.belum}
                className="text-xs"
              >
                <Circle className="w-3 h-3" />
              </Button>
              <Button
                variant={task.status === "proses" ? "default" : "outline"}
                size="sm"
                onClick={() => onStatusChange("proses")}
                title={t.proses}
                className="text-xs"
              >
                <Clock className="w-3 h-3" />
              </Button>
              <Button
                variant={task.status === "selesai" ? "default" : "outline"}
                size="sm"
                onClick={() => onStatusChange("selesai")}
                title={t.selesai}
                className="text-xs"
              >
                <CheckCircle2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
