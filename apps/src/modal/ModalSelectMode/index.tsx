import ModalComponent from '@/components/ModalComponent'
import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import PlayWhite from '~/assets/icon-svg/PlayWhite'
import PlayBlack from '~/assets/icon-svg/PlayBlack'
import PlayRandom from '~/assets/icon-svg/PlayRandom'
import { router } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'

interface IModalSelectModeProps {
  onClose: () => void
  visible: boolean
}

export default function ModalSelectMode({ onClose, visible }: IModalSelectModeProps) {
  return (
    <ModalComponent onClose={onClose} visible={visible}>
      <View>
        <Text className="mt-3 font-semibold text-xl text-center">Chơi như</Text>
        <TouchableOpacity
          className="mt-2"
          onPress={() => {
            router.push({
              pathname: ERouteTable.PRACTICE_CHESS,
              params: { type: 'white' },
            })
            onClose()
          }}
        >
          <PlayWhite />
        </TouchableOpacity>
        <TouchableOpacity
          className="mt-2"
          onPress={() => {
            router.push({
              pathname: ERouteTable.PRACTICE_CHESS,
              params: { type: 'black' },
            })
            onClose()
          }}
        >
          <PlayBlack />
        </TouchableOpacity>
        <TouchableOpacity
          className="mt-2"
          onPress={() => {
            router.push({
              pathname: ERouteTable.PRACTICE_CHESS,
              params: { type: 'random' },
            })
            onClose()
          }}
        >
          <PlayRandom />
        </TouchableOpacity>
      </View>
    </ModalComponent>
  )
}
