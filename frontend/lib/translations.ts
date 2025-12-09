"use client"

import { useEffect, useState } from "react"

export const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    courses: "Courses",
    tasks: "Tasks",
    settings: "Settings",
    logout: "Logout",

    // Dashboard
    welcomeBack: "Welcome Back",
    totalCourses: "Total Courses",
    totalTasks: "Total Tasks",
    completedTasks: "Completed Tasks",
    upcomingDeadlines: "Upcoming Deadlines",

    // Courses
    addCourse: "Add Course",
    editCourse: "Edit Course",
    deleteCourse: "Delete Course",
    courseName: "Course Name",
    courseDescription: "Course Description",
    selectColor: "Select Color",
    noCourses: "No courses yet. Create one to get started!",

    // Tasks
    addTask: "Add Task",
    editTask: "Edit Task",
    deleteTask: "Delete Task",
    taskTitle: "Task Title",
    taskDescription: "Task Description",
    deadline: "Deadline",
    priority: "Priority",
    status: "Status",
    low: "Low",
    medium: "Medium",
    high: "High",
    belum: "Not Started",
    proses: "In Progress",
    selesai: "Completed",
    noTasks: "No tasks yet. Create one to get started!",

    // Reminders
    setReminder: "Set Reminder",
    reminderSet: "Reminder Set",
    upcomingReminders: "Upcoming Reminders",

    // Common
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    close: "Close",
    search: "Search",
    noResults: "No results found",
    confirmDelete: "Are you sure you want to delete this?",
    success: "Success",
    error: "Error",
  },
  id: {
    // Navigation
    dashboard: "Dashboard",
    courses: "Mata Kuliah",
    tasks: "Tugas",
    settings: "Pengaturan",
    logout: "Keluar",

    // Dashboard
    welcomeBack: "Selamat Datang Kembali",
    totalCourses: "Total Mata Kuliah",
    totalTasks: "Total Tugas",
    completedTasks: "Tugas Selesai",
    upcomingDeadlines: "Deadline Mendatang",

    // Courses
    addCourse: "Tambah Mata Kuliah",
    editCourse: "Edit Mata Kuliah",
    deleteCourse: "Hapus Mata Kuliah",
    courseName: "Nama Mata Kuliah",
    courseDescription: "Deskripsi Mata Kuliah",
    selectColor: "Pilih Warna",
    noCourses: "Belum ada mata kuliah. Buat satu untuk memulai!",

    // Tasks
    addTask: "Tambah Tugas",
    editTask: "Edit Tugas",
    deleteTask: "Hapus Tugas",
    taskTitle: "Judul Tugas",
    taskDescription: "Deskripsi Tugas",
    deadline: "Deadline",
    priority: "Prioritas",
    status: "Status",
    low: "Rendah",
    medium: "Sedang",
    high: "Tinggi",
    belum: "Belum Dimulai",
    proses: "Sedang Dikerjakan",
    selesai: "Selesai",
    noTasks: "Belum ada tugas. Buat satu untuk memulai!",

    // Reminders
    setReminder: "Atur Pengingat",
    reminderSet: "Pengingat Diatur",
    upcomingReminders: "Pengingat Mendatang",

    // Common
    save: "Simpan",
    cancel: "Batal",
    delete: "Hapus",
    edit: "Edit",
    close: "Tutup",
    search: "Cari",
    noResults: "Tidak ada hasil",
    confirmDelete: "Apakah Anda yakin ingin menghapus ini?",
    success: "Berhasil",
    error: "Kesalahan",
  },
}

export type Language = "en" | "id"

export function useTranslation() {
  const [language, setLanguage] = useState<Language>("en")
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Get language from localStorage on mount
    const savedLanguage = localStorage.getItem("language") as Language | null
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
    setIsLoaded(true)
  }, [])

  const setLanguagePreference = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
  }

  const t = (key: keyof (typeof translations)["en"]): string => {
    return translations[language][key] || key
  }

  return {
    language,
    setLanguage: setLanguagePreference,
    t,
    isLoaded,
  }
}
