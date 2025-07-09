import React, { useState } from 'react'
import { View, ActivityIndicator } from 'react-native'
import { Image, ImageProps } from 'expo-image'

// @ts-ignore
interface OptimizedImageProps extends Omit<ImageProps, 'source'> {
  source: any
  className?: string
  showLoading?: boolean
  placeholderColor?: string
  style?: import('react-native').StyleProp<import('react-native').ViewStyle>
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  source,
  className,
  showLoading = true,
  placeholderColor = '#f3f4f6',
  style,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  // Nếu là local image (object với require), sử dụng trực tiếp
  const isLocalImage = typeof source === 'number' || (source && !source.uri)

  const imageSource = isLocalImage
    ? source
    : {
        uri: source?.uri || source,
        // Cache policy để tối ưu performance
        cache: 'force-cache' as const,
      }

  const handleLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  return (
    <View className={className} style={style}>
      <Image
        className={className}
        source={imageSource}
        onLoad={handleLoad}
        onError={handleError}
        contentFit="cover"
        transition={200}
        placeholder={{
          blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4',
        }}
        cachePolicy="memory-disk"
        {...props}
        style={[
          {
            width: '100%',
            height: '100%',
            backgroundColor: placeholderColor, // Adjust as needed
          },
          style as import('react-native').StyleProp<import('react-native').ImageStyle>,
          ,
        ]}
      />

      {/* Loading indicator cho remote images */}
      {showLoading && isLoading && !isLocalImage && !hasError && (
        <View
          className="absolute inset-0 items-center justify-center"
          style={{ backgroundColor: placeholderColor }}
        >
          <ActivityIndicator size="small" color="#734DBE" />
        </View>
      )}

      {/* Error fallback */}
      {hasError && (
        <View
          className="absolute inset-0 items-center justify-center rounded-3xl"
          style={{ backgroundColor: placeholderColor }}
        >
          <View className="w-6 h-6 bg-gray-300 rounded" />
        </View>
      )}
    </View>
  )
}

export default OptimizedImage
