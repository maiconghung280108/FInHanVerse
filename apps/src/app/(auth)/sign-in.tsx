import {
  Image,
  ImageBackground,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { ERouteTable } from '@/constants/route-table'
import { images } from '@/constants'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '@/hooks/useAuth'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

// Define validation schema
const schema = yup.object().shape({
  email: yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
  password: yup
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .required('Vui lòng nhập mật khẩu'),
})

type FormData = {
  email: string
  password: string
}

const SignIn = () => {
  const [loading, setLoading] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const router = useRouter()
  const { signInMutation } = useAuth()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      email: 'admin@gmail.com',
      password: '123123',
    },
  })

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true)
      await signInMutation.mutateAsync(data)
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
        <Text className="text-3xl font-bold mb-3 text-center">Đăng nhập</Text>
        <Text className="text-sm text-[#64748B] mb-8 text-center">
          Đăng nhập vào tài khoản của bạn
        </Text>

        {/* Email Input */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <View className="mb-4">
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

        {/* Password Input */}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <View className="relative">
              <TextInput
                placeholderTextColor="#94A3B8"
                className="border border-gray-300 rounded-xl px-4 py-3 mb-2 text-base"
                placeholder="Mật khẩu"
                secureTextEntry={!isPasswordVisible}
                value={value}
                onChangeText={onChange}
              />
              <TouchableOpacity
                className="absolute right-5 top-4"
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Ionicons name={isPasswordVisible ? 'eye' : 'eye-off'} size={20} color="#64748B" />
              </TouchableOpacity>
              {errors.password && (
                <Text className="text-red-500 text-sm mb-2">{errors.password.message}</Text>
              )}
            </View>
          )}
        />

        <TouchableOpacity
          className="items-end mb-4"
          onPress={() => router.push(ERouteTable.FORGOT_PASSWORD)}
        >
          <Text className="underline font-normal">Quên mật khẩu?</Text>
        </TouchableOpacity>

        <Pressable
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
          className={`bg-[#885BF0] h-12 py-3 rounded-xl ${loading ? 'opacity-50' : ''}`}
        >
          <Text className="text-white text-center text-base font-semibold">
            {loading ? 'Đăng nhập...' : 'Đăng nhập'}
          </Text>
        </Pressable>

        <Pressable onPress={() => router.push(ERouteTable.SIGIN_UP)}>
          <Text className="text-center text-sm text-[#6B7280] mt-6">
            Bạn chưa có tài khoản? <Text className="font-semibold text-[#885BF0]">Đăng ký</Text>
          </Text>
        </Pressable>
      </View>
    </ImageBackground>
  )
}

export default SignIn
