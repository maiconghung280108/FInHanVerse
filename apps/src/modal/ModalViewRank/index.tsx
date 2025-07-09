import ModalComponent from '@/components/ModalComponent'
import { ScrollView, Text, View } from 'react-native'
import React from 'react'
import { UserRanking } from '@/hooks/useHome'
import ImageWithFallback from '@/components/OptimizedImage/ImageWithFallback'

interface IModalSelectModeProps {
  onClose: () => void
  visible: boolean
  data?: UserRanking[] // Optional data prop, can be used for future enhancements
}

export default function ModalViewRank({ onClose, visible, data }: IModalSelectModeProps) {
  const renderColor = (index: number) => {
    switch (index) {
      case 0:
        return '#734DBE'
      case 1:
        return '#D14EA8'
      case 2:
        return '#00BCD4'
      default:
        return 'gray'
    }
  }

  return (
    <ModalComponent onClose={onClose} visible={visible}>
      <Text className="mt-6 text-center font-semibold text-xl text-[#734DBE]">Bảng xếp hạng</Text>
      <ScrollView className="mt-4">
        {data && data.length > 0 ? (
          data.map((it, index) => {
            return (
              <View
                key={it.id}
                className="flex-row w-full items-center justify-between border-b border-b-[#FFFFFF52] p-2"
              >
                <View className="flex-row items-center gap-4">
                  <View
                    style={{ backgroundColor: renderColor(index) }}
                    className="w-6 h-6 rounded bg-[#734DBE] items-center justify-center"
                  >
                    <Text className="text-xs font-semibold text-white">#{index + 1}</Text>
                  </View>
                  <ImageWithFallback
                    source={
                      it?.avatar
                        ? {
                            uri: it.avatar,
                          }
                        : undefined
                    }
                    className="h-8 w-8 rounded"
                    showInitials={true}
                    initials={it.fullName?.charAt(0)}
                  />
                  <Text className="font-semibold">{it.fullName}</Text>
                </View>
                <Text className="font-semibold">{it.totalScore}</Text>
              </View>
            )
          })
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500">Không có dữ liệu</Text>
          </View>
        )}
      </ScrollView>
    </ModalComponent>
  )
}
