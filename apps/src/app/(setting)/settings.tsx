import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  Switch,
  StatusBar,
  Platform,
} from 'react-native'
import { router } from 'expo-router'
import { AntDesign } from '@expo/vector-icons'
import IconCamera from '~/assets/icon-svg/setting/IconCamera'
import IconPracticeSetting from '~/assets/icon-svg/setting/IconPracticeSetting'
import IconBook from '~/assets/icon-svg/setting/IconBook'
import IconInformation from '~/assets/icon-svg/setting/IconInformation'
import IconPassword from '~/assets/icon-svg/setting/IconPassword'
import IconSupport from '~/assets/icon-svg/setting/IconSupport'
import { ERouteTable } from '@/constants/route-table'
import { useSettings } from '@/hooks/useSettings'
import { useEffect } from 'react'
import { useIsFocused } from '@react-navigation/native'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuth'

const SettingsScreen = () => {
  const { signOutMutation } = useAuth()

  const { userQuery, handleUpdateAvatar, userRankQuery } = useSettings()
  const isFocused = useIsFocused()
  const queryClient = useQueryClient()
  const isAndroid = Platform.OS === 'android'

  const onSignOut = async () => {
    try {
      await signOutMutation.mutateAsync()
    } catch (error: any) {
      console.log(error)
    }
  }

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ['user'],
    })
  }, [isFocused])

  return (
    <SafeAreaView className="bg-white h-full relative flex-1">
      <View className={`flex-row flex items-center pb-2 relative mb-4 ${isAndroid && 'mt-20'}`}>
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute ml-4 bottom-0 bg-[#64748B14] h-12 w-12 items-center justify-center rounded-full"
        >
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="font-bold text-[#1E293B] text-xl m-auto">Cài đặt</Text>
      </View>

      {/* Profile Image */}
      <View className="items-center">
        <View className="relative items-center mt-4 h-32 w-32">
          <Image
            style={{ width: 128, height: 128 }}
            className="rounded-2xl"
            source={{
              uri:
                userQuery?.data?.avatar !== 'https://res.cloudinary.com/dk0w90uw9/image/upload/null'
                  ? userQuery?.data?.avatar
                  : 'https://icons.veryicon.com/png/o/miscellaneous/rookie-official-icon-gallery/225-default-avatar.png',
            }}
          />
          <TouchableOpacity className="absolute -right-6 -bottom-6" onPress={handleUpdateAvatar}>
            <IconCamera />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Section */}
      <View className="mx-4 space-y-4 mt-12">
        <View className="flex-row justify-between bg-[#734DBE14] px-5 py-4 rounded-2xl border border-[#734DBE1F]">
          <View className="flex-row items-center gap-1">
            <IconPracticeSetting />
            <Text className="text-[#1E293B] font-semibold ml-1">Thực hành</Text>
          </View>
          <View className="flex-row items-center mt-1">
            <Text className="text-[#64748B] text-sm">
              #{userRankQuery.data?.practice?.rank || 0}
            </Text>
            <Text className="text-[#D14EA8] text-lg font-semibold ml-2">
              {userRankQuery.data?.practice?.rank || 0}
            </Text>
          </View>
        </View>
        <View className="flex-row justify-between bg-[#734DBE14] px-5 py-4 rounded-2xl border border-[#734DBE1F] mt-2">
          <View className="flex-row items-center gap-1">
            <IconBook />
            <Text className="text-[#1E293B] font-semibold ml-1">Học tập</Text>
          </View>
          <View className="flex-row items-center mt-1">
            <Text className="text-[#64748B] text-sm">
              #{userRankQuery.data?.learning?.rank || 0}
            </Text>
            <Text className="text-[#D14EA8] text-lg font-semibold ml-2">
              {userRankQuery.data?.learning?.score || 0}
            </Text>
          </View>
        </View>

        {/* Menu Items */}
        <View className="mt-8 space-y-4">
          {/* Tên người dùng */}
          <TouchableOpacity
            onPress={() => router.push(ERouteTable.EDIT_NAME)}
            className="flex-row justify-between items-center py-4 border-b border-b-[#64748B29]"
          >
            <Text className="text-[#1E293B] text-base">Tên người dùng</Text>
            <View className="flex-row items-center">
              <Text className="text-[#1E293B] mr-2 font-semibold">{userQuery.data?.fullName}</Text>
              <AntDesign name="right" size={16} color="#64748B" />
            </View>
          </TouchableOpacity>

          {/* Giới thiệu */}
          <TouchableOpacity
            onPress={() => router.push(ERouteTable.ABOUT_US)}
            className="flex-row justify-between items-center py-4 border-b border-b-[#64748B29]"
          >
            <View className="flex-row gap-2">
              <IconInformation />
              <Text className="text-[#1E293B] text-base">Giới thiệu</Text>
            </View>
            <AntDesign name="right" size={16} color="#64748B" />
          </TouchableOpacity>

          {/* Đổi mật khẩu */}
          <TouchableOpacity
            onPress={() => router.push(ERouteTable.RESET_PASSWORD)}
            className="flex-row justify-between items-center py-4 border-b border-b-[#64748B29]"
          >
            <View className="flex-row gap-2">
              <IconPassword />
              <Text className="text-[#1E293B] text-base">Đổi mật khẩu</Text>
            </View>
            <AntDesign name="right" size={16} color="#64748B" />
          </TouchableOpacity>

          {/* Hỗ trợ */}
          <TouchableOpacity
            onPress={() => router.push(ERouteTable.SUPPORT)}
            className="flex-row justify-between items-center py-4 border-b border-b-[#64748B29]"
          >
            <View className="flex-row gap-2">
              <IconSupport />
              <Text className="text-[#1E293B] text-base">Hỗ trợ</Text>
            </View>
            <AntDesign name="right" size={16} color="#64748B" />
          </TouchableOpacity>
        </View>

        {/* Đăng xuất */}
        <TouchableOpacity className="bg-[#734DBE] py-4 rounded-xl mt-20" onPress={onSignOut}>
          <Text className="text-white font-semibold text-center">Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default SettingsScreen
