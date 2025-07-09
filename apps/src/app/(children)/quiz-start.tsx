import { images } from '@/constants'
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native'

import React from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import { AntDesign } from '@expo/vector-icons'
import { ERouteTable } from '@/constants/route-table'

const QuizStart = () => {
  const { coursesId, type, score, title, titleLesson, totalScore } = useLocalSearchParams<{
    coursesId: string
    type: string
    score: string
    title: string
    titleLesson: string
    totalScore: string
  }>()

  return (
    <ImageBackground source={images.quizStart} className="h-full flex-1">
      <View className="mx-4 flex-1 mt-20">
        <View className="flex-row">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-white h-12 w-12 items-center justify-center rounded-full"
          >
            <AntDesign name="left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="capitalize font-semibold text-lg flex-1 mr-10 mt-2 text-center">
            Trắc Nghiệm {title}
          </Text>
        </View>
        <View className="items-center mt-[50vh]">
          <Text className="text-lg font-semibold">{titleLesson}</Text>
          <Text className="text-3xl text-[#885BF0] mt-2 font-semibold">
            {Number(score) > 0 ? 'Điểm cao nhất' : 'Ai cũng có lần đầu'}
          </Text>
          {Number(score) > 0 && (
            <View className="flex-row items-center mt-8 border-white border px-7 py-2 rounded-2xl bg-[#00BCD4]">
              <Text className="text-white text-3xl font-semibold">
                {score}/{totalScore}
              </Text>
              <Text className="text-white text-xs">điểm</Text>
            </View>
          )}
        </View>
      </View>
      <View className="mb-12 px-4">
        <TouchableOpacity
          className="bg-[#885BF0] h-12 rounded-full items-center justify-center"
          onPress={() =>
            router.push({
              pathname: ERouteTable.QUESTION_SCREEN,
              params: {
                coursesId: coursesId,
                type: type,
              },
            })
          }
        >
          <Text className="text-white font-semibold text-lg">Bắt đầu</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )
}
export default QuizStart
