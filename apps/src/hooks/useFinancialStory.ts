import { useState, useCallback } from 'react'

export interface Choice {
  id: string
  text: string
  impact: {
    balance: number
    score: number
  }
  nextStepId?: string
}

export interface StoryStep {
  id: string
  content: string
  choices?: Choice[]
  isEnding?: boolean
  feedback?: string
}

export interface Story {
  id: string
  title: string
  description: string
  initialBalance: number
  steps: StoryStep[]
}

export interface GameState {
  balance: number
  score: number
  currentStepId: string
  completedSteps: string[]
  storyId: string
}

// Sample stories data
const SAMPLE_STORIES: Story[] = [
  {
    id: 'money-gift',
    title: 'Tiền mừng tuổi',
    description: 'Bạn nhận được món tiền mừng tuổi và phải quyết định cách sử dụng nó',
    initialBalance: 500000,
    steps: [
      {
        id: 'start',
        content: 'Ô, vậy đầu tư là gì?',
      },
      {
        id: 'intro',
        content: 'Con được 500.000 VNĐ. Con đang phân vân giữa tiêu hết, để dành, hay chia ra.',
        choices: [
          {
            id: 'choice1',
            text: 'Chia: tiêu 250K, tiết kiệm 200K, chia sẻ 50K',
            impact: { balance: -250000, score: 15 },
            nextStepId: 'good-choice',
          },
          {
            id: 'choice2',
            text: 'Tiêu hết vì mình cũng ít khi có tiền mừng tuổi',
            impact: { balance: -500000, score: -10 },
            nextStepId: 'poor-choice',
          },
          {
            id: 'choice3',
            text: 'Cho anh hết để anh giữ nó',
            impact: { balance: 0, score: 5 },
            nextStepId: 'safe-choice',
          },
        ],
      },
      {
        id: 'good-choice',
        content:
          'Tuyệt vời! Bạn đã học cách phân bổ tiền một cách thông minh. Việc chia tiền thành 3 phần: tiêu dùng, tiết kiệm và chia sẻ là một thói quen tài chính tuyệt vời.',
        isEnding: true,
        feedback: 'Xuất sắc! Bạn hiểu được tầm quan trọng của việc quản lý tiền bạc cân bằng.',
      },
      {
        id: 'poor-choice',
        content:
          'Hmm, tiêu hết tiền có thể mang lại niềm vui tức thì nhưng không giúp bạn xây dựng thói quen tài chính tốt. Hãy thử nghĩ về việc để dành một phần cho tương lai.',
        isEnding: true,
        feedback: 'Hãy thử lại và suy nghĩ về lợi ích dài hạn của việc tiết kiệm.',
      },
      {
        id: 'safe-choice',
        content:
          'Việc nhờ người lớn giữ tiền là an toàn, nhưng bạn cũng nên học cách tự quản lý tiền để rèn luyện kỹ năng tài chính.',
        isEnding: true,
        feedback: 'Tốt nhưng hãy thử tự quản lý một phần nhỏ để học hỏi kinh nghiệm.',
      },
    ],
  },
  {
    id: 'smart-shopping',
    title: 'Mua sắm thông minh',
    description: 'Bạn cần mua một chiếc điện thoại mới với số tiền có hạn',
    initialBalance: 10000000, // 10 triệu VND
    steps: [
      {
        id: 'start',
        content: 'Bạn đang cần một chiếc điện thoại mới vì chiếc cũ đã hỏng.',
      },
      {
        id: 'intro',
        content:
          'Bạn có 10 triệu VNĐ tiết kiệm. Bạn thấy có 3 lựa chọn điện thoại với các mức giá khác nhau. Bạn sẽ chọn như thế nào?',
        choices: [
          {
            id: 'phone-expensive',
            text: 'iPhone mới nhất 25 triệu (vay thêm 15 triệu)',
            impact: { balance: -25000000, score: -15 },
            nextStepId: 'debt-trouble',
          },
          {
            id: 'phone-moderate',
            text: 'Samsung Galaxy tầm trung 8 triệu',
            impact: { balance: -8000000, score: 10 },
            nextStepId: 'wise-choice',
          },
          {
            id: 'phone-budget',
            text: 'Điện thoại cũ đã qua sử dụng 3 triệu',
            impact: { balance: -3000000, score: 8 },
            nextStepId: 'budget-choice',
          },
        ],
      },
      {
        id: 'debt-trouble',
        content:
          'Việc mua iPhone mới nhất khiến bạn phải vay nợ 15 triệu. Đây là một quyết định tài chính không khôn ngoan vì bạn sẽ phải trả lãi suất và gánh nặng tài chính trong tương lai.',
        isEnding: true,
        feedback: 'Cần cải thiện! Hãy luôn mua trong khả năng tài chính của mình.',
      },
      {
        id: 'wise-choice',
        content:
          'Tuyệt vời! Bạn đã chọn một chiếc điện thoại có chất lượng tốt trong khả năng tài chính. Bạn còn dư 2 triệu có thể tiết kiệm hoặc dành cho những nhu cầu khác.',
        isEnding: true,
        feedback: 'Xuất sắc! Bạn biết cách cân bằng giữa chất lượng và khả năng tài chính.',
      },
      {
        id: 'budget-choice',
        content:
          'Bạn đã chọn một lựa chọn tiết kiệm! Mặc dù điện thoại cũ nhưng vẫn đủ dùng, và bạn tiết kiệm được 7 triệu cho những mục đích khác. Đây là quyết định tài chính thông minh.',
        isEnding: true,
        feedback: 'Tốt lắm! Bạn biết cách ưu tiên tiết kiệm và mua đúng nhu cầu.',
      },
    ],
  },
]

export const useFinancialStory = (storyId: string) => {
  const story = SAMPLE_STORIES.find((s) => s.id === storyId)

  if (!story) {
    throw new Error(`Story with id ${storyId} not found`)
  }

  const [gameState, setGameState] = useState<GameState>({
    balance: story.initialBalance,
    score: 0,
    currentStepId: story.steps[0]?.id || '',
    completedSteps: [],
    storyId: story.id,
  })

  const getCurrentStep = useCallback((): StoryStep | undefined => {
    return story.steps.find((step) => step.id === gameState.currentStepId)
  }, [story.steps, gameState.currentStepId])

  const makeChoice = useCallback((choice: Choice) => {
    setGameState((prev) => {
      const newBalance = Math.max(0, prev.balance + choice.impact.balance)
      const newScore = prev.score + choice.impact.score
      const nextStepId = choice.nextStepId || prev.currentStepId

      return {
        ...prev,
        balance: newBalance,
        score: newScore,
        currentStepId: nextStepId,
        completedSteps: [...prev.completedSteps, prev.currentStepId],
      }
    })
  }, [])

  const resetGame = useCallback(() => {
    setGameState({
      balance: story.initialBalance,
      score: 0,
      currentStepId: story.steps[0]?.id || '',
      completedSteps: [],
      storyId: story.id,
    })
  }, [story])

  const getScoreRating = useCallback((score: number): string => {
    if (score >= 15) return 'Xuất sắc! 🌟'
    if (score >= 10) return 'Tốt! 👍'
    if (score >= 5) return 'Khá ổn! 😊'
    if (score >= 0) return 'Cần cải thiện! 📚'
    return 'Hãy thử lại! 💪'
  }, [])

  return {
    story,
    gameState,
    currentStep: getCurrentStep(),
    makeChoice,
    resetGame,
    getScoreRating,
    isGameEnded: getCurrentStep()?.isEnding || false,
  }
}

export const getAvailableStories = (): Story[] => {
  return SAMPLE_STORIES
}
