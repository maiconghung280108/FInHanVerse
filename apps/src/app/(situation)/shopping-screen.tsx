import {
  Dimensions,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ScrollView,
  Platform,
} from 'react-native'
import { images } from '@/constants'
import { router } from 'expo-router'
import { AntDesign } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useState } from 'react'
import { Modal } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

interface Product {
  id: string
  name: string
  price: number
  emoji: string
  category: 'cần thiết' | 'muốn có'
}

const products: Product[] = [
  { id: '1', name: 'Bánh mì', price: 15000, emoji: '🥖', category: 'cần thiết' },
  { id: '2', name: 'Nước uống', price: 10000, emoji: '🥤', category: 'cần thiết' },
  { id: '3', name: 'Đồ chơi robot', price: 150000, emoji: '🤖', category: 'muốn có' },
  { id: '4', name: 'Sách vở', price: 50000, emoji: '📚', category: 'cần thiết' },
  { id: '5', name: 'Kẹo', price: 25000, emoji: '🍭', category: 'muốn có' },
  { id: '6', name: 'Áo quần', price: 200000, emoji: '👕', category: 'cần thiết' },
  { id: '7', name: 'Game mobile', price: 100000, emoji: '🎮', category: 'muốn có' },
  { id: '8', name: 'Trái cây', price: 30000, emoji: '🍎', category: 'cần thiết' },
]

export default function ShoppingScreen() {
  const [budget] = useState(300000) // 300k budget
  const [cart, setCart] = useState<{ [key: string]: number }>({})
  const [gameComplete, setGameComplete] = useState(false)
  // const isAndroid = Platform.OS === 'android'

  const [showResultModal, setShowResultModal] = useState(false)
  const [resultMessage, setResultMessage] = useState('')
  const [resultStatus, setResultStatus] = useState<'success' | 'warning' | 'error'>('success')

  const addToCart = (productId: string) => {
    setCart((prev) => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1,
    }))
  }

  const removeFromCart = (productId: string) => {
    setCart((prev) => {
      const newCart = { ...prev }
      if (newCart[productId] > 1) {
        newCart[productId] -= 1
      } else {
        delete newCart[productId]
      }
      return newCart
    })
  }

  const getTotalPrice = () => {
    return Object.entries(cart).reduce((total, [productId, quantity]) => {
      const product = products.find((p) => p.id === productId)
      return total + (product ? product.price * quantity : 0)
    }, 0)
  }

  const getRemainingBudget = () => {
    return budget - getTotalPrice()
  }

  const getCartSummary = () => {
    const essential = Object.entries(cart).filter(([productId]) => {
      const product = products.find((p) => p.id === productId)
      return product?.category === 'cần thiết'
    }).length

    const wants = Object.entries(cart).filter(([productId]) => {
      const product = products.find((p) => p.id === productId)
      return product?.category === 'muốn có'
    }).length

    return { essential, wants }
  }

  const completeShopping = () => {
    const total = getTotalPrice()
    const { essential, wants } = getCartSummary()

    let message = `Tổng chi tiêu: ${total.toLocaleString()}đ\n`
    message += `Còn lại: ${getRemainingBudget().toLocaleString()}đ\n\n`
    message += `Đồ cần thiết: ${essential} món\n`
    message += `Đồ muốn có: ${wants} món\n\n`

    if (total > budget) {
      message += '❌ Bạn đã chi tiêu quá ngân sách!'
      setResultStatus('error')
    } else if (essential >= wants) {
      message += '✅ Tuyệt vời! Bạn ưu tiên đồ cần thiết!'
      setResultStatus('success')
    } else {
      message += '⚠️ Bạn nên mua nhiều đồ cần thiết hơn!'
      setResultStatus('warning')
    }

    setResultMessage(message)
    setShowResultModal(true)
    setGameComplete(true)
  }

  const resetGame = () => {
    setCart({})
    setGameComplete(false)
  }

  return (
    <ImageBackground
      className="h-full"
      style={{ height: Dimensions.get('window').height }}
      source={images.bgAuth}
    >
      <SafeAreaView className="flex-1 mx-4 mb-10">
        <View className={`flex-row flex items-center pb-2 relative mb-4`}>
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-white h-12 w-12 items-center justify-center rounded-full"
          >
            <AntDesign name="left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-center flex-1 mr-10">Mô phỏng mua sắm</Text>
        </View>

        <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
          {/* Budget Display */}
          <View className="bg-white p-4">
            <Text className="text-lg font-bold text-center">
              Ngân sách: {budget.toLocaleString()}đ
            </Text>
            <Text
              className={`text-center font-semibold ${getRemainingBudget() < 0 ? 'text-red-500' : 'text-green-500'}`}
            >
              Còn lại: {getRemainingBudget().toLocaleString()}đ
            </Text>
          </View>
          {/* Products Grid */}
          <View className="flex-1 bg-white p-4 mb-4 h-max">
            <Text className="text-lg font-bold mb-3 text-center">Cửa hàng</Text>
            <View className="flex-row flex-wrap justify-between">
              {products.map((product) => (
                <View key={product.id} className="w-[48%] bg-gray-50 rounded-lg p-3 mb-3">
                  <View className="items-center">
                    <Text className="text-2xl mb-1">{product.emoji}</Text>
                    <Text className="font-semibold text-sm text-center">{product.name}</Text>
                    <Text className="text-green-600 font-bold">
                      {product.price.toLocaleString()}đ
                    </Text>
                    <Text
                      className={`text-xs ${product.category === 'cần thiết' ? 'text-blue-600' : 'text-purple-600'}`}
                    >
                      {product.category}
                    </Text>
                  </View>

                  <View className="flex-row items-center justify-center mt-2">
                    <TouchableOpacity
                      onPress={() => removeFromCart(product.id)}
                      className="bg-red-500 w-8 h-8 rounded-full items-center justify-center"
                      disabled={!cart[product.id]}
                    >
                      <Text className="text-white font-bold">-</Text>
                    </TouchableOpacity>

                    <Text className="mx-3 font-bold">{cart[product.id] || 0}</Text>

                    <TouchableOpacity
                      onPress={() => addToCart(product.id)}
                      className="bg-green-500 w-8 h-8 rounded-full items-center justify-center"
                    >
                      <Text className="text-white font-bold">+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
          <View className="flex-row gap-4">
            <TouchableOpacity
              onPress={completeShopping}
              className="flex-1 bg-[#885BF0] p-4 rounded-full"
              disabled={Object.keys(cart).length === 0}
            >
              <Text className="text-white text-center font-semibold">Thanh toán</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={resetGame}
              className="flex-1 border border-[#885BF07A] p-4 rounded-full"
            >
              <Text className="text-[#885BF0] text-center font-semibold">Làm lại</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
      <Modal
        animationType="slide"
        transparent
        visible={showResultModal}
        onRequestClose={() => setShowResultModal(false)}
      >
        <View
          className="flex-1 justify-center items-center px-6"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)', // black với độ mờ 40%
          }}
        >
          <View className="bg-white w-full rounded-2xl p-6">
            <View className="items-center mb-4">
              <MaterialIcons
                name={
                  resultStatus === 'success'
                    ? 'check-circle'
                    : resultStatus === 'warning'
                      ? 'warning'
                      : 'error'
                }
                size={48}
                color={
                  resultStatus === 'success'
                    ? 'green'
                    : resultStatus === 'warning'
                      ? '#f59e0b'
                      : 'red'
                }
              />
              <Text className="text-xl font-bold mt-2">Kết quả mua sắm</Text>
            </View>
            <Text className="text-base text-gray-700 whitespace-pre-line text-center">
              {resultMessage}
            </Text>
            <TouchableOpacity
              onPress={() => setShowResultModal(false)}
              className="mt-6 bg-[#885BF0] py-3 rounded-full"
            >
              <Text className="text-white text-center font-semibold">Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  )
}
