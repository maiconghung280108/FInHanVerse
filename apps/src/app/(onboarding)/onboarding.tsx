import { Text, ImageBackground, TouchableOpacity, View } from 'react-native'
import { images } from '@/constants'
import { ERouteTable } from '@/constants/route-table'
import { router } from 'expo-router'

export default function Onboarding() {
  return (
    <ImageBackground
      source={images.onboarding2}
      resizeMode="cover"
      className="h-full items-center justify-center"
    >
      <Text className="text-center text-4xl leading-[100%] font-bold mt-80">
        MỖI ĐỒNG XU {'\n'} HÔM NAY LÀ MỘT {'\n'} BÀI HỌC NGÀY MAI
      </Text>
      <Text className="text-center py-6">
        Học cách tiết kiệm, chi tiêu và ước m ơ {'\n'} cùng Finkids!
      </Text>
      <View>
        <TouchableOpacity
          className="bg-[#734DBE] w-max rounded-full px-[70px] h-14 justify-center"
          onPress={() => router.replace(ERouteTable.SIGIN_IN)}
        >
          <Text className="text-center text-white text-lg font-bold ">Bắt đầu</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )
}
