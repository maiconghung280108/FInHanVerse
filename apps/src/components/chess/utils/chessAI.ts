/*  ────────────────────────────────────────────────────────────────
    Optimised chess engine core – TypeScript 5.x
    Requires chess.js ≥ 1.1.0      (npm i chess.js)
   ──────────────────────────────────────────────────────────────── */
import { Chess, Move, Square } from 'chess.js'

/* ---------- 1. Piece values ---------- */
type PieceSymbol = 'p' | 'n' | 'b' | 'r' | 'q' | 'k'
const PIECE_VALUES = {
  p: 100,
  n: 320,
  b: 330,
  r: 500,
  q: 900,
  k: 20_000,
} as const

/* ---------- 2. Piece-square tables (flattened) ---------- */
const PAWN_TABLE = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [50, 50, 50, 50, 50, 50, 50, 50],
  [10, 10, 20, 30, 30, 20, 10, 10],
  [5, 5, 10, 25, 25, 10, 5, 5],
  [0, 0, 0, 20, 20, 0, 0, 0],
  [5, -5, -10, 0, 0, -10, -5, 5],
  [5, 10, 10, -20, -20, 10, 10, 5],
  [0, 0, 0, 0, 0, 0, 0, 0],
]
const KNIGHT_TABLE = [
  [-50, -40, -30, -30, -30, -30, -40, -50],
  [-40, -20, 0, 0, 0, 0, -20, -40],
  [-30, 0, 10, 15, 15, 10, 0, -30],
  [-30, 5, 15, 20, 20, 15, 5, -30],
  [-30, 0, 15, 20, 20, 15, 0, -30],
  [-30, 5, 10, 15, 15, 10, 5, -30],
  [-40, -20, 0, 5, 5, 0, -20, -40],
  [-50, -40, -30, -30, -30, -30, -40, -50],
]
const BISHOP_TABLE = [
  [-20, -10, -10, -10, -10, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 10, 10, 5, 0, -10],
  [-10, 5, 5, 10, 10, 5, 5, -10],
  [-10, 0, 10, 10, 10, 10, 0, -10],
  [-10, 10, 10, 10, 10, 10, 10, -10],
  [-10, 5, 0, 0, 0, 0, 5, -10],
  [-20, -10, -10, -10, -10, -10, -10, -20],
]
const ROOK_TABLE = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [5, 10, 10, 10, 10, 10, 10, 5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [-5, 0, 0, 0, 0, 0, 0, -5],
  [0, 0, 0, 5, 5, 0, 0, 0],
]
const QUEEN_TABLE = [
  [-20, -10, -10, -5, -5, -10, -10, -20],
  [-10, 0, 0, 0, 0, 0, 0, -10],
  [-10, 0, 5, 5, 5, 5, 0, -10],
  [-5, 0, 5, 5, 5, 5, 0, -5],
  [0, 0, 5, 5, 5, 5, 0, -5],
  [-10, 5, 5, 5, 5, 5, 0, -10],
  [-10, 0, 5, 0, 0, 0, 0, -10],
  [-20, -10, -10, -5, -5, -10, -10, -20],
]
const KING_TABLE = [
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-30, -40, -40, -50, -50, -40, -40, -30],
  [-20, -30, -30, -40, -40, -30, -30, -20],
  [-10, -20, -20, -20, -20, -20, -20, -10],
  [20, 20, 0, 0, 0, 0, 20, 20],
  [20, 30, 10, 0, 0, 10, 30, 20],
]

function flatten(tbl: number[][]): Int16Array {
  return new Int16Array(tbl.flat())
}
const PST: Record<PieceSymbol, Int16Array> = {
  p: flatten(PAWN_TABLE),
  n: flatten(KNIGHT_TABLE),
  b: flatten(BISHOP_TABLE),
  r: flatten(ROOK_TABLE),
  q: flatten(QUEEN_TABLE),
  k: flatten(KING_TABLE),
}
/* bảng mirror cho quân đen  */
const MIRROR_64 = new Uint8Array(
  Array.from({ length: 64 }, (_, sq) => 56 + (sq & 7) - ((sq >> 3) << 3)),
)

/* ---------- 3. Opening book (như bản gốc, rút gọn) ---------- */
type OpeningMove = { from: string; to: string }
type OpeningVariation = { moves: OpeningMove[]; score: number }
type Opening = {
  name: string
  moves: OpeningMove[]
  score: number
  variations?: OpeningVariation[]
}

const OPENING_BOOK: Opening[] = [
  {
    name: 'Ruy Lopez',
    moves: [
      { from: 'e2', to: 'e4' },
      { from: 'e7', to: 'e5' },
      { from: 'g1', to: 'f3' },
      { from: 'b8', to: 'c6' },
      { from: 'f1', to: 'b5' },
    ],
    score: 10,
    variations: [
      {
        moves: [
          { from: 'a7', to: 'a6' },
          { from: 'b5', to: 'a4' },
          { from: 'g8', to: 'f6' },
          { from: 'e1', to: 'g1' },
        ],
        score: 8,
      },
    ],
  },
  {
    name: 'Sicilian Defense',
    moves: [
      { from: 'e2', to: 'e4' },
      { from: 'c7', to: 'c5' },
    ],
    score: 7,
  },
  {
    name: "Queen's Gambit",
    moves: [
      { from: 'd2', to: 'd4' },
      { from: 'd7', to: 'd5' },
      { from: 'c2', to: 'c4' },
    ],
    score: 8,
  },
]

/* ---------- 4.  Transposition table ---------- */
interface TTEntry {
  depth: number
  score: number
  flag: 0 | 1 | 2 // EXACT=0, LOWER=1, UPPER=2
  mv: Move | null
}
const TT = new Map<string, TTEntry>() // dùng FEN làm khoá (đơn giản)

/* ---------- 5.  Tiện ích ---------- */
function sqToIndex(sq: Square): number {
  return (8 - parseInt(sq[1])) * 8 + (sq.charCodeAt(0) - 97)
}
function sign(color: 'w' | 'b'): 1 | -1 {
  return color === 'w' ? 1 : -1
}

/* ======================================================================
                               6.  ChessAI
      ====================================================================== */
export class ChessAI {
  private game: Chess
  private maxDepth: number
  private timeLimit: number
  private startTime = 0
  private nodes = 0

  /* incremental score & helpers */
  private curScore = 0

  /* killer moves, history heuristics (nhỏ gọn) */
  private killer: Move[][] = Array.from({ length: 32 }, () => [])
  private history = new Map<string, number>()

  constructor(game: Chess, maxDepth = 4, timeLimit = 2000) {
    this.game = game
    this.maxDepth = maxDepth
    this.timeLimit = timeLimit
    this.curScore = this.staticEval() // khởi tạo
  }

  /* ---------- 6.1  Đánh giá tĩnh (quét 1 lần) ---------- */
  private staticEval(): number {
    let sc = 0
    const board = this.game.board()
    for (let r = 0; r < 8; r++) {
      for (let f = 0; f < 8; f++) {
        const p = board[r][f]
        if (!p) continue
        const idx = r * 8 + f
        const pstVal = PST[p.type as PieceSymbol][p.color === 'w' ? idx : MIRROR_64[idx]]
        sc += sign(p.color) * (PIECE_VALUES[p.type as PieceSymbol] + pstVal)
      }
    }
    return sc
  }

  /* ---------- 6.2  apply / undo incremental ---------- */
  private applyMove(m: Move): number {
    const piece = this.game.get(m.from)!
    const colSign = sign(piece.color)
    let delta = 0

    /* material & PST của quân di chuyển */
    const fromIdx = sqToIndex(m.from)
    const toIdx = sqToIndex(m.to)
    delta +=
      colSign *
      (PST[piece.type as PieceSymbol][piece.color === 'w' ? toIdx : MIRROR_64[toIdx]] -
        PST[piece.type as PieceSymbol][piece.color === 'w' ? fromIdx : MIRROR_64[fromIdx]])

    /* capture */
    if (m.captured) {
      const capVal = PIECE_VALUES[m.captured as PieceSymbol]
      const capIdx = m.flags.includes('e') // en-passant
        ? sqToIndex((m.to[0] + (piece.color === 'w' ? '5' : '4')) as Square)
        : toIdx
      const pstCap =
        PST[m.captured as PieceSymbol][piece.color === 'w' ? MIRROR_64[capIdx] : capIdx]
      delta += colSign * (capVal + pstCap) // cộng vì delta theo chiều quân di chuyển
    }

    /* promotion */
    if (m.promotion) {
      const promVal = PIECE_VALUES[m.promotion as PieceSymbol]
      const pstProm =
        PST[m.promotion as PieceSymbol][piece.color === 'w' ? toIdx : MIRROR_64[toIdx]]
      const pawnVal = PIECE_VALUES.p
      const pstPawn = PST.p[piece.color === 'w' ? toIdx : MIRROR_64[toIdx]]
      delta += colSign * (promVal + pstProm - (pawnVal + pstPawn))
    }

    /* castling – tính rook */
    if (m.flags.includes('k') || m.flags.includes('q')) {
      const rookFrom = m.flags.includes('k')
        ? piece.color === 'w'
          ? 'h1'
          : 'h8'
        : piece.color === 'w'
          ? 'a1'
          : 'a8'
      const rookTo = m.flags.includes('k')
        ? piece.color === 'w'
          ? 'f1'
          : 'f8'
        : piece.color === 'w'
          ? 'd1'
          : 'd8'
      const rfIdx = sqToIndex(rookFrom as Square)
      const rtIdx = sqToIndex(rookTo as Square)
      delta +=
        colSign *
        (PST.r[piece.color === 'w' ? rtIdx : MIRROR_64[rtIdx]] -
          PST.r[piece.color === 'w' ? rfIdx : MIRROR_64[rfIdx]])
    }

    this.curScore += delta
    return delta
  }
  private undoMove(delta: number) {
    this.curScore -= delta
  }

  /* ---------- 6.3  Quiescence search ---------- */
  private qSearch(alpha: number, beta: number): number {
    const stand = this.curScore
    if (stand >= beta) return beta
    if (stand > alpha) alpha = stand

    const caps = (this.game.moves({ verbose: true }) as Move[]).filter((m) => m.captured)
    caps.sort(
      (a, b) => PIECE_VALUES[b.captured as PieceSymbol] - PIECE_VALUES[a.captured as PieceSymbol],
    )

    for (const m of caps) {
      const delta = this.applyMove(m)
      this.game.move(m)
      const score = -this.qSearch(-beta, -alpha)
      this.game.undo()
      this.undoMove(delta)

      if (Date.now() - this.startTime > this.timeLimit) break

      if (score >= beta) return beta
      if (score > alpha) alpha = score
    }
    return alpha
  }

  /* ---------- 6.4  PVS (α-β) ---------- */
  private pvs(depth: number, alpha: number, beta: number, ply: number): number {
    /* thời gian */
    if (Date.now() - this.startTime > this.timeLimit) return alpha
    this.nodes++

    if (depth === 0) return this.qSearch(alpha, beta)

    const fen = this.game.fen()
    const tt = TT.get(fen)
    if (tt && tt.depth >= depth) {
      if (tt.flag === 0) return tt.score
      if (tt.flag === 1 && tt.score > alpha)
        alpha = tt.score // LOWER
      else if (tt.flag === 2 && tt.score < beta) beta = tt.score // UPPER
      if (alpha >= beta) return tt.score
    }

    /* generate & order */
    const moves = this.orderMoves(this.game.moves({ verbose: true }) as Move[], depth, tt?.mv)

    let bestMove: Move | null = null
    let score = -Infinity
    for (const m of moves) {
      const delta = this.applyMove(m)
      this.game.move(m)

      let val: number
      if (bestMove) {
        /* late moves – try zero window */
        val = -this.pvs(depth - 1, -alpha - 1, -alpha, ply + 1)
        if (val > alpha && val < beta) {
          // re-search full window
          val = -this.pvs(depth - 1, -beta, -alpha, ply + 1)
        }
      } else {
        val = -this.pvs(depth - 1, -beta, -alpha, ply + 1)
      }

      this.game.undo()
      this.undoMove(delta)

      if (val > score) {
        score = val
        bestMove = m
        if (val > alpha) alpha = val
        if (val >= beta) {
          /* killer & history */
          if (!m.captured && !m.promotion) {
            this.killer[ply].unshift(m)
            if (this.killer[ply].length > 2) this.killer[ply].pop()
          }
          break
        }
      }
    }

    /* store to TT */
    const flag: 0 | 1 | 2 = score <= alpha ? 2 : score >= beta ? 1 : 0 // UPPER / LOWER / EXACT
    TT.set(fen, { depth, score, flag, mv: bestMove })

    return score
  }

  /* ---------- 6.5  Sắp xếp nước đi ---------- */
  private orderMoves(moves: Move[], depth: number, ttMove?: Move | null): Move[] {
    const killers = this.killer[depth]
    const hist = this.history
    return moves
      .map((m) => {
        let s = 0
        if (ttMove && m.from === ttMove.from && m.to === ttMove.to) s += 1_000_000
        if (m.captured) {
          s +=
            100_000 +
            (PIECE_VALUES[m.captured as PieceSymbol] << 4) -
            PIECE_VALUES[m.piece as PieceSymbol]
        }
        if (killers.find((k) => k.from === m.from && k.to === m.to)) s += 50_000
        s += hist.get(m.from + m.to) || 0
        return { m, s }
      })
      .sort((a, b) => b.s - a.s)
      .map((o) => o.m)
  }

  /* ---------- 6.6  Opening book ---------- */
  private bookMove(): Move | null {
    const history = this.game.history({ verbose: true }) as Move[]
    for (const opening of OPENING_BOOK) {
      if (history.length >= opening.moves.length) continue
      const next = opening.moves[history.length]
      const legal = this.game.moves({ verbose: true }) as Move[]
      const match = legal.find((l) => l.from === next.from && l.to === next.to)
      if (match) return match
    }
    return null
  }

  /* ---------- 6.7  Public API ---------- */
  public findBestMove(): Move {
    /* opening */
    const bk = this.bookMove()
    if (bk) return bk

    this.startTime = Date.now()
    this.nodes = 0

    let best: Move | null = null
    for (let d = 1; d <= this.maxDepth; d++) {
      const alpha = -Infinity
      const beta = Infinity
      this.pvs(d, alpha, beta, 0)
      const tt = TT.get(this.game.fen())
      if (tt?.mv) best = tt.mv
      if (Date.now() - this.startTime > this.timeLimit) break
    }

    if (!best) {
      /* fallback random */
      const legal = this.game.moves({ verbose: true }) as Move[]
      best = legal[Math.floor(Math.random() * legal.length)]
    }

    /* update history heuristic */
    if (best) {
      const key = best.from + best.to
      this.history.set(key, (this.history.get(key) || 0) + 1)
    }

    return best!
  }

  public getNodes(): number {
    return this.nodes
  }
}
