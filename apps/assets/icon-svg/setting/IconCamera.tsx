import * as React from "react"
import Svg, { SvgProps, Rect, Path } from "react-native-svg"
const IconCamera = (props: SvgProps) => (
  <Svg
    width={40}
    height={40}
    fill="none"
    {...props}
  >
    <Rect width={40} height={40} fill="#CBD5E1" rx={20} />
    <Path
      fill="#64748B"
      d="M14.76 30h10.48c2.76 0 3.86-1.69 3.99-3.75l.52-8.26A3.753 3.753 0 0 0 26 14c-.61 0-1.17-.35-1.45-.89l-.72-1.45c-.46-.91-1.66-1.66-2.68-1.66h-2.29c-1.03 0-2.23.75-2.69 1.66l-.72 1.45c-.28.54-.84.89-1.45.89-2.17 0-3.89 1.83-3.75 3.99l.52 8.26C10.89 28.31 12 30 14.76 30Z"
      opacity={0.4}
    />
    <Path
      fill="#64748B"
      d="M21.5 16.75h-3c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h3c.41 0 .75.34.75.75s-.34.75-.75.75ZM20 26.13a3.38 3.38 0 1 0 0-6.76 3.38 3.38 0 0 0 0 6.76Z"
    />
  </Svg>
)
export default IconCamera
