import * as React from "react"
import Svg, { SvgProps, Rect, G, Path, Defs, ClipPath } from "react-native-svg"
const IconCheckLesson = (props: SvgProps) => (
  <Svg
    width={48}
    height={48}
    fill="none"
    {...props}
  >
    <Rect width={48} height={48} fill="#fff" rx={24} />
    <G fill="#21C45D" stroke="#21C45D" clipPath="url(#a)">
      <Path d="M24 13.75c5.654 0 10.25 4.596 10.25 10.25S29.654 34.25 24 34.25 13.75 29.654 13.75 24 18.346 13.75 24 13.75Zm0 .5c-5.376 0-9.75 4.374-9.75 9.75s4.374 9.75 9.75 9.75 9.75-4.374 9.75-9.75-4.374-9.75-9.75-9.75Z" />
      <Path d="M28.074 20.984a.254.254 0 0 1 .352 0 .256.256 0 0 1 .032.314l-.032.038-5.67 5.67a.25.25 0 0 1-.176.075.249.249 0 0 1-.138-.043l-.038-.032-2.83-2.83a.254.254 0 0 1 0-.352.256.256 0 0 1 .314-.032l.038.032 2.654 2.653.353-.354 5.14-5.14Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path fill="#fff" d="M12 12h24v24H12z" />
      </ClipPath>
    </Defs>
  </Svg>
)
export default IconCheckLesson
