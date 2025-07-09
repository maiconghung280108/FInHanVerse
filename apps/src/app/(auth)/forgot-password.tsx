import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Image } from 'react-native'
import { useRouter } from 'expo-router'
import { useAuth } from '@/hooks/useAuth'
import { images } from '@/constants'
import { ERouteTable } from '@/constants/route-table'
import CustomButton from '@/components/CustomButton'
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const schema = yup.object().shape({
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
})

type FormData = {
  email: string
}

const ForgotPassword = () => {
  const router = useRouter()
  const { forgotPasswordMutation } = useAuth()
  const [loading, setLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)
      await forgotPasswordMutation.mutateAsync(data)
    } catch (error: any) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ImageBackground
      source={images.bgAuth}
      resizeMode="cover"
      className="h-full items-center justify-center"
    >
      <View className="justify-center bg-[#FFFFFF7A] border border-[#FFFFFF7A] p-6 w-11/12 rounded-3xl pt-[114px] pb-12">
        <View className="items-center mb-6">
          <Image source={images.logoApp} className="h-[80px] w-[80px]" />
        </View>
        <Text className="text-3xl font-bold mb-3 text-center">Quên mật khẩu</Text>
        <Text className="text-sm text-[#64748B] mb-8 text-center">
          Vui lòng nhập email đã đăng ký
        </Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <View>
              <TextInput
                placeholderTextColor="#94A3B8"
                placeholder="Email"
                value={value}
                onChangeText={onChange}
                autoCapitalize="none"
                keyboardType="email-address"
                className="border border-gray-300 rounded-xl px-4 py-3 mb-2 text-base"
              />
              {errors.email && (
                <Text className="text-red-500 text-sm mb-2">{errors.email.message}</Text>
              )}
            </View>
          )}
        />
        <CustomButton
          title={loading ? 'Đang gửi' : 'Gửi'}
          onPress={handleSubmit(onSubmit)}
          containerStyle="w-full mt-7 mb-2 bg-[#662DEC] min-h-12"
          textStyle="text-white"
        />
        <TouchableOpacity
          className="flex-row gap-1 mt-6 flex mx-auto"
          onPress={() => router.push(ERouteTable.SIGIN_IN)}
        >
          <Text className="font-light">{'<'}</Text>
          <Text className="text-[#1E293B] text-sm font-semibold">Quay lại đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )
}

export default ForgotPassword
