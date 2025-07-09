import { useQuery } from '@tanstack/react-query'
import API_CLIENT from '@/libs/api/client'
import { Routes } from '@/libs/api/routes/routes'

interface Quiz {
  id: number
  title: string
  courseId: string
  createdAt: string
  updatedAt: string
  level: string
  course: string
  score: {
    score: number
    totalScore: number
  }
  isLocked: boolean
  isCompleted: boolean
}

export function usePractice(level: string) {
  const quizQuery = useQuery({
    queryKey: ['quiz-practice', level],
    queryFn: async () => {
      const response = await API_CLIENT.get(`${Routes.practice.quiz}`, {
        params: {
          level: level,
        },
      })
      return response.data as Quiz[]
    },
    enabled: !!level,
  })

  return {
    quizQuery,
  }
}
