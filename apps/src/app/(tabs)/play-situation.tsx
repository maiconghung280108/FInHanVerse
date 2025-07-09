import React from 'react'
import { View, Text, Image, TouchableOpacity, ImageBackground } from 'react-native'
import { images } from '@/constants'
import IconSetting from '~/assets/icon-svg/IconSetting'
import { router } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import { useSettings } from '@/hooks/useSettings'

export default function LearnScreen() {
  const { userQuery } = useSettings()

  return (
    <ImageBackground source={images.bgChoiCo} className="flex-1 bg-[#E3CBF7]">
      <View className="mt-20 mx-4 flex-1">
        <View className="flex-row justify-between w-full items-center">
          <Image
            source={{
              uri:
                userQuery?.data?.avatar ??
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoExoFiajbHD5Yxg0Bj2T9Wh2WfTRFAsdhSw&s',
            }}
            className="w-[48px] h-[48px] rounded-full"
            resizeMode="cover"
          />
          <Text className="font-semibold text-lg">Trò chơi</Text>
          <TouchableOpacity
            onPress={() => router.push(ERouteTable.SETTING_SCREEN)}
            className="w-[48px] h-[48px] bg-[#64748B14] items-center justify-center rounded-full"
          >
            <IconSetting />
          </TouchableOpacity>
        </View>
      </View>
      <View className="px-4 mb-8">
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: ERouteTable.SITUATION_SCREEN,
              params: { type: 'white' },
            })
          }
          className="bg-[#885BF0] w-full h-12 rounded-full items-center justify-center"
        >
          <Text className="font-semibold text-xl text-white">Tham gia ngay</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )
}
