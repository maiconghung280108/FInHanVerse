import { ImageBackground, Platform, Text, TouchableOpacity, View } from 'react-native'
import { images } from '@/constants'
import { router, useLocalSearchParams } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import React from 'react'

const ResultSituation = () => {
  const {
    type,
    totalScore = '0',
    maxScore = '0',
  } = useLocalSearchParams<{
    type: string
    totalScore?: string
    maxScore?: string
  }>()
  const isAndroid = Platform.OS === 'android'

  return (
    <ImageBackground
      className="h-full flex-1"
      source={type === 'win' ? images.quizSuccess : images.quizUnSuccess}
    >
      <View className={`flex-1 px-4 ${isAndroid && 'mt-20'}`}>
        <View className="flex-1 items-center justify-center mt-80">
          {/* Tiêu đề thắng/thua */}
          <Text
            className={`text-3xl font-bold ${type === 'win' ? 'text-[#008E4A]' : 'text-[#D32F2F]'}`}
          >
            {type === 'win' ? 'Bạn đã thắng!' : 'Bạn đã thua!'}
          </Text>

          {/* Thông điệp */}
          <Text className="text-center px-20 mt-6 text-base text-gray-800">
            {type === 'win'
              ? `Tiết kiệm có thể chậm, nhưng đó là bước quan trọng nhất để trở nên giàu có!`
              : 'Muốn trở thành chuyên gia tài chính? Hãy bắt đầu bằng cách không lơ là với đồng tiền của mình!'}
          </Text>

          {/* Phần hiển thị điểm */}
          <View className="mt-8 bg-white/80 px-6 py-4 rounded-xl shadow-md">
            <Text className="text-lg font-semibold text-gray-900">Điểm của bạn</Text>
            <Text className="text-2xl font-bold text-purple-700 mt-2">
              {totalScore} / {maxScore}
            </Text>
          </View>
        </View>
      </View>

      {/* Nút quay lại chế độ chơi */}
      <View className="px-4 mb-10">
        <TouchableOpacity
          className="bg-[#734DBE] py-3 px-6 rounded-full"
          onPress={() => router.push(ERouteTable.SITUATION_SCREEN)}
        >
          <Text className="text-white text-center font-semibold text-lg">Về chế độ chơi</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )
}

export default ResultSituation
