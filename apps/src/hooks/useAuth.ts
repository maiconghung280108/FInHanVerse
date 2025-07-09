import { useMutation, useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/useAuthStore'
import API_CLIENT from '@/libs/api/client'
import { AuthRoutes } from '@/libs/api/routes/auth-routes'
import { _queryClient } from '@/context/QueryProvider'
import { useRouter } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import { useToast } from '@/components/ToastNotify/ToastContext'

export function useAuth() {
  const { setUser, signOut, setToken, token, setRefreshToken } = useAuthStore()
  const router = useRouter()
  const { showToast } = useToast()

  // ✅ Mutation for sign in
  const signInMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      // Login and get token
      const response = await API_CLIENT.post(AuthRoutes.auth.signIn, {
        email,
        password,
      })
      return response.data
    },
    onSuccess: async (data: { access_token: string; refresh_token: string }) => {
      const { access_token, refresh_token } = data
      setToken(access_token)
      setRefreshToken(refresh_token)
      // 🟡 Gọi profile API để lấy thông tin người dùng
      const profileRes = await API_CLIENT.get(AuthRoutes.auth.me)

      // 🟡 Lưu user
      setUser(profileRes.data)

      await _queryClient.invalidateQueries({ queryKey: ['user'] })
      // ✅ Store user in Zustand
      showToast('Đăng nhập thành công!', 'success')
      router.replace(ERouteTable.HOME) // ✅ Redirect after login
    },
    onError: (error) => {
      showToast('Có lỗi xảy ra vui lòng thử lại!', 'error')
    },
  })
  // Thêm vào trong file useAuth.js
  const signUpMutation = useMutation({
    mutationFn: async ({
      fullName,
      email,
      password,
    }: {
      fullName: string
      email: string
      password: string
    }) => {
      const response = await API_CLIENT.post(AuthRoutes.auth.signUp, {
        fullName,
        email,
        password,
      })
      return response.data
    },
    onSuccess: () => {
      showToast('Đăng ký thành công! Vui lòng đăng nhập.', 'success')
      router.push(ERouteTable.SIGIN_IN)
    },
    onError: (error) => {
      showToast('Đăng ký thất bại!', 'error')
    },
  })

  const forgotPasswordMutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const response = await API_CLIENT.post(AuthRoutes.auth.forgotPassword, {
        email,
      })
      return response.data
    },
    onSuccess: (res, variables) => {
      router.push({
        pathname: ERouteTable.VERIFY_ACCOUNT,
        params: { email: variables.email },
      })
    },
    onError: (error) => {
      showToast('Có lỗi xảy ra vui lòng thử lại!', 'error')
    },
  })

  const resendPasswordMutation = useMutation({
    mutationFn: async ({ email }: { email: string }) => {
      const response = await API_CLIENT.post(AuthRoutes.auth.forgotPassword, {
        email,
      })
      return response.data
    },
    onSuccess: () => {
      showToast('Gửi lại otp thành công!', 'success')
    },
    onError: (error) => {
      showToast('Có lỗi xảy ra vui lòng thử lại!', 'error')
    },
  })

  const verifyOtpMutation = useMutation({
    mutationFn: async ({ email, otpCode }: { email: string; otpCode: string }) => {
      const response = await API_CLIENT.post(AuthRoutes.auth.verifyOtp, {
        email,
        otpCode,
      })
      return response.data
    },
    onSuccess: (res, variables) => {
      router.push({
        pathname: ERouteTable.CHANGE_PASSWORD,
        params: { email: variables.email },
      })
    },
    onError: (error) => {
      showToast('Có lỗi xảy ra vui lòng thử lại!', 'error')
    },
  })

  const resetPasswordMutation = useMutation({
    mutationFn: async ({
      email,
      password,
      confirmPassword,
    }: {
      email: string
      password: string
      confirmPassword: string
    }) => {
      const response = await API_CLIENT.post(AuthRoutes.auth.resetPassword, {
        email,
        password,
        confirmPassword,
      })
      return response.data
    },
    onSuccess: () => {
      showToast('Đổi mật khẩu thành công! Vui lòng đăng nhập lại.', 'success')
      router.push(ERouteTable.SIGIN_IN)
    },
    onError: (error) => {
      showToast('Có lỗi xảy ra vui lòng thử lại!', 'error')
    },
  })

  // ✅ Fetch authenticated user
  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { token } = useAuthStore.getState()
      if (!token) return null
      try {
        const profileRes = await API_CLIENT.get(AuthRoutes.auth.me)
        setUser(profileRes.data)
        return profileRes.data || null
      } catch (error) {
        console.error('Error fetching user:', error)
        return null
      }
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: false,
  })

  // ✅ Mutation for logout
  const signOutMutation = useMutation({
    mutationFn: async () => {
      // await API_CLIENT.post('/auth/sign-out') // ✅ Call logout API
    },
    onSuccess: async () => {
      signOut() // ✅ Clear Zustand store
      setTimeout(() => {
        _queryClient.invalidateQueries({ queryKey: ['user'] })
      }, 0)
      router.replace(ERouteTable.SIGIN_IN) // ✅ Redirect to login page
    },
  })

  return {
    signInMutation,
    signOutMutation,
    signUpMutation,
    userQuery,
    forgotPasswordMutation,
    resendPasswordMutation,
    verifyOtpMutation,
    resetPasswordMutation,
  }
}
