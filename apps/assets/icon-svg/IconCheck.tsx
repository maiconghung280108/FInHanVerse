import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const IconCheck = (props: SvgProps) => (
  <Svg
    width={32}
    height={32}
    fill="none"
    {...props}
  >
    <Path
      fill="#64748B"
      fillRule="evenodd"
      d="M11.833 7.667a4.167 4.167 0 0 0-4.166 4.166v8.334a4.167 4.167 0 0 0 4.166 4.166h8.334a4.167 4.167 0 0 0 4.166-4.166v-8.334a4.167 4.167 0 0 0-4.166-4.166h-8.334Zm.417 1.25a3.333 3.333 0 0 0-3.333 3.333v7.5a3.333 3.333 0 0 0 3.333 3.333h7.5a3.333 3.333 0 0 0 3.333-3.333v-7.5a3.333 3.333 0 0 0-3.333-3.333h-7.5Z"
      clipRule="evenodd"
    />
  </Svg>
)
export default IconCheck
