import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ImageBackground } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useAuth } from '@/hooks/useAuth'
import { images } from '@/constants'
import { Ionicons } from '@expo/vector-icons'
import { ERouteTable } from '@/constants/route-table'
import CustomButton from '@/components/CustomButton'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const schema = yup.object().shape({
  newPassword: yup
    .string()
    .required('Vui lòng nhập mật khẩu mới')
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số',
    ),
  confirmPassword: yup
    .string()
    .required('Vui lòng nhập lại mật khẩu')
    .oneOf([yup.ref('newPassword')], 'Mật khẩu không khớp'),
})

const ChangePassword = () => {
  const router = useRouter()
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { email } = useLocalSearchParams<{ email: string }>()
  const { resetPasswordMutation } = useAuth()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: { newPassword: string; confirmPassword: string }) => {
    const dataSubmit = {
      email: email,
      password: data.newPassword,
      confirmPassword: data.confirmPassword,
    }
    try {
      setIsLoading(true)
      await resetPasswordMutation.mutateAsync(dataSubmit)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ImageBackground
      source={images.bgAuth}
      resizeMode="cover"
      className="h-full items-center justify-center"
    >
      <View className="justify-center bg-white p-6 w-11/12 rounded-xl pt-[114px] pb-12">
        <Text className="text-3xl font-bold mb-3 text-center">Đặt lại mật khẩu</Text>
        <Text className="text-sm text-[#64748B] mb-8 text-center">Vui lòng nhập mật khẩu mới</Text>

        <Controller
          control={control}
          name="newPassword"
          render={({ field: { onChange, value } }) => (
            <View className="relative">
              <TextInput
                placeholderTextColor="#94A3B8"
                className="border border-gray-300 rounded-xl px-4 py-3 mb-1 text-base"
                placeholder="Mật khẩu mới"
                secureTextEntry={!isPasswordVisible}
                onChangeText={onChange}
                value={value}
                editable={!isLoading}
              />
              <TouchableOpacity
                className="absolute right-5 top-4"
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                disabled={isLoading}
              >
                <Ionicons name={isPasswordVisible ? 'eye' : 'eye-off'} size={20} color="#64748B" />
              </TouchableOpacity>
              {errors.newPassword && (
                <Text className="text-red-500 text-sm mb-2">{errors.newPassword.message}</Text>
              )}
            </View>
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, value } }) => (
            <View className="relative">
              <TextInput
                placeholderTextColor="#94A3B8"
                className="border border-gray-300 rounded-xl px-4 py-3 mb-1 text-base"
                placeholder="Nhập lại mật khẩu mới"
                secureTextEntry={!isConfirmPasswordVisible}
                onChangeText={onChange}
                value={value}
                editable={!isLoading}
              />
              <TouchableOpacity
                className="absolute right-5 top-4"
                onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                disabled={isLoading}
              >
                <Ionicons
                  name={isConfirmPasswordVisible ? 'eye' : 'eye-off'}
                  size={20}
                  color="#64748B"
                />
              </TouchableOpacity>
              {errors.confirmPassword && (
                <Text className="text-red-500 text-sm mb-2">{errors.confirmPassword.message}</Text>
              )}
            </View>
          )}
        />

        <CustomButton
          title={isLoading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
          onPress={handleSubmit(onSubmit)}
          containerStyle={`w-full mt-7 mb-2 ${isLoading ? 'bg-gray-400' : 'bg-[#1E293B]'} min-h-12`}
          textStyle="text-white"
          disabled={isLoading}
        />

        <TouchableOpacity
          className="flex-row gap-1 mt-6 flex mx-auto"
          onPress={() => router.push(ERouteTable.SIGIN_IN)}
          disabled={isLoading}
        >
          <Text className="font-light">{'<'}</Text>
          <Text className="text-[#1E293B] text-sm font-semibold">Quay lại đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )
}

export default ChangePassword
