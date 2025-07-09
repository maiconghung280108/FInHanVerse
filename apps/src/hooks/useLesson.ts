import { useQuery } from '@tanstack/react-query'
import API_CLIENT from '@/libs/api/client'
import { Routes } from '@/libs/api/routes/routes'

interface Category {
  id: number
  title: string
  description: string
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
}

interface Lesson {
  id: number
  title: string
  description: string
  content: string
  createdAt: string // ISO date string
  updatedAt: string // ISO date string
  categoryId: number
  category: Category
  image: string
}

export function useLesson(coursesId: string) {
  const lessonQuery = useQuery({
    queryKey: ['lesson-detail', coursesId],
    queryFn: async () => {
      const response = await API_CLIENT.get(`${Routes.home.learningDetail}/${coursesId}`)
      return response.data as Lesson
    },
    enabled: !!coursesId,
  })

  return {
    lessonQuery,
  }
}
