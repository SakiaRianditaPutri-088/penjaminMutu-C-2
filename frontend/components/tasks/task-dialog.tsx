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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { translations, type Language } from "@/lib/translations"
import type { Task } from "@/lib/types"

interface TaskDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (task: Task | Omit<Task, "id" | "createdAt">) => void
  task?: Task | null
  language: Language
}

export default function TaskDialog({ isOpen, onClose, onSave, task, language }: TaskDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [deadline, setDeadline] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [status, setStatus] = useState<"belum" | "proses" | "selesai">("belum")

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description)
      setDeadline(task.deadline.split("T")[0])
      setPriority(task.priority)
      setStatus(task.status)
    } else {
      setTitle("")
      setDescription("")
      setDeadline("")
      setPriority("medium")
      setStatus("belum")
    }
  }, [task, isOpen])

  const t = translations[language]

  const handleSave = () => {
    if (!title.trim()) {
      alert("Judul tugas harus diisi")
      return
    }

    if (!deadline) {
      alert("Deadline harus diisi")
      return
    }

    const deadlineDateTime = new Date(deadline)
    deadlineDateTime.setHours(23, 59, 59, 999)

    if (task) {
      onSave({
        ...task,
        title,
        description,
        deadline: deadlineDateTime.toISOString(),
        priority,
        status,
      })
    } else {
      onSave({
        title,
        description,
        deadline: deadlineDateTime.toISOString(),
        priority,
        status,
        reminderSet: false,
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{task ? "Edit Tugas" : "Tambah Tugas"}</DialogTitle>
          <DialogDescription>
            {task ? "Perbarui detail tugas Anda" : "Buat tugas baru dengan deadline dan prioritas"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground">Judul Tugas</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Selesaikan assignment"
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Deskripsi</label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Kirim assignment ke portal"
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Deadline</label>
            <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="mt-1" />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Prioritas</label>
            <Select value={priority} onValueChange={(value: any) => setPriority(value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Rendah</SelectItem>
                <SelectItem value="medium">Sedang</SelectItem>
                <SelectItem value="high">Tinggi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">Status</label>
            <Select value={status} onValueChange={(value: any) => setStatus(value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="belum">Belum</SelectItem>
                <SelectItem value="proses">Proses</SelectItem>
                <SelectItem value="selesai">Selesai</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
