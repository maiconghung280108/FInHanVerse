import { useQuery } from '@tanstack/react-query'
import API_CLIENT from '@/libs/api/client'
import { Routes } from '@/libs/api/routes/routes'
import { IDataItemLessonHomeProps } from '@/components/ItemLessonHome'

interface ITabData {
  completedCourses: number
  totalCourses: number
  description: string
  title: string
  id: number
}

export interface UserRanking {
  id: number
  fullName: string
  email: string
  avatar: string | null
  totalScore: number
}

interface RankingsByType {
  learning: UserRanking[]
  quiz: UserRanking[]
}

interface RankingResponse {
  totalScore: number
  rankingsByType: RankingsByType
}

export function useHome(activeTab?: number) {
  // Query for categories
  const categoriesQuery = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await API_CLIENT.get(Routes.home.listCategory)
      return response.data as ITabData[]
    },
  })

  // Query for learning items
  const learningItemsQuery = useQuery({
    queryKey: ['learningItems', activeTab],
    queryFn: async () => {
      if (!activeTab) return []
      const response = await API_CLIENT.get(`${Routes.home.listLearning}${activeTab}`)
      return response.data as IDataItemLessonHomeProps[]
    },
    enabled: !!activeTab,
  })

  // Query for rank

  const rankQuery = useQuery({
    queryKey: ['ranks'],
    queryFn: async () => {
      const response = await API_CLIENT.get(Routes.rank.rank)
      return response.data as RankingResponse
    },
  })

  return {
    categoriesQuery,
    learningItemsQuery,
    rankQuery,
  }
}
