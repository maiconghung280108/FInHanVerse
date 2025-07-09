import { Platform, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { router } from 'expo-router'
import { AntDesign } from '@expo/vector-icons'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuthStore } from '@/store/useAuthStore'
import { ActivityIndicator } from 'react-native'
import { useSettings } from '@/hooks/useSettings'

const schema = yup.object().shape({
  fullName: yup.string().required('Vui lòng nhập tên người dùng'),
})

type FormData = {
  fullName: string
}

const EditName = () => {
  const { user } = useAuthStore()
  const { updateNameMutation } = useSettings()
  const isAndroid = Platform.OS === 'android';

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: user?.fullName || '',
    },
  })

  const onSubmit = (data: FormData) => {
    updateNameMutation.mutate(data)
  }

  return (
    <SafeAreaView className="bg-white h-full relative flex-1">
      <View className={`flex-row flex items-center pb-2 relative mb-4 ${isAndroid && 'mt-20'}`}>
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute ml-4 bottom-0 bg-[#64748B14] h-12 w-12 items-center justify-center rounded-full"
        >
          <AntDesign name="left" size={24} color="black" />
        </TouchableOpacity>
        <Text className="font-bold text-[#1E293B] text-xl m-auto">Tên người dùng</Text>
      </View>
      <View className="px-4 flex-1">
        <Text className="text-center text-[#64748B]">
          Ghi chú: Tên người dùng không được thay đổi quá một lần trong 90 ngày
        </Text>
        <View className="relative h-12">
          <TextInput
            className="border border-[#64748B52] h-12 rounded-xl pl-4 mt-6"
            placeholder="Tên người dùng..."
            placeholderTextColor="#64748B"
            onChangeText={(text) => setValue('fullName', text)}
            defaultValue={user?.fullName || ''}
          />
          {errors.fullName && (
            <Text className="text-red-500 text-sm mt-1">{errors.fullName.message}</Text>
          )}
        </View>
      </View>
      <View className="w-full absolute bottom-10 items-center">
        <TouchableOpacity
          className="bg-[#734DBE] w-11/12 rounded-3xl h-14 justify-center"
          onPress={handleSubmit(onSubmit)}
          disabled={updateNameMutation.isPending}
        >
          {updateNameMutation.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-center text-white text-lg font-bold">Tiếp tục</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default EditName
