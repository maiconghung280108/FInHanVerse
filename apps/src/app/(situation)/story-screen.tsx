import { Text, TouchableOpacity, View, ScrollView } from 'react-native'
import { router } from 'expo-router'
import { AntDesign } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState, useRef, useEffect } from 'react'
import { allScenarios, Message, Scenario } from '@/data/mini-game/story'
import { ERouteTable } from '@/constants/route-table'

const SCENARIOS_PER_GAME = 5

export default function StoryScreen() {
  const [gameScenarios, setGameScenarios] = useState<Scenario[]>([])
  const [currentScenario, setCurrentScenario] = useState(0)
  const [messages, setMessages] = useState<Message[]>([])
  const [score, setScore] = useState(0)
  const [gameCompleted, setGameCompleted] = useState(false)
  const [gameStarted, setGameStarted] = useState(false)
  const [finalScore, setFinalScore] = useState(0)
  const scrollViewRef = useRef<ScrollView>(null)

  // Khởi tạo game với scenarios random
  const initializeGame = () => {
    const shuffled = [...allScenarios].sort(() => 0.5 - Math.random())
    const selectedScenarios = shuffled.slice(0, SCENARIOS_PER_GAME)

    setGameScenarios(selectedScenarios)
    setCurrentScenario(0)
    setScore(0)
    setGameCompleted(false)

    const welcomeMessage: Message = {
      id: '0',
      text: `Chào bạn! Mình là FinKids. Hôm nay chúng ta sẽ cùng học về tài chính qua ${SCENARIOS_PER_GAME} tình huống thực tế nhé! 🌟`,
      isBot: true,
    }

    setMessages([welcomeMessage])
    setGameStarted(true)

    // Bắt đầu scenario đầu tiên
    setTimeout(() => {
      addBotMessage(selectedScenarios[0].botMessage, selectedScenarios[0].options)
    }, 1500)
  }

  useEffect(() => {
    if (!gameStarted) {
      initializeGame()
    }
  }, [])

  const addBotMessage = (text: string, options?: string[]) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: true,
      options,
    }
    setMessages((prev) => [...prev, newMessage])
    scrollToBottom()
  }

  const addUserMessage = (text: string, isCorrect?: boolean) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      isBot: false,
      isCorrect,
    }
    setMessages((prev) => [...prev, newMessage])
    scrollToBottom()
  }

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true })
    }, 100)
  }

  const calculateScore = () => {
    const correctAnswers = score
    const totalQuestions = SCENARIOS_PER_GAME
    const calculatedScore = Math.round((correctAnswers / totalQuestions) * 100)
    setFinalScore(calculatedScore)
    return calculatedScore
  }

  const handleContinue = () => {
    const calculatedScore = finalScore || calculateScore()
    router.push({
      pathname: ERouteTable.RESULT_SITUATION,
      params: {
        type: calculatedScore >= 70 ? 'win' : 'lose',
      },
    })
  }

  const handleOptionSelect = (option: string, index: number) => {
    if (currentScenario >= gameScenarios.length) return

    const scenario = gameScenarios[currentScenario]
    const isCorrect = index === scenario.correctAnswer

    addUserMessage(option, isCorrect)

    if (isCorrect) {
      setScore((prev) => prev + 1)
    }

    // Thêm phản hồi và giải thích
    setTimeout(() => {
      const feedbackMessage = isCorrect
        ? `✅ Chính xác! +${scenario.points} điểm`
        : `❌ Chưa đúng rồi! Đáp án đúng là: "${scenario.options[scenario.correctAnswer]}"`

      addBotMessage(feedbackMessage)

      // Thêm giải thích
      setTimeout(() => {
        addBotMessage(scenario.explanation)

        // Chuyển sang scenario tiếp theo hoặc kết thúc game
        setTimeout(() => {
          if (currentScenario < gameScenarios.length - 1) {
            setCurrentScenario((prev) => prev + 1)
            const nextScenario = gameScenarios[currentScenario + 1]

            // Thông báo category mới nếu khác
            if (scenario.category !== nextScenario.category) {
              addBotMessage(`📚 Chủ đề tiếp theo: ${nextScenario.category}`)
              setTimeout(() => {
                addBotMessage(nextScenario.botMessage, nextScenario.options)
              }, 1000)
            } else {
              addBotMessage(nextScenario.botMessage, nextScenario.options)
            }
          } else {
            // Kết thúc game
            setGameCompleted(true)
            const finalScoreValue = isCorrect ? score + 1 : score
            setScore(finalScoreValue)

            setTimeout(() => {
              addBotMessage(
                `🎉 Hoàn thành! Bạn đã trả lời đúng ${finalScoreValue}/${gameScenarios.length} câu hỏi. Hãy xem kết quả chi tiết nhé!`,
              )
            }, 1000)
          }
        }, 2500)
      }, 1500)
    }, 1000)
  }

  const resetGame = () => {
    setGameStarted(false)
    setTimeout(() => {
      initializeGame()
    }, 500)
  }

  const renderMessage = (message: Message) => {
    if (message.isBot) {
      return (
        <View key={message.id} className="flex-row mb-4">
          <View className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 items-center justify-center mr-3">
            <Text className="text-white text-sm font-bold">🤖</Text>
          </View>
          <View className="flex-1">
            <Text className="text-sm font-semibold text-gray-800 mb-1">FinKids</Text>
            <View className="bg-gray-100 rounded-lg rounded-tl-none p-4 max-w-[85%] shadow-sm">
              <Text className="text-gray-800 leading-5">{message.text}</Text>
            </View>
            {message.options && !gameCompleted && (
              <View className="mt-4">
                {message.options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleOptionSelect(option, index)}
                    className="bg-white rounded-xl p-4 border-2 mt-2 border-purple-100 shadow-sm active:bg-purple-50"
                    activeOpacity={0.8}
                  >
                    <Text className="text-purple-800 text-sm font-medium leading-5">
                      {String.fromCharCode(65 + index)}. {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      )
    } else {
      return (
        <View key={message.id} className="flex-row justify-end mb-4">
          <View className="flex-1 items-end">
            <Text className="text-sm font-semibold text-gray-800 mb-1 mr-3">Bạn 👤</Text>
            <View
              className={`rounded-lg rounded-tr-none p-4 max-w-[85%] shadow-sm ${
                message.isCorrect === true
                  ? 'bg-green-500'
                  : message.isCorrect === false
                    ? 'bg-red-500'
                    : 'bg-purple-500'
              }`}
            >
              <Text className="text-white leading-5">{message.text}</Text>
            </View>
          </View>
        </View>
      )
    }
  }

  return (
    <SafeAreaView className="h-full bg-white">
      <View className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-4 py-2 bg-white">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-gray-100 h-12 w-12 items-center justify-center rounded-full"
          >
            <AntDesign name="left" size={20} color="#374151" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-center flex-1 mr-10 text-gray-800">
            Tình huống
          </Text>
        </View>

        {/* Messages */}
        <View className="flex-1">
          <ScrollView
            ref={scrollViewRef}
            className="flex-1 p-4"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {messages.map(renderMessage)}
          </ScrollView>

          {/* Bottom Actions */}
          {gameCompleted && (
            <View className="border-t border-gray-200 p-4 bg-white">
              <TouchableOpacity
                className="bg-[#734DBE] py-4 items-center rounded-full mb-2"
                onPress={handleContinue}
              >
                <Text className="text-white font-bold text-lg">Kết thúc</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}
