import type { Course, Task, User } from "./types"

export const storageKeys = {
  user: "user",
  courses: "courses",
  accounts: "accounts",
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null
  const user = localStorage.getItem(storageKeys.user)
  return user ? JSON.parse(user) : null
}

export function getCourses(): Course[] {
  if (typeof window === "undefined") return []
  const courses = localStorage.getItem(storageKeys.courses)
  return courses ? JSON.parse(courses) : []
}

export function getAccounts(): User[] {
  if (typeof window === "undefined") return []
  const accounts = localStorage.getItem(storageKeys.accounts)
  return accounts ? JSON.parse(accounts) : []
}

export function saveCourses(courses: Course[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(storageKeys.courses, JSON.stringify(courses))
}

export function saveAccounts(accounts: User[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(storageKeys.accounts, JSON.stringify(accounts))
}

export function addTaskToCourse(courseId: string, task: Omit<Task, "id" | "createdAt">): void {
  if (typeof window === "undefined") return

  const courses = getCourses()
  const course = courses.find((c) => c.id === courseId)

  if (course) {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    course.tasks.push(newTask)
    saveCourses(courses)
  }
}

export function updateTaskInCourse(courseId: string, taskId: string, updatedTask: Task): void {
  if (typeof window === "undefined") return

  const courses = getCourses()
  const course = courses.find((c) => c.id === courseId)

  if (course) {
    const taskIndex = course.tasks.findIndex((t) => t.id === taskId)
    if (taskIndex !== -1) {
      course.tasks[taskIndex] = updatedTask
      saveCourses(courses)
    }
  }
}

export function deleteTaskFromCourse(courseId: string, taskId: string): void {
  if (typeof window === "undefined") return

  const courses = getCourses()
  const course = courses.find((c) => c.id === courseId)

  if (course) {
    course.tasks = course.tasks.filter((t) => t.id !== taskId)
    saveCourses(courses)
  }
}

export function registerAccount(
  email: string,
  password: string,
  name: string,
  provider: "email" | "facebook" = "email",
): User | null {
  if (typeof window === "undefined") return null

  const accounts = getAccounts()

  if (accounts.some((acc) => acc.email === email)) {
    return null
  }

  const newAccount: User = {
    id: Date.now().toString(),
    email,
    password,
    name,
    provider,
    createdAt: new Date().toISOString(),
    loginTime: new Date().toISOString(),
  }

  accounts.push(newAccount)
  saveAccounts(accounts)

  return newAccount
}

export function verifyLogin(email: string, password: string): User | null {
  if (typeof window === "undefined") return null

  const accounts = getAccounts()
  const account = accounts.find((acc) => acc.email === email && acc.password === password)

  return account || null
}

export function logout(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(storageKeys.user)
}
