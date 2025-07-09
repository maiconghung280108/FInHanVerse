import React from 'react'
import { TouchableOpacity } from 'react-native'

type Props = {
  icon: React.ReactNode | null
  className: string
  onPress: () => void
  disabled: boolean
}

const ChessSquare: React.FC<Props> = ({ icon, className, onPress, disabled }) => (
  <TouchableOpacity className={className} onPress={onPress} disabled={disabled}>
    {icon}
  </TouchableOpacity>
)

export default React.memo(ChessSquare)
