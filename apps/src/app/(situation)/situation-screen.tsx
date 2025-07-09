import { Dimensions, FlatList, ImageBackground, Text, TouchableOpacity, View } from 'react-native'
import { images } from '@/constants'
import { router } from 'expo-router'
import { AntDesign } from '@expo/vector-icons'
import { SafeAreaView } from 'react-native-safe-area-context'
import React, { useRef, useState } from 'react'
import { ERouteTable } from '@/constants/route-table'

const { width } = Dimensions.get('window')

const listSituation = [
  {
    id: '1',
    title: 'Trò chơi tình huống tài chính',
    icon: '🎯',
    image: images.game1, // Đổi đường dẫn phù hợp
    route: ERouteTable.STORY_SCREEN,
  },
  {
    id: '3',
    title: 'Trò chơi ghép nối tài chính',
    icon: '🧩',
    image: images.game2, // Đổi đường dẫn phù hợp
    route: ERouteTable.MATCHING_SCREEN,
  },
  {
    id: '4',
    title: 'Trò chơi điền giá trị tài chính',
    icon: '💰',
    image: images.game3, // Đổi đường dẫn phù hợp
    route: ERouteTable.FILL_VALUE_SCREEN,
  },
  {
    id: '5',
    title: 'Trò chơi mô phỏng mua sắm',
    icon: '🛒',
    image: images.game4, // Đổi đường dẫn phù hợp
    route: ERouteTable.SHOPPING_SCREEN,
  },
]

export default function SituationScreen() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width)
    setCurrentIndex(index)
  }

  const goToIndex = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true })
    setCurrentIndex(index)
  }

  return (
    <ImageBackground source={images.bgAuth} style={{ height: '100%' }}>
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center px-4 mt-2 mb-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="bg-white h-12 w-12 items-center justify-center rounded-full"
          >
            <AntDesign name="left" size={24} color="black" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-center flex-1 mr-10">Chọn chế độ chơi</Text>
        </View>

        <Text className="text-2xl text-center text-gray-600 mt-2">
          Giúp bé học cách tiêu tiền hợp lý
        </Text>

        {/* Carousel */}
        <FlatList
          ref={flatListRef}
          data={listSituation}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          renderItem={({ item }) => (
            <View
              style={{
                width,
                justifyContent: 'center',
                alignItems: 'center',
                paddingHorizontal: 24,
              }}
            >
              <TouchableOpacity
                onPress={() => router.push(item.route)}
                activeOpacity={0.85}
                style={{
                  width: '100%',
                  borderRadius: 30,
                  overflow: 'hidden',
                  alignItems: 'center',
                }}
              >
                {/* Hình ảnh minh họa */}
                <ImageBackground
                  source={item.image}
                  resizeMode="cover"
                  imageStyle={{ borderRadius: 12 }}
                  style={{
                    width: '100%',
                    aspectRatio: 1,
                  }}
                />

                {/* Icon và tiêu đề */}
                <View style={{ marginTop: 12, alignItems: 'center' }}>
                  <Text style={{ fontSize: 36 }}>{item.icon}</Text>
                  <Text className="text-lg font-bold text-center text-gray-800 px-4 mt-1">
                    {item.title}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          )}
        />

        <View className="flex-row justify-center mt-4">
          {listSituation.map((_, i) => (
            <View
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                marginHorizontal: 4,
                backgroundColor: i === currentIndex ? '#000' : '#ccc',
              }}
            />
          ))}
        </View>
        {/* Controls */}
        <View className="flex-row justify-center items-center gap-6 mt-6">
          <TouchableOpacity
            onPress={() =>
              goToIndex((currentIndex - 1 + listSituation.length) % listSituation.length)
            }
            className="bg-white p-4 rounded-full shadow"
          >
            <AntDesign name="left" size={24} color="#4B5563" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => goToIndex((currentIndex + 1) % listSituation.length)}
            className="bg-white p-4 rounded-full shadow"
          >
            <AntDesign name="right" size={24} color="#4B5563" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  )
}
