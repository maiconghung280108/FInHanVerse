import {
  ActivityIndicator,
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { images } from '@/constants'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import RenderHtml from 'react-native-render-html'
import { router, useLocalSearchParams } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import { useLesson } from '@/hooks/useLesson'
import IconCheckLesson from '~/assets/icon-svg/IconCheckLesson'

const DetailLesson = () => {
  const { coursesId, score, totalScore } = useLocalSearchParams<{
    coursesId: string
    score: string
    totalScore: string
  }>()

  const { lessonQuery } = useLesson(coursesId || '')

  const { width } = Dimensions.get('window')

  // Custom styles for HTML content
  const tagsStyles = {
    h2: {
      fontSize: 20,
      fontWeight: 'bold' as const,
      color: '#1f2937',
      marginBottom: 4,
    },
    h3: {
      fontSize: 18,
      fontWeight: '600' as const,
      color: '#374151',
      marginBottom: 10,
      marginTop: 16,
    },
    p: {
      fontSize: 15,
      lineHeight: 24,
      color: '#4b5563',
      marginBottom: 12,
      textAlign: 'justify' as const,
    },
    ul: {
      marginBottom: 16,
      paddingLeft: 8,
    },
    li: {
      fontSize: 15,
      lineHeight: 22,
      color: '#4b5563',
      marginBottom: 8,
      paddingLeft: 8,
    },
    strong: {
      fontWeight: 'bold' as const,
      color: '#1f2937',
    },
    img: {
      width: '100%',
      // height: 'auto',
      borderRadius: 12,
      marginVertical: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 3,
    },
    figure: {
      marginVertical: 20,
      alignItems: 'center' as const,
      borderRadius: 16,
      padding: 16,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 3,
    },
    figcaption: {
      fontSize: 13,
      color: '#6b7280',
      textAlign: 'center' as const,
      marginTop: 8,
      fontStyle: 'italic' as const,
      paddingHorizontal: 16,
    },
    table: {
      backgroundColor: '#ffffff',
      borderRadius: 12,
      marginVertical: 16,
      borderWidth: 1,
      borderColor: '#e5e7eb',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    th: {
      backgroundColor: '#734DBE',
      color: '#ffffff',
      fontWeight: 'bold' as const,
      fontSize: 14,
      padding: 16,
      textAlign: 'center' as const,
      borderRightWidth: 1,
      borderRightColor: '#5b21b6',
      borderBottomWidth: 2,
      borderBottomColor: '#5b21b6',
    },
    td: {
      padding: 16,
      fontSize: 14,
      color: '#374151',
      borderBottomWidth: 1,
      borderBottomColor: '#e5e7eb',
      borderRightWidth: 1,
      borderRightColor: '#f3f4f6',
      backgroundColor: '#ffffff',
      textAlign: 'left' as const,
      verticalAlign: 'top' as const,
    },
    thead: {
      backgroundColor: '#734DBE',
    },
    tbody: {
      backgroundColor: '#ffffff',
    },
    blockquote: {
      borderLeftWidth: 4,
      borderLeftColor: '#0ea5e9',
      padding: 16,
      marginVertical: 12,
      borderRadius: 8,
      fontStyle: 'italic' as const,
    },
    code: {
      backgroundColor: '#f1f5f9',
      color: '#1e40af',
      fontSize: 13,
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      fontFamily: 'monospace',
    },
    pre: {
      backgroundColor: '#1e293b',
      color: '#e2e8f0',
      padding: 16,
      borderRadius: 12,
      marginVertical: 12,
      overflow: 'hidden' as const,
    },
  }

  const classesStyles = {
    table: {
      width: '100%',
      marginVertical: 16,
      borderRadius: 12,
      overflow: 'hidden' as const,
      backgroundColor: '#ffffff',
      borderWidth: 1,
      borderColor: '#e5e7eb',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    th: {
      backgroundColor: '#734DBE',
      color: '#ffffff',
      fontWeight: 'bold' as const,
      fontSize: 14,
      padding: 16,
      textAlign: 'center' as const,
      borderRightWidth: 1,
      borderRightColor: 'rgba(255,255,255,0.2)',
    },
    td: {
      padding: 16,
      fontSize: 14,
      color: '#374151',
      borderBottomWidth: 1,
      borderBottomColor: '#e5e7eb',
      borderRightWidth: 1,
      borderRightColor: '#f3f4f6',
      backgroundColor: '#ffffff',
    },
    tr: {
      borderBottomWidth: 1,
      borderBottomColor: '#e5e7eb',
    },
    thead: {
      backgroundColor: '#734DBE',
    },
  }

  return (
    <View className="flex-1 h-full bg-gray-50">
      <View className="relative h-[310px]">
        <Image
          source={{
            uri:
              lessonQuery?.data?.image ||
              'https://d2908q01vomqb2.cloudfront.net/f1f836cb4ea6efb2a0b1b99f41ad8b103eff4b59/2024/11/26/Image-001-Chess-945x630.jpeg',
          }}
          className="w-full h-[310px] rounded-br-3xl rounded-bl-3xl"
        />
        <TouchableOpacity
          onPress={() => router.back()}
          className="h-12 w-12 rounded-full absolute top-20 left-4 bg-white items-center justify-center"
        >
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="absolute top-20 right-4">
          <IconCheckLesson />
        </View>
        <View className="absolute bottom-12 left-4">
          <Text className="text-[#FF9800] font-semibold capitalize">
            {lessonQuery?.data?.category.title}
          </Text>
          <Text numberOfLines={1} className="text-xl text-white w-[70%] font-semibold">
            {lessonQuery?.data?.title}
          </Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16 }}
      >
        <View className="p-4 mb-4">
          {lessonQuery?.isLoading ? (
            <View className="space-y-4">
              <View className="flex-row justify-center items-center mt-8 py-8">
                <ActivityIndicator size="large" color="#734DBE" />
                <Text className="ml-3 text-gray-500 text-base">Đang tải nội dung...</Text>
              </View>
            </View>
          ) : lessonQuery?.data?.content ? (
            <RenderHtml
              contentWidth={width - 64}
              source={{ html: lessonQuery.data.content }}
              tagsStyles={tagsStyles}
              classesStyles={classesStyles}
              defaultTextProps={{
                style: {
                  fontFamily: 'System',
                },
              }}
            />
          ) : (
            <View className="flex-row justify-center items-center py-8">
              <Text className="text-gray-500 text-base">Không có nội dung để hiển thị</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View className="bg-white border border-gray-200 h-[94px] w-full rounded-tl-2xl rounded-tr-2xl shadow-lg">
        <View className="flex-row justify-center mt-6 gap-4">
          <TouchableOpacity
            className={`py-3 w-[90%] items-center rounded-full shadow-md ${lessonQuery?.isLoading ? 'bg-gray-400' : 'bg-[#662DEC]'}`}
            disabled={lessonQuery?.isLoading}
            onPress={() =>
              router.push({
                pathname: ERouteTable.QUIZ_START,
                params: {
                  coursesId: coursesId,
                  type: 0,
                  score: score,
                  totalScore: totalScore,
                  title: 'Kiểm tra nhanh',
                  titleLesson: lessonQuery?.data?.title,
                },
              })
            }
          >
            <Text className="text-white font-semibold">
              {lessonQuery?.isLoading ? 'Đang tải...' : 'Luyện tập'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default DetailLesson
