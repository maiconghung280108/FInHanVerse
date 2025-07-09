import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'

type Props = {
  onReset: () => void
  onIncrease: () => void
  onDecrease: () => void
  disabled: boolean
}

const ChessControls: React.FC<Props> = ({ onReset, onIncrease, onDecrease, disabled }) => (
  <View className="flex-row justify-center space-x-4 mt-4">
    <TouchableOpacity
      className="bg-[#734DBE] px-4 py-2 rounded-lg"
      onPress={onReset}
      disabled={disabled}
    >
      <Text className="text-white">Chơi lại</Text>
    </TouchableOpacity>
    <TouchableOpacity
      className="bg-[#734DBE] px-4 py-2 rounded-lg"
      onPress={onIncrease}
      disabled={disabled}
    >
      <Text className="text-white">Tăng độ khó</Text>
    </TouchableOpacity>
    <TouchableOpacity
      className="bg-[#734DBE] px-4 py-2 rounded-lg"
      onPress={onDecrease}
      disabled={disabled}
    >
      <Text className="text-white">Giảm độ khó</Text>
    </TouchableOpacity>
  </View>
)

export default React.memo(ChessControls)
