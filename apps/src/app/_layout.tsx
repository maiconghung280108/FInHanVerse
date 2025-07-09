import { Stack } from 'expo-router'
import '~/global.css' // Tailwind / NativeWind globals
import { QueryProvider } from '@/context/QueryProvider'
import { ToastProvider } from '@/components/ToastNotify/ToastContext'
import { StatusBar } from 'react-native'

export default function RootLayout() {
  return (
    <QueryProvider>
      <ToastProvider>
        <StatusBar translucent backgroundColor={'transparent'} barStyle="light-content" />
        <Stack screenOptions={{ headerShown: false }} />
      </ToastProvider>
    </QueryProvider>
  )
}
