// Type cho câu hỏi
export type Question = {
  id: number
  question: string
  answer: number
  explanation: string
}

// Danh sách câu hỏi tài chính
export const QUESTIONS: Question[] = [
  {
    id: 1,
    question:
      'Bạn nhận được 100.000 VND tiền tiêu vặt mỗi tháng. Nếu bạn tiết kiệm 10% mỗi tháng, sau 1 năm bạn sẽ tiết kiệm được bao nhiêu?',
    answer: 120000,
    explanation: '(100.000 × 10% = 10.000 → 10.000 × 12 tháng = 120.000 VND)',
  },
  {
    id: 2,
    question:
      'Một cái kẹo có giá 5.000 VND. Bạn có 50.000 VND. Bạn có thể mua được tối đa bao nhiêu cái kẹo?',
    answer: 10,
    explanation: '(50.000 ÷ 5.000 = 10 cái kẹo)',
  },
  {
    id: 3,
    question:
      'Bạn gửi tiết kiệm 200.000 VND với lãi suất 5% một năm. Sau 1 năm bạn nhận được bao nhiêu tiền lãi?',
    answer: 10000,
    explanation: '(200.000 × 5% = 10.000 VND tiền lãi)',
  },
  {
    id: 4,
    question: 'Mỗi tuần bạn tiết kiệm 15.000 VND. Sau 8 tuần bạn sẽ có bao nhiêu tiền?',
    answer: 120000,
    explanation: '(15.000 × 8 tuần = 120.000 VND)',
  },
  {
    id: 5,
    question:
      'Bạn muốn mua một món đồ chơi giá 300.000 VND. Nếu tiết kiệm 25.000 VND mỗi tháng, sau bao nhiêu tháng bạn có đủ tiền?',
    answer: 12,
    explanation: '(300.000 ÷ 25.000 = 12 tháng)',
  },
  {
    id: 6,
    question: 'Bạn có 80.000 VND. Sau khi mua bánh kẹo hết 35.000 VND, bạn còn lại bao nhiêu tiền?',
    answer: 45000,
    explanation: '(80.000 - 35.000 = 45.000 VND)',
  },
  {
    id: 7,
    question: 'Nếu bạn tiết kiệm 20% từ 150.000 VND tiền lì xì, bạn sẽ tiết kiệm được bao nhiêu?',
    answer: 30000,
    explanation: '(150.000 × 20% = 30.000 VND)',
  },
  {
    id: 8,
    question:
      'Bạn làm việc nhà và nhận được 8.000 VND mỗi ngày. Trong 1 tuần (7 ngày) bạn sẽ kiếm được bao nhiêu?',
    answer: 56000,
    explanation: '(8.000 × 7 ngày = 56.000 VND)',
  },
]
