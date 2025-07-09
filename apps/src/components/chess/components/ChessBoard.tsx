import React from 'react'
import { View } from 'react-native'
import ChessSquare from './ChessSquare'
import type { Square } from 'chess.js'

const files = 'abcdefgh'
const ranks = '87654321'

type Props = {
  board: (React.ReactNode | null)[][]
  selected: Square | null
  lastMove: { from: Square; to: Square } | null
  onPressSquare: (square: Square) => void
  disabled: boolean
  legalMoves: Square[]
}

const ChessBoard: React.FC<Props> = ({
  board,
  selected,
  lastMove,
  onPressSquare,
  disabled,
  legalMoves,
}) => (
  <View className="w-full aspect-square h-[400px]">
    {board.map((row, rowIndex) => (
      <View key={rowIndex} className="flex-row flex-1">
        {row.map((icon, colIndex) => {
          const square = (files[colIndex] + ranks[rowIndex]) as Square
          const isLight = (rowIndex + colIndex) % 2 === 0
          const base = 'flex-1 items-center justify-center'
          const colorClass = isLight ? 'bg-[#734DBE]' : 'bg-[#e2cbf7]'
          const selectedClass = selected === square ? 'border-2 border-yellow-400' : ''
          const lastClass =
            lastMove && (square === lastMove.from || square === lastMove.to)
              ? 'border-2 border-green-400'
              : ''
          const hintClass = legalMoves.includes(square) ? 'border-2 border-yellow-400' : ''
          const className = [base, colorClass, selectedClass, lastClass, hintClass]
            .filter(Boolean)
            .join(' ')
          return (
            <ChessSquare
              key={square}
              icon={icon}
              className={className}
              onPress={() => onPressSquare(square)}
              disabled={disabled}
            />
          )
        })}
      </View>
    ))}
  </View>
)

export default ChessBoard
