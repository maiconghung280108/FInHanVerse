import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import API_CLIENT from '@/libs/api/client'
import { Routes } from '@/libs/api/routes/routes'
import { useAuthStore } from '@/store/useAuthStore'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import { useToast } from '@/components/ToastNotify/ToastContext'

export function useSettings() {
  const { setUser } = useAuthStore()
  const queryClient = useQueryClient()
  const { showToast } = useToast()

  // Query for user data
  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await API_CLIENT.get(Routes.settings.getUser)
      return response.data
    },
  })

  const loseWinQuery = useQuery({
    queryKey: ['lose-win'],
    queryFn: async () => {
      const response = await API_CLIENT.get(Routes.chess.getWinLose)
      return response.data
    },
  })

  const userRankQuery = useQuery({
    queryKey: ['rank-user'],
    queryFn: async () => {
      const response = await API_CLIENT.get(Routes.settings.rankUser)
      return response.data
    },
  })

  // Mutation for updating avatar
  const updateAvatarMutation = useMutation({
    mutationFn: async (imageUri: string) => {
      const formData = new FormData()
      formData.append('file', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'avatar.jpg',
      } as any)

      const response = await API_CLIENT.post(Routes.settings.updateAvatar, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      return response.data
    },
    onSuccess: (data) => {
      showToast('Cập nhật ảnh đại diện thành công!', 'success')
      queryClient.invalidateQueries({
        queryKey: ['user'],
      })
      // router.replace(ERouteTable.SETTING_SCREEN)
    },
  })

  // Function to handle avatar update
  const handleUpdateAvatar = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== 'granted') {
        showToast('Sorry, we need camera roll permissions to make this work!', 'error')
        return
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      })

      if (!result.canceled) {
        await updateAvatarMutation.mutateAsync(result.assets[0].uri)
      }
    } catch (error: any) {
      showToast('Có lỗi xảy ra vui lòng thử sai sau!', 'error')
    }
  }

  const changePasswordMutation = useMutation({
    mutationFn: async (data: { oldPassword: string; newPassword: string }) => {
      const response = await API_CLIENT.patch(Routes.settings.changePassword, data)
      return response.data
    },
    onSuccess: () => {
      showToast('Đổi mật khẩu thành công!', 'success')
      router.replace(ERouteTable.SIGIN_IN)
    },
    onError: (error) => {
      console.error('Error changing password:', error)
      showToast('Có lỗi xảy ra vui lòng thử sai sau!', 'error')
    },
  })

  const updateNameMutation = useMutation({
    mutationFn: async (data: { fullName: string }) => {
      const response = await API_CLIENT.patch(Routes.settings.changeName, data)
      return response.data
    },
    onSuccess: (data) => {
      showToast('Đổi tên thành công!', 'success')
      setUser(data)
      router.back()
    },
    onError: (error) => {
      console.error('Error updating name:', error)
      showToast('Có lỗi xảy ra vui lòng thử sai sau!', 'error')
    },
  })

  return {
    userQuery,
    handleUpdateAvatar,
    changePasswordMutation,
    updateNameMutation,
    userRankQuery,
    loseWinQuery,
  }
}
