import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"
const IconHome = (props: SvgProps) => (
  <Svg
    width={25}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      fill="#64748B"
      d="m21.455 8.01-6.55-5.24c-1.28-1.02-3.28-1.03-4.55-.01l-6.55 5.25c-.94.75-1.51 2.25-1.31 3.43l1.26 7.54c.29 1.69 1.86 3.02 3.57 3.02h10.6c1.69 0 3.29-1.36 3.58-3.03l1.26-7.54c.18-1.17-.39-2.67-1.31-3.42Z"
      opacity={0.4}
    />
    <Path
      fill="#64748B"
      d="M12.625 18.75c-.41 0-.75-.34-.75-.75v-3c0-.41.34-.75.75-.75s.75.34.75.75v3c0 .41-.34.75-.75.75Z"
    />
  </Svg>
)
export default IconHome
