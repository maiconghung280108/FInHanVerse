// src/hooks/useChessAI.ts
import { useRef, useEffect, useCallback } from 'react'
import { Chess, Move } from 'chess.js'
import { ChessAI } from '../utils/chessAI'

interface AIConfig {
  maxDepth: number
  timeLimit: number
  nodeLimit: number
}
/**
 * Hook tạo và cung cấp hàm makeAIMove. Mỗi khi `difficulty` hoặc ván cờ được reset,
 * ta tạo mới ChessAI để maxDepth luôn đồng bộ.
 */
// map difficulty level (1–5) → config
const DIFFICULTY_MAP: Record<number, AIConfig> = {
  1: { maxDepth: 2, timeLimit: 100, nodeLimit: 5000 },
  2: { maxDepth: 3, timeLimit: 300, nodeLimit: 10000 },
  3: { maxDepth: 4, timeLimit: 1000, nodeLimit: 50000 },
  4: { maxDepth: 5, timeLimit: 2000, nodeLimit: 100000 },
  5: { maxDepth: 6, timeLimit: 4000, nodeLimit: 200000 },
}

export function useChessAI(gameRef: React.RefObject<Chess>, difficulty: number) {
  const aiRef = useRef<ChessAI | null>(null)

  // Khi difficulty thay đổi, hoặc gameRef.current được reset (ví dụ fen về khởi đầu),
  // tạo lại instance ChessAI với độ sâu mới
  useEffect(() => {
    const cfg = DIFFICULTY_MAP[difficulty] || DIFFICULTY_MAP[3]
    aiRef.current = new ChessAI(gameRef.current!, cfg.maxDepth, cfg.timeLimit, cfg.nodeLimit)
  }, [difficulty, gameRef])

  const makeAIMove = useCallback(async (): Promise<Move | null> => {
    if (!aiRef.current) return null
    return new Promise((resolve) => {
      setTimeout(() => {
        try {
          const best = aiRef.current!.findBestMove()
          resolve(best)
        } catch {
          // khi không còn nước → trả null
          resolve(null)
        }
      }, 0)
    })
  }, [])

  return { makeAIMove }
}
