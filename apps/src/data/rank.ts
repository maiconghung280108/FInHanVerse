import { images } from '@/constants'

export const RANK_TIERS = [
  {
    minScore: 0,
    maxScore: 1000,
    rank: images.rank1,
    nextRank: images.rank2,
    nextScore: 1000,
    name: 'NGƯỜI GIỮ TIỀN NHỎ',
    nameNext: 'NGƯỜI QUẢN LÝ VÍ',
  },
  {
    minScore: 1001,
    maxScore: 3000,
    rank: images.rank2,
    nextRank: images.rank3,
    nextScore: 3000,
    name: 'NGƯỜI QUẢN LÝ VÍ',
    nameNext: 'NHÀ TƯ DUY TÀI CHÍNH',
  },
  {
    minScore: 3001,
    maxScore: 5000,
    rank: images.rank3,
    nextRank: images.rank4,
    nextScore: 5000,
    name: 'NHÀ TƯ DUY TÀI CHÍNH',
    nameNext: 'NHÀ ĐẦU TƯ NHÍ',
  },
  {
    minScore: 5001,
    maxScore: 8000,
    rank: images.rank4,
    nextRank: images.rank5,
    nextScore: 8000,
    name: 'NHA ĐẦU TƯ NHÍ',
    nameNext: 'CHỦ NGÂN HÀNG MINI',
  },
  {
    minScore: 8001,
    maxScore: 10000,
    rank: images.rank5,
    nextRank: images.rank6,
    nextScore: 10000,
    name: 'CHỦ NGÂN HÀNG MINI',
    nameNext: 'SIÊU SAO TÀI CHÍNH',
  },
  {
    minScore: 10001,
    maxScore: 999999,
    rank: images.rank6,
    nextRank: images.rank6,
    nextScore: 999999,
    name: 'SIÊU SAO TÀI CHÍNH',
    nameNext: 'SIÊU SAO TÀI CHÍNH',
  },
]

export const listDefaultRank = [
  {
    image: images.rank1,
    name: 'Người Giữ Tiền Nhỏ',
    description: 'Học cách tiết kiệm và hiểu giá trị của tiền.',
    star: '0',
  },
  {
    image: images.rank2,
    name: 'Người Quản Lý Ví',
    description: 'Biết chia tiền hợp lý vào tiêu dùng – tiết kiệm – chia sẻ.',
    star: '1,000',
  },
  {
    image: images.rank3,
    name: 'Nhà Tư Duy Tài Chính',
    description: 'Bắt đầu hiểu được các quyết định tài chính',
    star: '3,000',
  },
  {
    image: images.rank4,
    name: 'Nhà Đầu Tư Nhí',
    description: 'Hiểu về đầu tư, lợi nhuận, rủi ro và lãi suất cơ bản.',
    star: '5,000',
  },
  {
    image: images.rank5,
    name: 'Chủ Ngân Hàng Mini',
    description: 'Có thể lên kế hoạch tài chính cá nhân theo tuần/tháng.',
    star: '8,000',
  },
  {
    image: images.rank6,
    name: 'Siêu Sao Tài Chính',
    description: 'Thông thạo chi tiêu, tiết kiệm, đầu tư và chia sẻ thông minh.',
    star: '10,000',
  },
]
