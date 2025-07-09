import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const IconArrowRight = (props: SvgProps) => (
  <Svg
    width={40}
    height={40}
    fill="none"
    {...props}
  >
    <Path
      fill="#64748B"
      fillOpacity={0.08}
      d="M0 20C0 8.954 8.954 0 20 0s20 8.954 20 20-8.954 20-20 20S0 31.046 0 20Z"
    />
    <Path
      fill="#fff"
      d="M6 20c0-7.732 6.268-14 14-14s14 6.268 14 14-6.268 14-14 14S6 27.732 6 20Z"
    />
    <Path
      stroke="#1E293B"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="m17.683 25.94 4.89-4.89a1.49 1.49 0 0 0 0-2.1l-4.89-4.89"
    />
  </Svg>
)
export default IconArrowRight
