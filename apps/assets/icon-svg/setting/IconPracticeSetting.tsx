import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const IconPracticeSetting = (props: SvgProps) => (
  <Svg
    width={20}
    height={20}
    fill="none"
    {...props}
  >
    <Path
      fill="#FF9800"
      d="M7.767 11.067h2.575v6c0 .883 1.1 1.3 1.683.633l6.309-7.167a.962.962 0 0 0-.725-1.6h-2.575v-6c0-.883-1.1-1.3-1.684-.633L7.042 9.467c-.542.625-.1 1.6.725 1.6ZM7.083 3.958H1.25a.63.63 0 0 1-.625-.625.63.63 0 0 1 .625-.625h5.833a.63.63 0 0 1 .625.625.63.63 0 0 1-.625.625ZM6.25 17.292h-5a.63.63 0 0 1-.625-.625.63.63 0 0 1 .625-.625h5a.63.63 0 0 1 .625.625.63.63 0 0 1-.625.625ZM3.75 10.625h-2.5A.63.63 0 0 1 .625 10a.63.63 0 0 1 .625-.625h2.5a.63.63 0 0 1 .625.625.63.63 0 0 1-.625.625Z"
    />
  </Svg>
)
export default IconPracticeSetting
