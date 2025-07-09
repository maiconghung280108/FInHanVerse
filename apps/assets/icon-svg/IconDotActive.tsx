import * as React from "react"
import Svg, { SvgProps, Rect } from "react-native-svg"
const IconDotActive = (props: SvgProps) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={19}
    height={8}
    fill="none"
    {...props}
  >
    <Rect width={18} height={8} x={0.5} fill="#fff" rx={4} />
  </Svg>
)
export default IconDotActive
