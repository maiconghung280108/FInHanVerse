import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useAuth } from '@/hooks/useAuth'
import { images } from '@/constants'
import { ERouteTable } from '@/constants/route-table'
import CustomButton from '@/components/CustomButton'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'

const schema = yup.object().shape({
  verificationCode: yup
    .string()
    .required('Vui lòng nhập mã xác thực')
    .matches(/^\d{6}$/, 'Mã xác thực phải gồm 6 chữ số'),
})

const VerifyAccount = () => {
  const router = useRouter()
  const [countdown, setCountdown] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { email } = useLocalSearchParams<{ email: string }>()
  const { resendPasswordMutation, verifyOtpMutation } = useAuth()

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      verificationCode: '',
    },
  })

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1)
      }, 1000)
    } else {
      setCanResend(true)
    }
    return () => clearInterval(timer)
  }, [countdown])

  const onSubmit = async (data: { verificationCode: string }) => {
    const dataSubmit = {
      email: email,
      otpCode: data.verificationCode,
    }
    try {
      setIsLoading(true)
      await verifyOtpMutation.mutateAsync(dataSubmit)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    try {
      if (canResend) {
        setIsLoading(true)
        await resendPasswordMutation.mutateAsync({ email: email })
        setCountdown(60)
        setCanResend(false)
      }
    } catch (error) {
      console.error(error)
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi gửi lại mã. Vui lòng thử lại.')
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
        <Text className="text-center text-2xl font-bold mt-10">Xác thực tài khoản</Text>
        <Text className="mt-2 text-center text-gray-500">
          Chúng tôi phải gửi mã xác minh tới email
        </Text>
        <Text className="mt-1 mb-6 font-bold text-center text-gray-500">{email}</Text>

        <Controller
          control={control}
          name="verificationCode"
          render={({ field: { onChange, value } }) => (
            <View>
              <TextInput
                className="border border-gray-300 rounded-xl px-4 py-3 mb-1 text-base"
                placeholderTextColor="#94A3B8"
                placeholder="Nhập mã xác thực"
                onChangeText={onChange}
                value={value}
                keyboardType="numeric"
                maxLength={6}
                editable={!isLoading}
              />
              {errors.verificationCode && (
                <Text className="text-red-500 text-sm mb-2">{errors.verificationCode.message}</Text>
              )}
            </View>
          )}
        />

        <CustomButton
          title={isLoading ? 'Đang xử lý...' : 'Xác thực'}
          onPress={handleSubmit(onSubmit)}
          containerStyle={`w-full mt-7 mb-2 ${isLoading ? 'bg-gray-400' : 'bg-[#1E293B]'} min-h-12`}
          textStyle="text-white"
          disabled={isLoading}
        />

        <TouchableOpacity
          className="flex-row gap-1 mt-4 flex mx-auto"
          onPress={handleResendCode}
          disabled={!canResend || isLoading}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#734DBE" />
          ) : !canResend ? (
            <Text className="text-[#734DBE] font-semibold">{countdown}S</Text>
          ) : (
            <Text className="text-[#734DBE] font-semibold">Gửi lại</Text>
          )}
        </TouchableOpacity>

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

export default VerifyAccount
