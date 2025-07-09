import { Image, ImageBackground, Text, TouchableOpacity, View } from 'react-native'
import { router } from 'expo-router'
import { AntDesign } from '@expo/vector-icons'
import { images } from '@/constants'
import ChessExample from '@/components/ChessExample'
import IconTalk from '~/assets/icon-svg/IconTalk'
import { useState } from 'react'

const LearnChess = () => {
  const [noti, setNoti] = useState('Đến lượt quân trắng đi')

  return (
    <ImageBackground source={images.bgPlayChess} className=" h-full">
      <View className="flex-row flex items-center pb-2 relative mb-4 mt-20">
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute ml-4 bottom-0 bg-[#64748B14] h-12 w-12 items-center justify-center rounded-full"
        >
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="font-bold text-[#1E293B] text-xl m-auto">Ví dụ</Text>
      </View>
      <View className="mt-10 flex-row gap-2">
        <Image source={images.iconHuman} className="h-36 w-36" />
        <View className="relative">
          <Text className="absolute z-20 left-6 top-4">{noti}</Text>
          <IconTalk />
        </View>
      </View>
      {/*start handle ui play chess*/}
      <View className="mt-6">
        <ChessExample setNoti={setNoti} />
      </View>
      {/*end handle ui play chess*/}
    </ImageBackground>
  )
}

export default LearnChess
