import { createClient } from "@/lib/supabase/client"

const supabase = createClient()

// Courses API
export const courseService = {
  async getCourses() {
    const { data, error } = await supabase.from("courses").select("*").order("created_at", { ascending: false })

    if (error) throw error
    return data
  },

  async createCourse(courseData: { title: string; description: string; color: string }) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Not authenticated")

    const { data, error } = await supabase
      .from("courses")
      .insert({
        title: courseData.title,
        description: courseData.description,
        color: courseData.color,
        owner_id: user.id,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateCourse(id: string, courseData: Partial<{ title: string; description: string; color: string }>) {
    const { data, error } = await supabase.from("courses").update(courseData).eq("id", id).select().single()

    if (error) throw error
    return data
  },

  async deleteCourse(id: string) {
    const { error } = await supabase.from("courses").delete().eq("id", id)

    if (error) throw error
  },
}

// Tasks API
export const taskService = {
  async getTasksByCourse(courseId: string) {
    const { data, error } = await supabase
      .from("tasks")
      .select("*, task_priorities(label), task_statuses(label)")
      .eq("course_id", courseId)
      .order("deadline", { ascending: true })

    if (error) throw error
    return data
  },

  async createTask(
    courseId: string,
    taskData: {
      title: string
      description: string
      deadline: string
      priority_id?: number
      status_id: number
    },
  ) {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Not authenticated")

    const { data, error } = await supabase
      .from("tasks")
      .insert({
        course_id: courseId,
        creator_id: user.id,
        ...taskData,
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  async updateTask(id: string, taskData: Partial<any>) {
    const { data, error } = await supabase.from("tasks").update(taskData).eq("id", id).select().single()

    if (error) throw error
    return data
  },

  async deleteTask(id: string) {
    const { error } = await supabase.from("tasks").delete().eq("id", id)

    if (error) throw error
  },
}

// Dashboard API
export const dashboardService = {
  async getStatistics() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Not authenticated")

    // Get total courses
    const { data: courses, count: totalCourses } = await supabase
      .from("courses")
      .select("id", { count: "exact" })
      .eq("owner_id", user.id)

    // Get all tasks for user's courses
    const courseIds = courses?.map((c) => c.id) || []

    if (courseIds.length === 0) {
      return {
        total_courses: 0,
        total_tasks: 0,
        completed_tasks: 0,
        upcoming_deadlines: 0,
        completion_percentage: 0,
      }
    }

    const { data: tasks } = await supabase.from("tasks").select("*, task_statuses(code)").in("course_id", courseIds)

    const totalTasks = tasks?.length || 0
    const completedTasks = tasks?.filter((t) => t.task_statuses?.code === "selesai").length || 0
    const upcomingDeadlines =
      tasks?.filter((t) => {
        const deadline = new Date(t.deadline)
        const now = new Date()
        return deadline > now && t.task_statuses?.code !== "selesai"
      }).length || 0

    const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    return {
      total_courses: totalCourses || 0,
      total_tasks: totalTasks,
      completed_tasks: completedTasks,
      upcoming_deadlines: upcomingDeadlines,
      completion_percentage: completionPercentage,
    }
  },
}

// Auth API
export const authService = {
  async signUp(email: string, password: string, fullName: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ||
          `${typeof window !== "undefined" ? window.location.origin : ""}`,
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) throw error
    return data
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error
    return data
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error) throw error
    return user
  },

  async getSession() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()
    if (error) throw error
    return session
  },
}
