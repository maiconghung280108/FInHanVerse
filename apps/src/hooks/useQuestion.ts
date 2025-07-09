import { useMutation, useQuery } from '@tanstack/react-query'
import API_CLIENT from '@/libs/api/client'
import { Routes } from '@/libs/api/routes/routes'
import { AuthRoutes } from '@/libs/api/routes/auth-routes'
import { _queryClient } from '@/context/QueryProvider'
import { ERouteTable } from '@/constants/route-table'
import { router } from 'expo-router'

interface Answer {
  id: number
  text: string
  isCorrect: boolean
  questionId: number
  createdAt: string
  updatedAt: string
}

interface Question {
  id: number
  text: string
  quizId: number
  isMultiple: boolean
  createdAt: string
  updatedAt: string
  answers: Answer[]
  explanation: string
}

interface SubmitQuizPayload {
  quizId: number
  userAnswers: {
    questionId: number
    answerIds: number[]
  }[]
}

export function useQuestion(coursesId: string, type: number) {
  const quizQuery = useQuery({
    queryKey: ['quiz', coursesId],
    queryFn: async () => {
      const response = await API_CLIENT.get(
        `${Number(type) == 0 ? Routes.home.quizLearning : Routes.practice.quizDetail}${coursesId}`,
      )
      return {
        questions: response.data.questions as Question[],
        courseData: response.data,
      }
    },
    enabled: !!coursesId,
  })

  const submitQuiz = useMutation({
    mutationFn: async (data: SubmitQuizPayload) => {
      const response = await API_CLIENT.post(
        `${Number(type) === 0 ? Routes.home.submitQuizLearning : Routes.practice.submitQuizPractice}`,
        data,
      )
      return response.data
    },
    onSuccess: () => {},
    onError: (error) => {
      // TODO: handle error with toast
    },
  })

  return {
    quizQuery,
    submitQuiz,
  }
}
