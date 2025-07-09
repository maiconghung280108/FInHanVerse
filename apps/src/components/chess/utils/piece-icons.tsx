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

const PIECES_MAP = {
  p: <IconTotDen />,
  n: <IconMaDen />,
  b: <IconTuongDen />,
  r: <IconXeDen />,
  q: <IconHauDen />,
  k: <IconVuaDen />,
  P: <IconTot />,
  N: <IconMa />,
  B: <IconTuong />,
  R: <IconXe />,
  Q: <IconHau />,
  K: <IconVua />,
}

export function getPieceIcon(piece: { type: string; color: string } | null) {
  if (!piece) return null
  const key = piece.color === 'w' ? piece.type.toUpperCase() : piece.type.toLowerCase()
  return PIECES_MAP[key as keyof typeof PIECES_MAP] || null
}
