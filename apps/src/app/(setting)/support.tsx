import { Image, Platform, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import { router } from 'expo-router'
import { AntDesign } from '@expo/vector-icons'
import { images } from '@/constants'

const Support = () => {
  const isAndroid = Platform.OS === 'android';

  return (
    <SafeAreaView className="bg-white h-full relative flex-1">
      <View className={`flex-row flex items-center pb-2 relative mb-4 ${isAndroid && 'mt-20'}`}>
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute ml-4 bottom-0 bg-[#64748B14] h-12 w-12 items-center justify-center rounded-full"
        >
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="font-bold text-[#1E293B] text-xl m-auto">Hỗ trợ</Text>
      </View>
      <View className="px-4 mt-10">
        <View className="p-5 bg-[#734DBE] rounded-2xl">
          <Text className="text-white font-semibold">Liên hệ hỗ trợ</Text>
          <View className="flex-row items-center justify-between mt-6">
            <View>
              <Text className="text-white opacity-[48%] text-sm">Email</Text>
              <Text className="text-white">demo@finkids.cc</Text>
            </View>
            <AntDesign className="opacity-[48%]" name="right" size={16} color="#FFFFFF" />
          </View>
          <View className="flex-row items-center justify-between mt-3">
            <View>
              <Text className="text-white opacity-[48%] text-sm">Hotline</Text>
              <Text className="text-white">380-702-9957</Text>
            </View>
            <AntDesign className="opacity-[48%]" name="right" size={16} color="#FFFFFF" />
          </View>
        </View>
        <View className="items-center mt-10">
          <Image source={images.iconSupport} className="w-[393px] h-[393px]" />
        </View>
      </View>
    </SafeAreaView>
  )
}

export default Support
