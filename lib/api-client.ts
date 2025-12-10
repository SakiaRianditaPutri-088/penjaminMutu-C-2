const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

interface ApiResponse<T> {
  data?: T
  message?: string
  error?: string
}

class ApiClient {
  private baseUrl: string
  private token: string | null = null

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('access_token')
    }
  }

  setToken(token: string | null) {
    this.token = token
    if (token && typeof window !== 'undefined') {
      localStorage.setItem('access_token', token)
    } else if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token')
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`
    }

    try {
      console.log('API Request:', { url, method: options.method || 'GET' })
      
      const response = await fetch(url, {
        ...options,
        headers,
      })

      console.log('API Response:', { 
        status: response.status, 
        statusText: response.statusText,
        ok: response.ok 
      })

      let data: any
      const contentType = response.headers.get('content-type')
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
        console.log('API Response Data:', data)
      } else {
        const text = await response.text()
        console.error('Non-JSON response:', text)
        throw new Error(`Invalid response: ${text}`)
      }

      if (!response.ok) {
        // Extract error message from response
        let errorMessage = 'Request failed'
        
        if (data) {
          if (typeof data === 'string') {
            errorMessage = data
          } else if (data.error) {
            errorMessage = data.error
          } else if (data.message) {
            errorMessage = data.message
          } else if (data.msg) {
            errorMessage = data.msg
          }
        }
        
        // Add status code if no specific error message
        if (errorMessage === 'Request failed') {
          errorMessage = `Request failed with status ${response.status}`
        }
        
        console.error('API Error:', {
          url,
          status: response.status,
          error: errorMessage,
          data
        })
        
        throw new Error(errorMessage)
      }

      return data as T
    } catch (error: any) {
      console.error('API Request Error:', error)
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new Error('Failed to connect to server. Make sure backend is running on http://localhost:8000')
      }
      
      // Re-throw with original message
      if (error.message) {
        throw error
      }
      
      throw new Error('Unknown error occurred: ' + String(error))
    }
  }

  // Auth endpoints
  async register(email: string, password: string, fullName: string) {
    const response = await this.request<{
      message: string
      access_token: string
      user: {
        id: string
        email: string
        full_name: string
      }
    }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, full_name: fullName }),
    })

    if (response.access_token) {
      this.setToken(response.access_token)
    }

    return response
  }

  async login(email: string, password: string) {
    const response = await this.request<{
      message: string
      access_token: string
      user: {
        id: string
        email: string
        full_name: string
      }
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })

    if (response.access_token) {
      this.setToken(response.access_token)
    }

    return response
  }

  async getCurrentUser() {
    return this.request<{
      id: string
      email: string
      full_name: string
      provider: string
      is_active: boolean
      created_at: string
    }>('/auth/me')
  }

  async logout() {
    await this.request('/auth/logout', { method: 'POST' })
    this.setToken(null)
  }

  // Courses endpoints
  async getCourses() {
    return this.request<any[]>('/courses')
  }

  async createCourse(courseData: { title: string; description: string; color: string }) {
    return this.request<any>('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    })
  }

  async updateCourse(id: string, courseData: Partial<{ title: string; description: string; color: string }>) {
    return this.request<any>(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    })
  }

  async deleteCourse(id: string) {
    return this.request(`/courses/${id}`, {
      method: 'DELETE',
    })
  }

  // Tasks endpoints
  async getTasksByCourse(courseId: string) {
    return this.request<any[]>(`/courses/${courseId}/tasks`)
  }

  async createTask(courseId: string, taskData: {
    title: string
    description: string
    deadline: string
    priority_code?: string
    status_code: string
  }) {
    return this.request<any>(`/courses/${courseId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(taskData),
    })
  }

  async updateTask(id: string, taskData: Partial<any>) {
    return this.request<any>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    })
  }

  async deleteTask(id: string) {
    return this.request(`/tasks/${id}`, {
      method: 'DELETE',
    })
  }

  // Lookups
  async getTaskStatuses() {
    return this.request<any[]>('/lookups/task-statuses')
  }

  async getTaskPriorities() {
    return this.request<any[]>('/lookups/task-priorities')
  }
}

export const apiClient = new ApiClient(API_BASE_URL)

