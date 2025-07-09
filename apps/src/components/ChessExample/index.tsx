import React, { useState } from 'react'
import { View, TouchableOpacity, Text, Alert } from 'react-native'
import IconHint from '~/assets/icon-svg/IconHint'
import IconRollBack from '~/assets/icon-svg/IconRollBack'
import IconXeDen from '~/assets/icon-svg/chess/black/IconXeDen'
import IconMaDen from '~/assets/icon-svg/chess/black/IconMaDen'
import IconTuongDen from '~/assets/icon-svg/chess/black/IconTuongDen'
import IconVuaDen from '~/assets/icon-svg/chess/black/IconVuaDen'
import IconHauDen from '~/assets/icon-svg/chess/black/IconHauDen'
import IconTotDen from '~/assets/icon-svg/chess/black/IconTotDen'
import IconXe from '~/assets/icon-svg/chess/white/IconXe'
import IconMa from '~/assets/icon-svg/chess/white/IconMa'
import IconTuong from '~/assets/icon-svg/chess/white/IconTuong'
import IconHau from '~/assets/icon-svg/chess/white/IconHau'
import IconVua from '~/assets/icon-svg/chess/white/IconVua'
import IconTot from '~/assets/icon-svg/chess/white/IconTot'

// Định nghĩa các quân cờ và vị trí
const PIECES = {
  // Quân đen
  ROOK_B: <IconXeDen />,
  KNIGHT_B: <IconMaDen />,
  BISHOP_B: <IconTuongDen />,
  QUEEN_B: <IconHauDen />,
  KING_B: <IconVuaDen />,
  PAWN_B: <IconTotDen />,
  // Quân trắng
  ROOK_W: <IconXe />,
  KNIGHT_W: <IconMa />,
  BISHOP_W: <IconTuong />,
  QUEEN_W: <IconHau />,
  KING_W: <IconVua />,
  PAWN_W: <IconTot />,
  EMPTY: '',
} as const

type Position = {
  row: number
  col: number
}

// Thế cờ mới - quân trắng cần di chuyển để học
const INITIAL_BOARD = [
  [
    PIECES.ROOK_B,
    PIECES.KNIGHT_B,
    PIECES.BISHOP_B,
    PIECES.QUEEN_B,
    PIECES.KING_B,
    PIECES.BISHOP_B,
    PIECES.KNIGHT_B,
    PIECES.ROOK_B,
  ],
  [
    PIECES.PAWN_B,
    PIECES.PAWN_B,
    PIECES.PAWN_B,
    PIECES.PAWN_B,
    PIECES.PAWN_B,
    PIECES.PAWN_B,
    PIECES.PAWN_B,
    PIECES.PAWN_B,
  ],
  [
    PIECES.EMPTY,
    PIECES.EMPTY,
    PIECES.EMPTY,
    PIECES.EMPTY,
    PIECES.EMPTY,
    PIECES.EMPTY,
    PIECES.EMPTY,
    PIECES.EMPTY,
  ],
  [
    PIECES.EMPTY,
    PIECES.EMPTY,
    PIECES.EMPTY,
    PIECES.EMPTY,
    PIECES.EMPTY,
    PIECES.EMPTY,
    PIECES.EMPTY,
    PIECES.EMPTY,
  ],
  [
    PIECES.EMPTY,
    PIECES.EMPTY,
    PIECES.EMPTY,
    PIECES.EMPTY,
    PIECES.EMPTY,
    PIECES.EMPTY,
    PIECES.EMPTY,
    PIECES.EMPTY,
  ],
  [
    PIECES.EMPTY,
    PIECES.EMPTY,
    PIECES.EMPTY,
    PIECES.EMPTY,
    PIECES.EMPTY,
    PIECES.EMPTY,
    PIECES.EMPTY,
    PIECES.EMPTY,
  ],
  [
    PIECES.PAWN_W,
    PIECES.PAWN_W,
    PIECES.PAWN_W,
    PIECES.PAWN_W,
    PIECES.PAWN_W,
    PIECES.PAWN_W,
    PIECES.PAWN_W,
    PIECES.PAWN_W,
  ],
  [
    PIECES.ROOK_W,
    PIECES.KNIGHT_W,
    PIECES.BISHOP_W,
    PIECES.QUEEN_W,
    PIECES.KING_W,
    PIECES.BISHOP_W,
    PIECES.KNIGHT_W,
    PIECES.ROOK_W,
  ],
]

// Vị trí đúng cần di chuyển đến
const CORRECT_MOVE = {
  from: { row: 6, col: 4 }, // Quân tốt trắng ở vị trí e2
  to: { row: 4, col: 4 }, // Di chuyển đến e4
}

interface IChessExampleProps {
  setNoti: any
}

const ChessExample = ({ setNoti }: IChessExampleProps) => {
  const [board, setBoard] = useState(INITIAL_BOARD)
  const [selectedPiece, setSelectedPiece] = useState<Position | null>(null)
  const [hasMoved, setHasMoved] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const isWhitePiece = (piece: string) => {
    return (
      piece === PIECES.ROOK_W ||
      piece === PIECES.KNIGHT_W ||
      piece === PIECES.BISHOP_W ||
      piece === PIECES.QUEEN_W ||
      piece === PIECES.KING_W ||
      piece === PIECES.PAWN_W
    )
  }

  const resetBoard = () => {
    setBoard(INITIAL_BOARD)
    setSelectedPiece(null)
    setHasMoved(false)
  }

  const handlePiecePress = (row: number, col: number) => {
    if (hasMoved) {
      setNoti('Bạn chỉ được di chuyển 1 lần!')
      return
    }

    if (!selectedPiece) {
      // Chọn quân cờ
      if (board[row][col] !== PIECES.EMPTY && isWhitePiece(board[row][col])) {
        setSelectedPiece({ row, col })
      }
      return
    }

    // Di chuyển quân cờ
    const { row: fromRow, col: fromCol } = selectedPiece

    // Kiểm tra nước đi có đúng không
    if (
      fromRow === CORRECT_MOVE.from.row &&
      fromCol === CORRECT_MOVE.from.col &&
      row === CORRECT_MOVE.to.row &&
      col === CORRECT_MOVE.to.col
    ) {
      // Nước đi đúng
      const newBoard = board.map((r) => [...r])
      newBoard[row][col] = board[fromRow][fromCol]
      newBoard[fromRow][fromCol] = PIECES.EMPTY
      setBoard(newBoard as any)
      setSelectedPiece(null)
      setHasMoved(true)
      setNoti('Đã giải')
    } else {
      // Nước đi sai
      setNoti('Nước đi này không đúng')
      resetBoard()
    }
  }

  const getSquareClassName = (rowIndex: number, colIndex: number) => {
    const baseClasses = 'flex-1 items-center justify-center'
    const colorClass = (rowIndex + colIndex) % 2 === 0 ? 'bg-[#734DBE]' : 'bg-[#e2cbf7]'
    const selectedClass =
      selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex ? 'bg-[#734DBE]' : ''

    // Thêm class cho vị trí gợi ý
    const hintClass =
      showHint &&
      ((rowIndex === CORRECT_MOVE.from.row && colIndex === CORRECT_MOVE.from.col) ||
        (rowIndex === CORRECT_MOVE.to.row && colIndex === CORRECT_MOVE.to.col))
        ? 'border-2 border-yellow-400'
        : ''

    return `${baseClasses} ${colorClass} ${selectedClass} ${hintClass}`.trim()
  }

  const handleHintPress = () => {
    setShowHint(true)
    Alert.alert('Gợi ý', 'Di chuyển quân tốt từ e2 lên e4')
  }

  const handleUndoPress = () => {
    setNoti('Đến lượt quân trắng đi')
    setShowHint(false)
    resetBoard()
  }

  return (
    <View className="flex-1 h-full">
      <View className="w-full h-[393px]">
        {/* Hiển thị chữ cái cột A-H */}
        <View></View>

        {/* Bàn cờ với số hàng */}
        <View className="flex-row flex-1">
          {/* Số hàng 8-1 */}
          <View className="w-6 justify-around">
            {[8, 7, 6, 5, 4, 3, 2, 1].map((num) => (
              <Text key={num} className="text-[#734DBE] text-sm font-semibold text-center mb-8">
                {num}
              </Text>
            ))}
          </View>

          {/* Bàn cờ */}
          <View className="flex-1">
            {board.map((row, rowIndex) => (
              <View key={rowIndex} className="flex-row flex-1">
                {row.map((piece, colIndex) => (
                  <TouchableOpacity
                    key={`${rowIndex}-${colIndex}`}
                    className={getSquareClassName(rowIndex, colIndex)}
                    onPress={() => handlePiecePress(rowIndex, colIndex)}
                  >
                    <Text className="text-2xl">{piece}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
          <View className="w-6"></View>
        </View>
        <View className="flex-row ml-6">
          {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].map((col, index) => (
            <View key={col} className="flex-1 items-start">
              <Text className="font-semibold text-sm text-[#734DBE]">{col}</Text>
            </View>
          ))}
        </View>
      </View>

      <View className="w-full h-32 bg-white mt-16 px-4">
        <View className="flex-row justify-between items-center mt-4">
          <TouchableOpacity className="p-2 items-center" onPress={handleHintPress}>
            <IconHint />
            <Text className="text-[#64748B] mt-1">Gợi ý</Text>
          </TouchableOpacity>
          {hasMoved && (
            <TouchableOpacity className="bg-[#734DBE] py-2.5 px-10 rounded-xl">
              <Text className="text-white font-semibold">Tiếp tục</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity className="p-2 items-center" onPress={handleUndoPress}>
            <IconRollBack />
            <Text className="text-[#64748B] mt-1">Hoàn tác</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export default ChessExample
