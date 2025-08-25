// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7263'

// API Response types
interface ApiResponse<T> {
  data?: T
  message?: string
  success: boolean
  error?: string
}

// Generic API client
class ApiClient {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<ApiResponse<T> & { data: T }> {
    try {
      const url = `${this.baseUrl}${endpoint}`
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          // Add authentication headers here if needed
          // 'Authorization': `Bearer ${getAuthToken()}`,
          ...options.headers,
        },
        ...options,
      })

      // Handle different response types
      const contentType = response.headers.get('content-type')
      let data: any

      if (contentType?.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      return {
        data,
        success: true,
      }
    } catch (error) {
      console.error(`API Error - ${endpoint}:`, error)
      throw {
        data: null as T,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<T> {
    const response = await this.request<T>(endpoint, { method: 'GET' })
    return response.data
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<T> {
    const response = await this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
    return response.data
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<T> {
    const response = await this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
    return response.data
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    const response = await this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
    return response.data
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    const response = await this.request<T>(endpoint, { method: 'DELETE' })
    return response.data
  }
}

// Create and export the API client instance
export const api = new ApiClient(API_BASE_URL)

// Export the base URL for direct use if needed
export const API_URL = API_BASE_URL

// Export types
export type { ApiResponse }
