export interface User {
  id: string
  email: string
  password?: string
  name?: string
  provider?: "email" | "facebook"
  createdAt?: string
  loginTime: string
}

export interface Task {
  id: string
  title: string
  description: string
  deadline: string
  priority: "low" | "medium" | "high"
  status: "belum" | "proses" | "selesai"
  createdAt: string
  reminderSet: boolean
}

export interface Course {
  id: string
  name: string
  description: string
  color: string
  createdAt: string
  tasks: Task[] // Tasks now nested inside Course
}

export interface Reminder {
  id: string
  taskId: string
  courseId: string
  taskTitle: string
  deadline: string
  notified: boolean
}
