import { Platform, SafeAreaView, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { router } from 'expo-router'
import { AntDesign, Ionicons } from '@expo/vector-icons'
import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { ActivityIndicator } from 'react-native'
import { useSettings } from '@/hooks/useSettings'

const schema = yup.object().shape({
  oldPassword: yup.string().required('Vui lòng nhập mật khẩu cũ'),
  newPassword: yup
    .string()
    .required('Vui lòng nhập mật khẩu mới')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: yup
    .string()
    .required('Vui lòng nhập lại mật khẩu mới')
    .oneOf([yup.ref('newPassword')], 'Mật khẩu không khớp'),
})

type FormData = {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

const ResetPassword = () => {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false)
  const { changePasswordMutation } = useSettings()
  const isAndroid = Platform.OS === 'android';

  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  })

  const onSubmit = (data: FormData) => {
    const { oldPassword, newPassword } = data
    changePasswordMutation.mutate({ oldPassword, newPassword })
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
        <Text className="font-bold text-[#1E293B] text-xl m-auto">Đổi mật khẩu</Text>
      </View>
      <View className="px-4 flex-1">
        <Text className="text-[#64748B]">
          Mật khẩu mới của bạn phải khác với mật khẩu đã sử dụng trước đó
        </Text>
        <View className="relative mt-6">
          <TextInput
            placeholderTextColor="#94A3B8"
            className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-base"
            placeholder="Mật khẩu cũ"
            secureTextEntry={!isPasswordVisible}
            onChangeText={(text) => setValue('oldPassword', text)}
          />
          <TouchableOpacity
            className="absolute right-5 top-4"
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Ionicons name={isPasswordVisible ? 'eye' : 'eye-off'} size={20} color="#64748B" />
          </TouchableOpacity>
          {errors.oldPassword && (
            <Text className="text-red-500 text-sm mt-1">{errors.oldPassword.message}</Text>
          )}
        </View>
        <View className="relative">
          <TextInput
            placeholderTextColor="#94A3B8"
            className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-base"
            placeholder="Mật khẩu mới"
            secureTextEntry={!isPasswordVisible}
            onChangeText={(text) => setValue('newPassword', text)}
          />
          <TouchableOpacity
            className="absolute right-5 top-4"
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Ionicons name={isPasswordVisible ? 'eye' : 'eye-off'} size={20} color="#64748B" />
          </TouchableOpacity>
          {errors.newPassword && (
            <Text className="text-red-500 text-sm mt-1">{errors.newPassword.message}</Text>
          )}
        </View>
        <View className="relative">
          <TextInput
            placeholderTextColor="#94A3B8"
            className="border border-gray-300 rounded-xl px-4 py-3 mb-4 text-base"
            placeholder="Nhập lại mật khẩu mới"
            secureTextEntry={!isPasswordVisible}
            onChangeText={(text) => setValue('confirmPassword', text)}
          />
          <TouchableOpacity
            className="absolute right-5 top-4"
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <Ionicons name={isPasswordVisible ? 'eye' : 'eye-off'} size={20} color="#64748B" />
          </TouchableOpacity>
          {errors.confirmPassword && (
            <Text className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</Text>
          )}
        </View>
      </View>
      <View className="w-full absolute bottom-10 items-center">
        <TouchableOpacity
          className="bg-[#734DBE] w-11/12 rounded-3xl h-14 justify-center"
          onPress={handleSubmit(onSubmit)}
          disabled={changePasswordMutation.isPending}
        >
          {changePasswordMutation.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-center text-white text-lg font-bold">Lưu</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default ResetPassword
