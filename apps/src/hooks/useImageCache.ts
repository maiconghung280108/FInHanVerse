import { useEffect, useState } from 'react'
import { Image } from 'expo-image'

interface ImageCacheConfig {
  preloadImages?: string[]
  maxCacheSize?: number
}

export const useImageCache = (config: ImageCacheConfig = {}) => {
  const [isPreloading, setIsPreloading] = useState(false)
  const [preloadedCount, setPreloadedCount] = useState(0)

  const {
    preloadImages = [],
    maxCacheSize = 50 * 1024 * 1024, // 50MB default
  } = config

  // Preload images khi component mount
  useEffect(() => {
    if (preloadImages.length === 0) return

    const preloadImageList = async () => {
      setIsPreloading(true)
      setPreloadedCount(0)

      try {
        const preloadPromises = preloadImages.map(async (imageUrl, index) => {
          try {
            await Image.prefetch(imageUrl)
            setPreloadedCount(index + 1)
          } catch (error) {
            console.warn(`Failed to preload image: ${imageUrl}`, error)
          }
        })

        await Promise.allSettled(preloadPromises)
      } catch (error) {
        console.warn('Error during image preloading:', error)
      } finally {
        setIsPreloading(false)
      }
    }

    preloadImageList()
  }, [preloadImages])

  // Clear cache khi cần
  const clearCache = async () => {
    try {
      await Image.clearDiskCache()
      await Image.clearMemoryCache()
    } catch (error) {
      console.warn('Failed to clear image cache:', error)
    }
  }

  // Preload single image
  const preloadImage = async (imageUrl: string) => {
    try {
      await Image.prefetch(imageUrl)
      return true
    } catch (error) {
      console.warn(`Failed to preload image: ${imageUrl}`, error)
      return false
    }
  }

  return {
    isPreloading,
    preloadedCount,
    totalImages: preloadImages.length,
    preloadProgress: preloadImages.length > 0 ? (preloadedCount / preloadImages.length) * 100 : 0,
    clearCache,
    preloadImage,
  }
}

// Hook đặc biệt cho lesson images
export const useLessonImageCache = (lessonImages: string[] = []) => {
  return useImageCache({
    preloadImages: lessonImages,
    maxCacheSize: 30 * 1024 * 1024, // 30MB cho lesson images
  })
}
