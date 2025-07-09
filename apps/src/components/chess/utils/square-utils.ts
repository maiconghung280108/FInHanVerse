// Chuyển row, col ↔ Square ("e4")
export const files = 'abcdefgh'
export const ranks = '87654321'

export function toSquare(row: number, col: number): `${string}${string}` {
  return (files[col] + ranks[row]) as `${string}${string}`
}

export function fromSquare(square: string): { row: number; col: number } {
  const col = files.indexOf(square[0])
  const row = ranks.indexOf(square[1])
  return { row, col }
}
