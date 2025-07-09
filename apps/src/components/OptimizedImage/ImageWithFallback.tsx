import React from 'react'
import { View, Text } from 'react-native'
import OptimizedImage from './index'
import { images } from '@/constants'

interface ImageWithFallbackProps {
  source?: { uri: string } | any
  fallbackSource?: any
  className?: string
  showInitials?: boolean
  initials?: string
  style?: React.CSSProperties
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  source,
  fallbackSource = images.logoApp,
  className,
  showInitials = false,
  initials = '?',
  style,
}) => {
  // Nếu không có source hoặc source không hợp lệ
  if (!source || (source.uri && !source.uri.trim())) {
    if (showInitials && initials) {
      return (
        <View
          className={`${className} items-center justify-center`}
          style={{ backgroundColor: 'gray', ...style }}
        >
          <Text className="text-white font-bold text-xs">{initials.charAt(0).toUpperCase()}</Text>
        </View>
      )
    }

    return (
      <OptimizedImage
        source={fallbackSource}
        className={className}
        showLoading={false}
        placeholderColor="gray"
        style={style}
      />
    )
  }

  return (
    <OptimizedImage
      source={source}
      className={className}
      showLoading={true}
      placeholderColor="gray"
      style={style}
    />
  )
}

export default ImageWithFallback
