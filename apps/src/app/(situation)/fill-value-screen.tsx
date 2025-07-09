import React, { useState } from 'react'
import { View, Text, TouchableOpacity, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AntDesign } from '@expo/vector-icons'
import { router } from 'expo-router'
import IconSend from '~/assets/icon-svg/IconSend'
import { useToast } from '@/components/ToastNotify/ToastContext'
import { ERouteTable } from '@/constants/route-table'
import { Question, QUESTIONS } from '@/data/mini-game/fill-value'

const NUMBER_OF_QUESTIONS = 5 // Tổng số câu hỏi

export default function FillValueScreen() {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [input, setInput] = useState('')
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const { showToast } = useToast()

  const [listQues] = useState<Question[]>(
    [...QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, NUMBER_OF_QUESTIONS),
  )

  const currentQuestion: Question = listQues[questionIndex]

  const handleSubmit = () => {
    if (!input.trim()) {
      showToast('Vui lòng nhập câu trả lời!', 'error')
      return
    }

    const userAnswer = parseFloat(input.replace(/[^\d]/g, ''))
    const correct = userAnswer === currentQuestion.answer

    setIsCorrect(correct)
    setHasSubmitted(true)

    setScore((prev) => prev + (correct ? 100 : 0))
  }

  // Xử lý chuyển câu hỏi hoặc kết thúc
  const handleNext = () => {
    const nextIndex = questionIndex + 1

    if (nextIndex < listQues.length) {
      // còn câu hỏi => chuyển tiếp
      setQuestionIndex(nextIndex)
      // reset trạng thái
      setInput('')
      setHasSubmitted(false)
      setIsCorrect(false)
    } else {
      // hết câu hỏi => chuyển màn hình kết quả
      router.push({
        pathname: ERouteTable.RESULT_SITUATION,
        params: {
          type: score >= listQues.length * 100 * 0.7 ? 'win' : 'lose',
          totalScore: score,
          maxScore: listQues.length * 100,
        },
      })
    }
  }

  // định dạng số với dấu chấm hàng nghìn
  const formatNumber = (num: number): string => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center p-4">
        <TouchableOpacity
          onPress={() => router.back()}
          className="bg-slate-600/5 h-12 w-12 items-center justify-center rounded-3xl"
        >
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="flex-1 text-center text-lg font-semibold mr-10">
          Điền giá trị ({questionIndex + 1}/{listQues.length})
        </Text>
      </View>

      {/* Nội dung */}
      <View className="flex-1 p-4">
        {/* Câu hỏi */}
        <Text className="text-center mb-6 text-base leading-6 text-gray-800">
          {currentQuestion.question}
        </Text>

        {/* Input row */}
        <Text className="font-semibold mb-2">Nhập câu trả lời</Text>
        <View className="flex-row gap-2 items-center mb-4">
          <TextInput
            className={`
              flex-1 border-2 rounded-2xl h-12 px-2 text-base bg-white
              ${
                hasSubmitted
                  ? isCorrect
                    ? 'border-green-500 bg-green-50'
                    : 'border-red-500 bg-red-50'
                  : 'border-purple-400'
              }
            `}
            value={input}
            onChangeText={setInput}
            placeholder="Nhập câu trả lời"
            keyboardType="numeric"
            editable={!hasSubmitted}
          />
          {!hasSubmitted && (
            <TouchableOpacity onPress={handleSubmit}>
              <IconSend />
            </TouchableOpacity>
          )}
        </View>

        {/* Hiển thị kết quả câu vừa trả lời */}
        {hasSubmitted && (
          <View className="bg-gray-50 p-4 rounded-xl mb-4">
            <View className="flex-row items-center mb-3">
              {isCorrect ? (
                <>
                  <AntDesign name="checkcircle" size={24} color="#1DB954" />
                  <Text className="text-green-500 text-lg font-bold ml-2">Chính xác!</Text>
                </>
              ) : (
                <>
                  <AntDesign name="closecircle" size={24} color="#FF4444" />
                  <Text className="text-red-500 text-lg font-bold ml-2">Chưa đúng!</Text>
                </>
              )}
            </View>
            <Text className="text-base font-semibold text-gray-800 mb-2">
              Đáp án đúng:{' '}
              <Text className="text-green-500 font-bold text-lg">
                {formatNumber(currentQuestion.answer)} {currentQuestion.answer >= 1000 ? 'VND' : ''}
              </Text>
            </Text>
            <Text className="text-gray-600 text-sm italic">{currentQuestion.explanation}</Text>
          </View>
        )}
      </View>

      {/* Nút Next / Finish */}
      <View className="px-4">
        <TouchableOpacity
          className={`
            rounded-full py-4 items-center mt-6
            ${hasSubmitted ? 'bg-[#734DBE]' : 'bg-gray-400'}
          `}
          onPress={hasSubmitted ? handleNext : undefined}
          disabled={!hasSubmitted}
        >
          <Text className="text-white font-bold text-lg">
            {questionIndex + 1 < listQues.length ? 'Câu tiếp' : 'Kết thúc'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
