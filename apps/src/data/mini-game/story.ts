export interface Message {
  id: string
  text: string
  isBot: boolean
  options?: string[]
  isCorrect?: boolean
}

export interface Scenario {
  id: string
  category: string
  botMessage: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  points: number
}

export const allScenarios: Scenario[] = [
  // Tiết kiệm và đầu tư
  {
    id: '1',
    category: 'Tiết kiệm',
    botMessage: 'Bạn được cho 500,000 VND tiền mừng tuổi. Bạn sẽ làm gì với số tiền này?',
    options: [
      'Chia: tiêu 200K, tiết kiệm 250K, chia sẻ 50K',
      'Tiêu hết vì năm sau lại có tiền mừng tuổi',
      'Cho bố mẹ giữ hộ hết',
      'Mua đồ chơi đắt tiền ngay',
    ],
    correctAnswer: 0,
    explanation:
      'Tuyệt vời! Chia tiền thành 3 phần là cách quản lý tài chính thông minh: chi tiêu hợp lý, tiết kiệm và chia sẻ.',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: '2',
    category: 'Mua sắm thông minh',
    botMessage: 'Bạn muốn mua một món đồ chơi 200,000 VND nhưng chỉ có 150,000 VND. Bạn sẽ làm gì?',
    options: [
      'Vay tiền bạn bè để mua ngay',
      'Tiết kiệm thêm tiền rồi mua sau',
      'Xin bố mẹ cho thêm tiền',
      'Mua món đồ chơi khác rẻ hơn',
    ],
    correctAnswer: 1,
    explanation:
      'Rất tốt! Tiết kiệm để mua sau là cách tốt nhất để học cách quản lý tài chính và kiên nhẫn.',
    difficulty: 'medium',
    points: 15,
  },
  {
    id: '3',
    category: 'Đầu tư',
    botMessage: 'Bạn có 1 triệu đồng và muốn tăng thêm tiền. Cách nào tốt nhất?',
    options: [
      'Gửi tiết kiệm ngân hàng',
      'Mua vàng',
      'Đầu tư học thêm kỹ năng',
      'Cho bạn vay lấy lãi',
    ],
    correctAnswer: 2,
    explanation: 'Xuất sắc! Đầu tư vào giáo dục và kỹ năng là khoản đầu tư tốt nhất cho tương lai.',
    difficulty: 'hard',
    points: 20,
  },
  {
    id: '4',
    category: 'Từ thiện',
    botMessage: 'Bạn thấy một người bạn cùng lớp gặp khó khăn tài chính. Bạn sẽ làm gì?',
    options: [
      'Cho tiền mặt trực tiếp',
      'Chia sẻ đồ ăn, học phẩm',
      'Nói với cô giáo để hỗ trợ',
      'Làm ngơ vì không phải việc của mình',
    ],
    correctAnswer: 1,
    explanation:
      'Tốt lắm! Chia sẻ những thứ hữu ích là cách giúp đỡ bạn bè một cách tự nhiên và ý nghĩa.',
    difficulty: 'medium',
    points: 15,
  },
  {
    id: '5',
    category: 'Tiêu dùng',
    botMessage: 'Bạn đi siêu thị với bố mẹ và thấy kẹo yêu thích đang giảm giá 50%. Bạn sẽ làm gì?',
    options: [
      'Mua nhiều để dự trữ',
      'Mua 1 gói như bình thường',
      'Kiểm tra hạn sử dụng trước khi quyết định',
      'Không mua vì đang tiết kiệm',
    ],
    correctAnswer: 2,
    explanation:
      'Thông minh! Luôn kiểm tra chất lượng và hạn sử dụng trước khi mua, dù có giảm giá.',
    difficulty: 'medium',
    points: 15,
  },
  {
    id: '6',
    category: 'Kinh doanh',
    botMessage: 'Bạn muốn bán đồ handmade để kiếm tiền. Bạn sẽ bắt đầu như thế nào?',
    options: [
      'Làm nhiều sản phẩm rồi bán',
      'Hỏi bạn bè có muốn mua không trước',
      'Tính toán chi phí và giá bán',
      'Bắt chước sản phẩm đang bán chạy',
    ],
    correctAnswer: 2,
    explanation:
      'Rất tốt! Tính toán chi phí và lợi nhuận là bước đầu tiên quan trọng trong kinh doanh.',
    difficulty: 'hard',
    points: 20,
  },
  {
    id: '7',
    category: 'Quản lý tiền',
    botMessage: 'Bạn có 100,000 VND tiền tiêu vặt mỗi tuần. Cách nào giúp bạn quản lý tốt nhất?',
    options: [
      'Tiêu hết trong ngày đầu',
      'Chia đều 7 ngày, mỗi ngày 15,000',
      'Tiết kiệm 30,000, chi tiêu 70,000',
      'Để dành hết không tiêu',
    ],
    correctAnswer: 2,
    explanation: 'Tuyệt vời! Luôn để dành một phần và chia tiền chi tiêu hợp lý là thói quen tốt.',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: '8',
    category: 'Tiêu dùng thông minh',
    botMessage:
      'Bạn cần mua vở mới. Có 3 loại: rẻ (5,000), trung bình (8,000), đắt (12,000). Bạn chọn loại nào?',
    options: [
      'Loại rẻ nhất để tiết kiệm',
      'Loại đắt nhất vì chất lượng tốt',
      'Loại trung bình, cân bằng giá và chất lượng',
      'Mua nhiều loại rẻ để dự phòng',
    ],
    correctAnswer: 2,
    explanation: 'Thông minh! Cân bằng giữa giá cả và chất lượng là cách tiêu dùng khôn ngoan.',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: '9',
    category: 'Đầu tư',
    botMessage:
      'Bạn muốn học một kỹ năng mới cần mất phí 500,000 VND. Bạn sẽ quyết định như thế nào?',
    options: [
      'Học ngay vì đầu tư cho tương lai',
      'Tìm hiểu kỹ về kỹ năng đó trước',
      'Hỏi ý kiến bố mẹ và thầy cô',
      'Không học vì quá đắt',
    ],
    correctAnswer: 1,
    explanation: 'Tốt lắm! Luôn tìm hiểu kỹ trước khi đầu tư để đảm bảo đó là quyết định đúng đắn.',
    difficulty: 'medium',
    points: 15,
  },
  {
    id: '10',
    category: 'Tiết kiệm',
    botMessage: 'Bạn muốn mua một chiếc xe đạp 2 triệu đồng. Cách tiết kiệm nào hiệu quả nhất?',
    options: [
      'Tiết kiệm 100,000 mỗi tháng',
      'Xin bố mẹ mua trước, trả góp sau',
      'Làm thêm việc để kiếm tiền',
      'Vay bạn bè để mua ngay',
    ],
    correctAnswer: 0,
    explanation: 'Rất tốt! Lập kế hoạch tiết kiệm đều đặn là cách tốt nhất để đạt được mục tiêu.',
    difficulty: 'medium',
    points: 15,
  },
  {
    id: '11',
    category: 'Quản lý rủi ro',
    botMessage: 'Bạn mang theo 200,000 VND đi du lịch. Cách nào an toàn nhất?',
    options: [
      'Để hết trong ví',
      'Chia làm nhiều chỗ khác nhau',
      'Gửi bạn bè giữ hộ',
      'Đưa hết cho bố mẹ cất',
    ],
    correctAnswer: 1,
    explanation:
      'Thông minh! Phân tán rủi ro bằng cách chia tiền ra nhiều nơi là cách bảo vệ tài sản tốt.',
    difficulty: 'hard',
    points: 20,
  },
  {
    id: '12',
    category: 'Từ thiện',
    botMessage:
      'Trường tổ chức quyên góp cho trẻ em vùng cao. Bạn có 50,000 VND dành cho từ thiện. Bạn sẽ làm gì?',
    options: [
      'Quyên góp hết 50,000',
      'Quyên góp 30,000, để lại 20,000 cho lần khác',
      'Mua đồ dùng học tập tặng thay vì cho tiền',
      'Không tham gia vì số tiền quá ít',
    ],
    correctAnswer: 1,
    explanation:
      'Tuyệt vời! Luôn để dành một phần cho những hoạt động từ thiện khác là cách làm bền vững.',
    difficulty: 'medium',
    points: 15,
  },
  {
    id: '13',
    category: 'Kinh doanh',
    botMessage:
      'Bạn bán nước chanh ở trường và thu được 150,000 VND. Chi phí nguyên liệu là 80,000 VND. Bạn sẽ làm gì với lợi nhuận?',
    options: [
      'Tiêu hết để thưởng cho bản thân',
      'Đầu tư lại để mở rộng kinh doanh',
      'Chia đôi: một nửa tiêu, một nửa tái đầu tư',
      'Gửi tiết kiệm hết',
    ],
    correctAnswer: 2,
    explanation:
      'Xuất sắc! Cân bằng giữa thưởng cho bản thân và tái đầu tư là cách quản lý kinh doanh thông minh.',
    difficulty: 'hard',
    points: 20,
  },
  {
    id: '14',
    category: 'Mua sắm thông minh',
    botMessage:
      'Bạn cần mua quà sinh nhật cho bạn thân. Ngân sách là 100,000 VND. Bạn sẽ chọn quà như thế nào?',
    options: [
      'Mua quà đắt nhất có thể',
      'Mua quà phù hợp với sở thích của bạn ấy',
      'Mua nhiều quà nhỏ',
      'Làm quà handmade để tiết kiệm',
    ],
    correctAnswer: 1,
    explanation:
      'Tốt lắm! Món quà ý nghĩa quan trọng hơn giá trị, hãy chọn theo sở thích của người nhận.',
    difficulty: 'easy',
    points: 10,
  },
  {
    id: '15',
    category: 'Quản lý tiền',
    botMessage: 'Cuối tháng bạn còn dư 80,000 VND tiền tiêu vặt. Bạn sẽ làm gì?',
    options: [
      'Tiêu hết vào những ngày cuối tháng',
      'Cộng vào tiền tiêu vặt tháng sau',
      'Tiết kiệm một nửa, cộng một nửa vào tháng sau',
      'Mua quà cho bố mẹ',
    ],
    correctAnswer: 2,
    explanation:
      'Thông minh! Vừa tiết kiệm vừa có thêm tiền tiêu vặt là cách quản lý cân bằng tốt.',
    difficulty: 'medium',
    points: 15,
  },
]
