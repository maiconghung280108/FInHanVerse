import React from 'react'
import { View, Text, Image } from 'react-native'
import IconTalk from '~/assets/icon-svg/IconTalk'
import { images } from '@/constants'

type Props = {
  isPlayerTurn: boolean
}

const ChessStatus: React.FC<Props> = ({ isPlayerTurn }) => (
  <View className="mt-10 flex-row gap-2 items-center">
    <Image source={images.iconHuman} className="h-36 w-36" />
    <View className="relative">
      <Text className="absolute z-20 left-6 top-4">
        {isPlayerTurn ? 'Lượt của bạn' : 'Máy đang suy nghĩ...'}
      </Text>
      <IconTalk />
    </View>
  </View>
)

export default React.memo(ChessStatus)
