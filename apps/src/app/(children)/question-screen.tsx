import {
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
  ImageBackground, Platform,
} from 'react-native'
import React, { useState } from 'react'
import { AntDesign } from '@expo/vector-icons'
import { router, useLocalSearchParams } from 'expo-router'
import { images } from '@/constants'
import { ERouteTable } from '@/constants/route-table'
import { useQuestion } from '@/hooks/useQuestion'

const QuestionScreen = () => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [answers, setAnswers] = useState<{ questionId: number; answerIds: number[] }[]>([])
  const { coursesId, type } = useLocalSearchParams<{ coursesId: string; type: string }>()
  const { quizQuery, submitQuiz } = useQuestion(coursesId, Number(type))
  const isAndroid = Platform.OS === 'android';

  const currentQuestion = quizQuery.data?.questions[currentQuestionIndex]

  const handleSelectAnswer = (answerId: number) => {
    if (isProcessing) return
    setSelectedAnswer(answerId)
    setIsProcessing(true)

    setTimeout(() => {
      setShowFeedback(true)
      setIsProcessing(false)
      const selectedAnswerObj = currentQuestion?.answers.find((a) => a.id === answerId)
      if (selectedAnswerObj?.isCorrect) {
        setScore(score + 1)
      }
    }, 1000)
  }

  const handleNextQuestion = async () => {
    if (selectedAnswer !== null && currentQuestion) {
      const newAnswers = [
        ...answers,
        {
          questionId: currentQuestion.id,
          answerIds: [selectedAnswer],
        },
      ]

      if (currentQuestionIndex < (quizQuery.data?.questions.length || 0) - 1) {
        setAnswers(newAnswers)
        setCurrentQuestionIndex(currentQuestionIndex + 1)
        setSelectedAnswer(null)
        setShowFeedback(false)
        setIsProcessing(false)
      } else {
        await submitQuiz.mutate({
          quizId: quizQuery.data?.courseData?.id,
          userAnswers: newAnswers.map((answer) => ({
            questionId: answer.questionId,
            answerIds: answer.answerIds,
          })),
        })
        setShowResult(true)
      }
    }
  }

  if (quizQuery.isLoading) {
    return (
      <SafeAreaView className="bg-white h-full flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#734DBE" />
      </SafeAreaView>
    )
  }

  if (!quizQuery.data?.questions.length) {
    return (
      <SafeAreaView className="bg-white h-full flex-1">
        <View className="flex-row flex items-center pb-2 relative mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="absolute ml-4 bottom-0 bg-[#64748B14] h-12 w-12 items-center justify-center rounded-full"
          >
            <AntDesign name="left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="font-bold text-[#1E293B] text-xl m-auto">
            {Number(type) === 0 ? 'Kiểm tra nhanh' : 'Thực hành'}
          </Text>
        </View>
        <Text className="text-lg text-gray-600 text-center mt-8">Không có câu hỏi nào!</Text>
      </SafeAreaView>
    )
  }

  if (showResult) {
    const checkResult = (score / quizQuery.data.questions.length) * 100 > 50
    return (
      <ImageBackground
        className="h-full flex-1"
        source={checkResult ? images.quizSuccess : images.quizUnSuccess}
      >
        <View className="flex-1 px-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-[#64748B14] h-12 w-12 mt-12 items-center justify-center rounded-full"
          >
            <AntDesign name="left" size={24} color="black" />
          </TouchableOpacity>
          <View className="flex-1 items-center justify-center mt-60">
            <Text
              className={`text-3xl font-bold ${checkResult ? 'text-[#008E4A]' : 'text-[#D32F2F]'}`}
            >
              {checkResult ? 'Hoàn thành bài học!' : 'Cố lên nào!'}
            </Text>
            <Text className="font-semibold text-[#1E293B] my-2">
              {quizQuery.data.courseData.title}
            </Text>
            <Text className="text-lg">
              Bạn đã trả lời đúng: {score}/{quizQuery.data.questions.length} câu
            </Text>
            <View className="flex-row my-6 justify-center items-center w-40 h-12 bg-[#00BCD4] border border-white rounded-2xl">
              <Text className="text-white text-3xl font-bold">+{score * 10}</Text>
              <Text className="text-sm text-[#FFFFFF7A]"> điểm</Text>
            </View>
          </View>
        </View>
        <View className="px-4 mb-10">
          <TouchableOpacity
            className="bg-[#662DEC] py-3 px-6 rounded-full"
            onPress={() => router.push(ERouteTable.HOME)}
          >
            <Text className="text-white text-center font-semibold text-lg">Trở lại trang chủ</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    )
  }

  return (
    <SafeAreaView className="bg-white h-full relative flex-1">
      <View className={`flex-row flex items-center pb-2 relative mb-4 ${isAndroid && 'mt-20'}`}>
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute ml-4 bottom-0 bg-[#64748B14] h-12 w-12 items-center justify-center rounded-full"
        >
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="font-bold text-[#1E293B] text-xl m-auto">
          {Number(type) === 0 ? 'Kiểm tra nhanh' : 'Thực hành'}
        </Text>
      </View>

      <ScrollView className="flex-1 px-4">
        <Text className="text-2xl mt-4 text-[#734DBE] text-center font-semibold">
          Câu {currentQuestionIndex + 1}
        </Text>
        <Text className="text-lg font-medium mb-6 text-center">{currentQuestion?.text}</Text>

        {currentQuestion?.answers.map((answer) => (
          <TouchableOpacity
            key={answer.id}
            onPress={() => handleSelectAnswer(answer.id)}
            disabled={showFeedback || isProcessing}
            className={`border rounded-lg p-4 mb-4 ${
              selectedAnswer === answer.id
                ? isProcessing
                  ? 'border-[#734DBE] bg-[#734DBE]'
                  : answer.isCorrect
                    ? 'border-[#21C45D] bg-[#21C45D]'
                    : 'border-[#F44336] bg-[#F44336]'
                : showFeedback && answer.isCorrect
                  ? 'border-[#21C45D] bg-[#21C45D]'
                  : 'border-gray-300'
            }`}
          >
            <Text
              className={`text-base ${
                selectedAnswer === answer.id
                  ? 'text-white'
                  : showFeedback && answer.isCorrect
                    ? 'text-white'
                    : 'text-gray-700'
              }`}
            >
              {answer.text}
            </Text>
          </TouchableOpacity>
        ))}

        {showFeedback && (
          <View className="mt-4 p-4 bg-gray-50 rounded-lg">
            <Text className="text-base font-medium mb-2">
              {selectedAnswer === currentQuestion?.answers.find((a) => a.isCorrect)?.id
                ? 'Chính xác!'
                : 'Chưa chính xác!'}
            </Text>
            <Text className="text-gray-600">Giải thích: {currentQuestion?.explanation}</Text>
          </View>
        )}
      </ScrollView>

      <View className="p-4 border-t border-gray-200">
        <TouchableOpacity
          className={`py-3 rounded-lg ${
            selectedAnswer !== null && showFeedback ? 'bg-[#662DEC]' : 'bg-[#662DEC]/50'
          }`}
          onPress={handleNextQuestion}
          disabled={selectedAnswer === null || !showFeedback}
        >
          <Text className="text-white text-center font-semibold text-lg">
            {currentQuestionIndex === quizQuery.data.questions.length - 1
              ? 'Hoàn thành'
              : 'Tiếp tục'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default QuestionScreen
