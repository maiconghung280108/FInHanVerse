import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const IconCheckActive = (props: SvgProps) => (
  <Svg
    width={32}
    height={32}
    fill="none"
    {...props}
  >
    <Path
      fill="#734DBE"
      fillRule="evenodd"
      d="M11.833 7.667a4.167 4.167 0 0 0-4.166 4.166v8.334a4.167 4.167 0 0 0 4.166 4.166h8.334a4.167 4.167 0 0 0 4.166-4.166v-8.334a4.167 4.167 0 0 0-4.166-4.166h-8.334Zm4.054 11.037 3.959-3.958a.734.734 0 0 0 0-1.034.734.734 0 0 0-1.034 0l-3.441 3.442-1.459-1.458a.734.734 0 0 0-1.033 0 .734.734 0 0 0 0 1.033l1.984 1.975a.712.712 0 0 0 .508.209.717.717 0 0 0 .516-.209Z"
      clipRule="evenodd"
    />
  </Svg>
)
export default IconCheckActive
