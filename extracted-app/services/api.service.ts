/**
 * API service for making HTTP requests
 * This is a framework-agnostic implementation that can be adapted to any HTTP client
 */

import { logger } from './logger'

/**
 * Options for API requests
 */
export interface ApiRequestOptions {
  /** HTTP method */
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  /** Request headers */
  headers?: Record<string, string>
  /** Request body */
  body?: any
  /** Whether to include credentials */
  withCredentials?: boolean
  /** Timeout in milliseconds */
  timeout?: number
}

/**
 * Interface for the API service
 */
export interface IApiService {
  /**
   * Set the authentication token
   * @param token The authentication token
   */
  setAuthToken(token: string): void

  /**
   * Make a GET request
   * @param url The URL to request
   * @param options Request options
   * @returns Promise resolving with the response data
   */
  get<T = any>(url: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<T>

  /**
   * Make a POST request
   * @param url The URL to request
   * @param data The data to send
   * @param options Request options
   * @returns Promise resolving with the response data
   */
  post<T = any>(url: string, data?: any, options?: Omit<ApiRequestOptions, 'method'>): Promise<T>

  /**
   * Make a PUT request
   * @param url The URL to request
   * @param data The data to send
   * @param options Request options
   * @returns Promise resolving with the response data
   */
  put<T = any>(url: string, data?: any, options?: Omit<ApiRequestOptions, 'method'>): Promise<T>

  /**
   * Make a DELETE request
   * @param url The URL to request
   * @param options Request options
   * @returns Promise resolving with the response data
   */
  delete<T = any>(url: string, options?: Omit<ApiRequestOptions, 'method'>): Promise<T>

  /**
   * Make a request with custom options
   * @param url The URL to request
   * @param options Request options
   * @returns Promise resolving with the response data
   */
  request<T = any>(url: string, options: ApiRequestOptions): Promise<T>
}

/**
 * Default implementation of the API service using fetch
 * This can be replaced with any HTTP client in the new framework
 */
export class ApiService implements IApiService {
  private baseUrl: string
  private authToken: string = ''
  private defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }

  constructor(baseUrl: string = '') {
    this.baseUrl = baseUrl
  }

  /**
   * Set the authentication token
   * @param token The authentication token
   */
  setAuthToken(token: string): void {
    this.authToken = token
  }

  /**
   * Make a GET request
   * @param url The URL to request
   * @param options Request options
   * @returns Promise resolving with the response data
   */
  async get<T = any>(url: string, options?: Omit<ApiRequestOptions, 'method' | 'body'>): Promise<T> {
    return this.request<T>(url, { ...options, method: 'GET' })
  }

  /**
   * Make a POST request
   * @param url The URL to request
   * @param data The data to send
   * @param options Request options
   * @returns Promise resolving with the response data
   */
  async post<T = any>(url: string, data?: any, options?: Omit<ApiRequestOptions, 'method'>): Promise<T> {
    return this.request<T>(url, { ...options, method: 'POST', body: data })
  }

  /**
   * Make a PUT request
   * @param url The URL to request
   * @param data The data to send
   * @param options Request options
   * @returns Promise resolving with the response data
   */
  async put<T = any>(url: string, data?: any, options?: Omit<ApiRequestOptions, 'method'>): Promise<T> {
    return this.request<T>(url, { ...options, method: 'PUT', body: data })
  }

  /**
   * Make a DELETE request
   * @param url The URL to request
   * @param options Request options
   * @returns Promise resolving with the response data
   */
  async delete<T = any>(url: string, options?: Omit<ApiRequestOptions, 'method'>): Promise<T> {
    return this.request<T>(url, { ...options, method: 'DELETE' })
  }

  /**
   * Make a request with custom options
   * @param url The URL to request
   * @param options Request options
   * @returns Promise resolving with the response data
   */
  async request<T = any>(url: string, options: ApiRequestOptions): Promise<T> {
    const { method = 'GET', headers = {}, body, withCredentials = false, timeout } = options
    
    // Prepare request URL
    const requestUrl = this.baseUrl ? `${this.baseUrl}${url}` : url
    
    // Prepare headers
    const requestHeaders: Record<string, string> = {
      ...this.defaultHeaders,
      ...headers,
    }
    
    // Add auth token if available
    if (this.authToken) {
      requestHeaders['Xahod-Auth-Token'] = this.authToken
    }
    
    // Prepare request options
    const requestOptions: RequestInit = {
      method,
      headers: requestHeaders,
      credentials: withCredentials ? 'include' : 'same-origin',
    }
    
    // Add body for non-GET requests
    if (body && method !== 'GET') {
      requestOptions.body = typeof body === 'object' ? JSON.stringify(body) : body
    }
    
    try {
      // Create abort controller for timeout
      const controller = new AbortController()
      requestOptions.signal = controller.signal
      
      // Set timeout if specified
      let timeoutId: number | undefined
      if (timeout) {
        timeoutId = window.setTimeout(() => controller.abort(), timeout)
      }
      
      // Make request
      logger.debug(`API ${method} request to ${requestUrl}`)
      const response = await fetch(requestUrl, requestOptions)
      
      // Clear timeout
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId)
      }
      
      // Handle response
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw new Error(
          errorData?.error?.message || 
          `API request failed with status ${response.status}: ${response.statusText}`
        )
      }
      
      // Parse response
      const contentType = response.headers.get('content-type')
      if (contentType?.includes('application/json')) {
        return await response.json()
      } else {
        return await response.text() as unknown as T
      }
    } catch (error) {
      logger.error(`API request error: ${error instanceof Error ? error.message : String(error)}`)
      throw error
    }
  }
}

// Export a singleton instance
export const apiService: IApiService = new ApiService()