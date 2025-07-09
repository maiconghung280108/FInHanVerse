import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  ScrollView,
} from 'react-native'
import { router } from 'expo-router'
import HeaderHome from '@/components/HeaderHome'
import IconSearch from '~/assets/icon-svg/IconSearch'
import { useEffect, useState } from 'react'
import ItemLessonHome from '@/components/ItemLessonHome'
import { ERouteTable } from '@/constants/route-table'
import { useHome } from '@/hooks/useHome'
import { useIsFocused } from '@react-navigation/native'
import { useQueryClient } from '@tanstack/react-query'
import { AntDesign } from '@expo/vector-icons'

type LessonItem = {
  thumb: string
  description: string
  title: string
  rank: string
  isCompleted: boolean
  category: {
    id: number
    title: string
  }
  score: {
    score: number
    totalScore: number
  }
  id: number
  isLocked: boolean
  image: string
  isPlaceholder?: boolean
}

function toEvenArrayWithPlaceholder(data: LessonItem[] = []): LessonItem[] {
  const cleaned = [...data]
  if (cleaned.length % 2 !== 0) {
    cleaned.push({
      id: -1,
      thumb: '',
      description: '',
      title: '',
      rank: '',
      isCompleted: false,
      category: { id: 0, title: '' },
      score: { score: 0, totalScore: 0 },
      isLocked: false,
      image: '',
      isPlaceholder: true
    })
  }
  return cleaned
}

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState<any>(1)
  const { categoriesQuery, learningItemsQuery } = useHome(activeTab)
  const isFocused = useIsFocused()
  const queryClient = useQueryClient()

  useEffect(() => {
    setActiveTab(1)
    queryClient.invalidateQueries({ queryKey: ['categories'] })
    queryClient.invalidateQueries({
      queryKey: ['learningItems', categoriesQuery.data?.[0]?.id],
    })
  }, [isFocused])

  const currentCategory = categoriesQuery.data?.find((it) => it.id === activeTab)

  return (
    <View className="bg-white flex-1">
      <HeaderHome />
      <View className="relative bg-white mt-2 px-4">
        <TextInput
          className="w-full p-2 pl-14 h-14 bg-[#F4F6F8] rounded-full"
          placeholder="Tìm kiếm bài học"
          value=""
        />
        <View className="absolute top-1 right-8">
          <View className="h-12 w-12 bg-[#662DEC] items-center justify-center rounded-full">
            <IconSearch />
          </View>
        </View>
      </View>
      <View className="mx-4 mt-2 flex-1">
        <View className="mt-4 flex-row items-center justify-between">
          <Text className="text-2xl font-bold">Khám phá</Text>
          <TouchableOpacity className="flex-row items-center gap-2">
            <Text className="text-sm font-semibold text-[#D8650E]">Xem tất cả</Text>
            <AntDesign name="arrowright" size={14} color="#D8650E" />
          </TouchableOpacity>
        </View>
        <View className="h-20">
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-4">
            {categoriesQuery.data?.map((category) => (
              <TouchableOpacity
                key={category.id}
                className={
                  activeTab === category.id
                    ? 'p-3.5 rounded-full bg-[#D8650E] mr-2 h-12'
                    : 'p-3.5 rounded-full bg-[#64748B14] mr-2 h-12'
                }
                onPress={() => setActiveTab(category.id)}
              >
                <Text
                  className={
                    activeTab === category.id
                      ? 'text-white font-semibold capitalize'
                      : 'text-[#64748B] font-semibold capitalize'
                  }
                >
                  {category.title}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="flex-row justify-between mt-4 items-center">
          <Text className="text-gray-600">Tiến độ</Text>
          <Text className="font-semibold text-[#885BF0]">
            {currentCategory?.completedCourses}/{currentCategory?.totalCourses}
          </Text>
        </View>
        {learningItemsQuery.isLoading ? (
          <ActivityIndicator size="small" color="#734DBE" className="mt-8" />
        ) : (
          <FlatList
            columnWrapperStyle={{ justifyContent: 'space-around' }}
            numColumns={2}
            className="flex-1 mt-4"
            showsVerticalScrollIndicator={false}
            data={toEvenArrayWithPlaceholder(learningItemsQuery?.data || [])}
            keyExtractor={(item, index) => String(item.id) || `lesson-${index}`}
            renderItem={({ item }) =>
              item.isPlaceholder ? (
                <View style={{ flex: 1, margin: 8 }} />
              ) : (
                <ItemLessonHome
                  data={item}
                  onPress={() =>
                    router.push({
                      pathname: ERouteTable.DETAIL_LESSON,
                      params: {
                        coursesId: item.id,
                        score: item?.score?.score || 0,
                        totalScore: item?.score?.totalScore || 100,
                      },
                    })
                  }
                />
              )
            }
          />
        )}
      </View>
    </View>
  )
}
