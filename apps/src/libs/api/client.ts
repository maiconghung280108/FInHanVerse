import { useAuthStore } from '@/store/useAuthStore'
import axios from 'axios'
import { API_BASE_URL, API_TIMEOUT, DEBUG_API, TENANT_ID } from '../env'
import { AuthRoutes } from '@/libs/api/routes/auth-routes'

let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

const refreshToken = async () => {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject })
    })
  }

  isRefreshing = true
  const { setToken, refreshToken, user, setRefreshToken, signOut } = useAuthStore.getState()

  if (!refreshToken) {
    signOut()
    return Promise.reject(new Error('No refresh token available'))
  }

  try {
    const response = await API_CLIENT.post(AuthRoutes.auth.refresh, {
      refreshToken: refreshToken,
      userId: user?.id || user?.userId || 0,
    })
    const { access_token, refresh_token } = response.data
    setToken(access_token)
    setRefreshToken(refresh_token)
    processQueue(null, access_token)
    return access_token
  } catch (error) {
    processQueue(error, null)
    signOut()
    throw error
  } finally {
    isRefreshing = false
  }
}

const API_CLIENT = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'x-tenant-id': TENANT_ID,
  },
})

// Request interceptor
API_CLIENT.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Debug logging in development
    if (DEBUG_API) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
      if (config.data) {
        console.log('📦 Request Data:', config.data)
      }
    }

    return config
  },
  (error) => {
    if (DEBUG_API) {
      console.error('❌ Request Error:', error)
    }
    return Promise.reject(error)
  },
)

// Response interceptor
API_CLIENT.interceptors.response.use(
  (response) => {
    if (DEBUG_API) {
      console.log(
        `✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`,
      )
      console.log('📥 Response Data:', response.data)
    }
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Debug logging in development
    if (DEBUG_API) {
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`)
      console.error('📛 Error Details:', {
        status: error.response?.status,
        message: error.message,
        data: error.response?.data,
      })
    }

    // Handle 401 errors with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      const { refreshToken: storedRefreshToken } = useAuthStore.getState()

      // 🛑 Không cố refresh nếu refresh token đã bị xóa (logout)
      if (!storedRefreshToken) {
        if (DEBUG_API) {
          console.warn('🔒 No refresh token found. Probably already logged out.')
        }
        return Promise.reject(error)
      }

      originalRequest._retry = true

      try {
        const newToken = await refreshToken()
        originalRequest.headers.Authorization = `Bearer ${newToken}`
        return API_CLIENT(originalRequest)
      } catch (refreshError) {
        if (DEBUG_API) {
          console.error('🔄 Token refresh failed:', refreshError)
        }
        return Promise.reject(refreshError)
      }
    }

    // Handle network errors
    if (error.code === 'NETWORK_ERROR' || error.message === 'Network Error') {
      if (DEBUG_API) {
        console.error('🌐 Network Error - Check your internet connection')
      }
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      if (DEBUG_API) {
        console.error('⏰ Request timeout - Server took too long to respond')
      }
    }

    return Promise.reject(error)
  },
)

export default API_CLIENT
