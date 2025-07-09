// src/hooks/useChessGame.ts
import { useRef, useState, useCallback } from 'react'
import { Chess, Move, Square } from 'chess.js'

export enum GameStateStatus {
  PLAYING = 'Đang chơi',
  BLACK_WIN = 'Đen thắng',
  WHITE_WIN = 'Trắng thắng',
  DRAW = 'Hòa',
  BLACK_CHECK = 'Đen chiếu',
  WHITE_CHECK = 'Trắng chiếu',
}

export type GameState = {
  fen: string
  selected: string | null
  lastMove: { from: string; to: string } | null
  status: GameStateStatus
  turn: 'w' | 'b'
  isPlayerTurn: boolean
  difficulty: number
  legalMoves: Square[]
}

export function useChessGame() {
  const gameRef = useRef<Chess>(new Chess())

  const [fen, setFen] = useState<string>(gameRef.current.fen())
  const [selected, setSelected] = useState<string | null>(null)
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null)
  const [status, setStatus] = useState<GameStateStatus>(GameStateStatus.PLAYING)
  const [turn, setTurn] = useState<'w' | 'b'>('w')
  const [isPlayerTurn, setIsPlayerTurn] = useState<boolean>(true)
  const [difficulty, setDifficulty] = useState<number>(3)

  const [legalMoves, setLegalMoves] = useState<Square[]>([])

  const resetGame = useCallback(() => {
    const game = gameRef.current
    game.reset()
    setFen(game.fen())
    setSelected(null)
    setLastMove(null)
    setStatus(GameStateStatus.PLAYING)
    setTurn('w')
    setIsPlayerTurn(true)
    setLegalMoves([])
  }, [])

  const selectSquare = useCallback(
    (square: Square) => {
      if (
        status === GameStateStatus.BLACK_WIN ||
        status === GameStateStatus.WHITE_WIN ||
        status === GameStateStatus.DRAW ||
        !isPlayerTurn
      )
        return
      if (square === selected) {
        setSelected(null)
        setLegalMoves([])
      } else {
        // chỉ chọn quân của bên trắng (ví dụ)
        const piece = gameRef.current.get(square)
        if (!piece || piece.color !== 'w') return

        // compute legal moves from this square
        const moves = gameRef.current.moves({ square, verbose: true })
        setLegalMoves(moves.map((m) => m.to as Square))

        setSelected(square)
      }
    },
    [status, isPlayerTurn, selected],
  )

  const playerMove = useCallback(
    (to: Square) => {
      if (!selected) return
      const game = gameRef.current

      // Nếu cùng ô, chỉ bỏ chọn và return
      // nếu click vào ô hợp lệ
      if (!legalMoves.includes(to)) {
        // không hợp lệ → bỏ chọn
        setSelected(null)
        setLegalMoves([])
        return
      }

      try {
        const move = game.move({ from: selected, to, promotion: 'q' })
        if (move) {
          setFen(game.fen())
          setLastMove({ from: move.from, to: move.to })
          setSelected(null)
          setLegalMoves([])
          setTurn('b')
          setIsPlayerTurn(false)
        }
      } catch (err) {
        console.warn('Invalid move caught:', err)
        setSelected(null)
      }
    },
    [selected],
  )

  const aiMove = useCallback((move: Move) => {
    const game = gameRef.current
    // Re-apply nước đi của AI lên game gốc:
    const applied = game.move({
      from: move.from,
      to: move.to,
      // Move.promotion có thể undefined nếu không phải promotion
      promotion: (move as any).promotion ?? undefined,
    })
    if (!applied) {
      console.warn('AI tried invalid move:', move)
      return
    }
    // sau đó cập nhật state từ gameRef
    setFen(game.fen())
    setLastMove({ from: move.from, to: move.to })
    const nextTurn = game.turn()
    setTurn(nextTurn)
    setIsPlayerTurn(nextTurn === 'w')
    setLegalMoves([])
  }, [])

  const loadPosition = useCallback((fen: string) => {
    const game = gameRef.current
    game.load(fen) // nạp position mới
    setFen(fen) // cập nhật UI
    setSelected(null)
    setLastMove(null)
    setTurn('w')
    setIsPlayerTurn(true)
    setStatus(GameStateStatus.PLAYING)
  }, [])

  return {
    // trạng thái
    state: {
      fen,
      selected,
      lastMove,
      status,
      turn,
      isPlayerTurn,
      difficulty,
      legalMoves,
    } as GameState,

    // refs
    gameRef,

    // actions
    resetGame,
    selectSquare,
    playerMove,
    aiMove,
    setStatus,
    setDifficulty,
    loadPosition,
  }
}
