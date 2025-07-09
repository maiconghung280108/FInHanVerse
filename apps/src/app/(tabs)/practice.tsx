import React, { useState } from 'react'
import { Image, ImageBackground, Text, TouchableOpacity, View } from 'react-native'
import { images } from '@/constants'
import IconSetting from '~/assets/icon-svg/IconSetting'
import IconArrowLeft from '~/assets/icon-svg/IconArrowLeft'
import IconArrowRight from '~/assets/icon-svg/IconArrowRight'
import { router } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import { useSettings } from '@/hooks/useSettings'

export default function PracticeScreen() {
  const [activeState, setActiveState] = useState('Cơ bản')
  const { userQuery } = useSettings()

  const levels = ['Cơ bản', 'Trung cấp', 'Nâng cao']

  const handlePreviousLevel = () => {
    const currentIndex = levels.indexOf(activeState)
    const newIndex = currentIndex === 0 ? levels.length - 1 : currentIndex - 1
    setActiveState(levels[newIndex])
  }

  const handleNextLevel = () => {
    const currentIndex = levels.indexOf(activeState)
    const newIndex = currentIndex === levels.length - 1 ? 0 : currentIndex + 1
    setActiveState(levels[newIndex])
  }

  const renderState = (): string => {
    switch (activeState) {
      case 'Cơ bản':
        return 'BEGINNER'
      case 'Trung cấp':
        return 'INTERMEDIATE'
      default:
        return 'ADVANCED'
    }
  }

  return (
    <ImageBackground source={images.bgPractice} resizeMode="cover" className="h-full">
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
          <Text className="text-white font-semibold text-lg">Trò chơi</Text>
          <TouchableOpacity
            onPress={() => router.push(ERouteTable.SETTING_SCREEN)}
            className="w-[48px] h-[48px] bg-[#64748B14] items-center justify-center rounded-full"
          >
            <IconSetting />
          </TouchableOpacity>
        </View>
      </View>
      <View className="mx-4 mb-8">
        <View className="flex-row w-full items-center justify-center">
          <TouchableOpacity onPress={handlePreviousLevel}>
            <IconArrowLeft />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: ERouteTable.PRACTICE_CHILDREN,
                params: { level: renderState() },
              })
            }}
            className="bg-[#662DEC] mx-8 h-[58px] w-[150px] items-center justify-center rounded-full"
          >
            <Text className="text-white opacity-[48%]">Độ khó</Text>
            <Text className="text-white mt-1 font-semibold">{activeState}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextLevel}>
            <IconArrowRight />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  )
}
