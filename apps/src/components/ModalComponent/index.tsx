import React from 'react'
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native'
import IconClose from '~/assets/icon-svg/IconClose'

const ModalComponent = ({ visible, onClose, children }: any) => {
  return (
    <Modal transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View className="absolute right-10 z-20 top-[36%]">
          <TouchableOpacity onPress={onClose}>
            <IconClose />
          </TouchableOpacity>
        </View>
        <View style={styles.modalContainer}>
          <View>{children}</View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    position: 'absolute', // Full screen
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', // Màu nền mờ
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 10,
    backgroundColor: 'white',
    height: '30%',
  },
})

export default ModalComponent
