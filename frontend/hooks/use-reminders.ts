"use client"

import { useEffect, useState, useCallback } from "react"
import { getCourses } from "@/lib/storage"
import type { Task } from "@/lib/types"

export interface ReminderNotification {
  id: string
  taskId: string
  taskTitle: string
  deadline: string
  message: string
  type: "warning" | "urgent" | "overdue"
  timestamp: number
}

export function useReminders() {
  const [reminders, setReminders] = useState<ReminderNotification[]>([])
  const [notifications, setNotifications] = useState<ReminderNotification[]>([])

  const checkReminders = useCallback(() => {
    const courses = getCourses()
    const tasks: Task[] = []
    courses.forEach((course) => {
      tasks.push(...course.tasks)
    })

    const now = new Date()
    const newReminders: ReminderNotification[] = []

    tasks.forEach((task: Task) => {
      if (task.status === "selesai") return

      const deadline = new Date(task.deadline)
      const timeDiff = deadline.getTime() - now.getTime()
      const hoursDiff = timeDiff / (1000 * 60 * 60)
      const daysDiff = timeDiff / (1000 * 60 * 60 * 24)

      let shouldNotify = false
      let type: "warning" | "urgent" | "overdue" = "warning"
      let message = ""

      // Overdue
      if (timeDiff < 0) {
        shouldNotify = true
        type = "overdue"
        const daysOverdue = Math.abs(Math.floor(daysDiff))
        message = `Overdue by ${daysOverdue} day${daysOverdue > 1 ? "s" : ""}`
      }
      // Urgent (less than 1 hour)
      else if (hoursDiff < 1 && hoursDiff > 0) {
        shouldNotify = true
        type = "urgent"
        const minutesLeft = Math.floor(hoursDiff * 60)
        message = `Due in ${minutesLeft} minute${minutesLeft > 1 ? "s" : ""}`
      }
      // Warning (less than 24 hours)
      else if (daysDiff < 1 && daysDiff > 0) {
        shouldNotify = true
        type = "warning"
        const hoursLeft = Math.floor(hoursDiff)
        message = `Due in ${hoursLeft} hour${hoursLeft > 1 ? "s" : ""}`
      }
      // 3 days before
      else if (daysDiff <= 3 && daysDiff > 2) {
        shouldNotify = true
        type = "warning"
        message = "Due in 3 days"
      }

      if (shouldNotify) {
        const reminderId = `${task.id}-${type}`
        const existingReminder = reminders.find((r) => r.id === reminderId)

        if (!existingReminder) {
          newReminders.push({
            id: reminderId,
            taskId: task.id,
            taskTitle: task.title,
            deadline: task.deadline,
            message,
            type,
            timestamp: now.getTime(),
          })
        }
      }
    })

    if (newReminders.length > 0) {
      setReminders((prev) => [...prev, ...newReminders])
      setNotifications(newReminders)

      // Show browser notification if available
      if ("Notification" in window && Notification.permission === "granted") {
        newReminders.forEach((reminder) => {
          new Notification("Si Tugas Reminder", {
            body: `${reminder.taskTitle}: ${reminder.message}`,
            icon: "/favicon.ico",
            tag: reminder.id,
          })
        })
      }
    }
  }, [reminders])

  useEffect(() => {
    // Request notification permission
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }

    // Check reminders immediately
    checkReminders()

    // Check reminders every minute
    const interval = setInterval(checkReminders, 60000)

    return () => clearInterval(interval)
  }, [checkReminders])

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  return {
    reminders,
    notifications,
    dismissNotification,
    clearAllNotifications,
  }
}
