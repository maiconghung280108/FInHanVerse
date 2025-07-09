import React, { useState } from 'react'
import { View, ActivityIndicator } from 'react-native'
import OptimizedImage from './index'

interface LessonThumbnailProps {
  imageUrl?: string
  className?: string
  fallbackUrl?: string
  isLocked?: boolean
  showSkeleton?: boolean
}

const LessonThumbnail: React.FC<LessonThumbnailProps> = ({
  imageUrl,
  className = 'h-[96px] w-[96px] rounded-3xl',
  fallbackUrl = 'https://images.chesscomfiles.com/uploads/v1/blog/885909.7e36238c.668x375o.110d28c5a87b@2x.png',
  isLocked = false,
  showSkeleton = true,
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const imageSource = imageUrl ? { uri: imageUrl } : { uri: fallbackUrl }

  const handleLoad = () => {
    setIsLoading(false)
    setHasError(false)
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  return (
    <View className={`relative ${className}`}>
      <OptimizedImage
        source={imageSource}
        className={className}
        showLoading={false} // Chúng ta sẽ tự quản lý loading
        placeholderColor="#64748B14"
        onLoad={handleLoad}
        onError={handleError}
      />

      {/* Custom skeleton loading */}
      {showSkeleton && isLoading && !hasError && (
        <View
          className={`absolute inset-0 ${className} bg-gray-200 items-center justify-center rounded-3xl`}
        >
          <View className="animate-pulse">
            <ActivityIndicator size="small" color="#734DBE" />
          </View>
        </View>
      )}

      {/* Error state với gradient */}
      {hasError && (
        <View
          className={`absolute inset-0 ${className} bg-gradient-to-br from-gray-300 to-gray-400 items-center justify-center rounded-3xl`}
        >
          <View className="w-8 h-8 bg-white rounded opacity-50" />
        </View>
      )}

      {/* Locked overlay */}
      {isLocked && (
        <View
          className="absolute inset-0 bg-black bg-opacity-30 items-center justify-center rounded-3xl"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}
        />
      )}
    </View>
  )
}

export default LessonThumbnail
