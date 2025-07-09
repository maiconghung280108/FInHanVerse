import { Image, Text, TouchableOpacity, View } from 'react-native'
import { router } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import IconSetting from '~/assets/icon-svg/IconSetting'
import React from 'react'
import { useSettings } from '@/hooks/useSettings'

export default function HeaderSetting() {
  const { userQuery } = useSettings()

  return (
    <View className="flex-row justify-between w-full items-center bg-[#e8d8f5] pt-14 pb-4 px-4">
      <Image
        source={{
          uri:
            userQuery?.data?.avatar ??
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoExoFiajbHD5Yxg0Bj2T9Wh2WfTRFAsdhSw&s',
        }}
        className="w-[48px] h-[48px] rounded-full"
        resizeMode="cover"
      />
      <Text className="font-semibold text-lg">Xếp hạng</Text>
      <TouchableOpacity
        onPress={() => router.push(ERouteTable.SETTING_SCREEN)}
        className="w-[48px] h-[48px] bg-[#64748B14] items-center justify-center rounded-full"
      >
        <IconSetting />
      </TouchableOpacity>
    </View>
  )
}
