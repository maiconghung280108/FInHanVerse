import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import IconCrownActive from '~/assets/icon-svg/IconCrownActive'
import IconCrown from '~/assets/icon-svg/IconCrown'

interface ItemLevelChessProps {
  data: {
    level: string
    stars: number
  }
  onPress: () => void
}

const ItemLevelChess: React.FC<ItemLevelChessProps> = ({ data, onPress }: ItemLevelChessProps) => {
  const normalizedStars = Math.min(Math.max(data.stars, 0), 3)

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row justify-between bg-[#734DBE] mb-2 px-3.5 py-5 items-center rounded-xl"
    >
      <Text className="text-white text-xl font-semibold">{data.level}</Text>
      <View className="flex-row gap-1">
        {[...Array(3)].map((_, index) => (
          <View key={index}>{index < normalizedStars ? <IconCrownActive /> : <IconCrown />}</View>
        ))}
      </View>
    </TouchableOpacity>
  )
}

export default ItemLevelChess
