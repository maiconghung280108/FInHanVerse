import * as React from "react";
import {SVGProps} from "react";

function IconClose(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={18}
      height={18}
      fill="none"
      {...props}
    >
      <path
        fill="#637381"
        d="M9 1.5C4.867 1.5 1.5 4.867 1.5 9s3.367 7.5 7.5 7.5 7.5-3.367 7.5-7.5S13.133 1.5 9 1.5Zm2.52 9.225a.566.566 0 0 1 0 .795.556.556 0 0 1-.397.165.556.556 0 0 1-.398-.165L9 9.795 7.275 11.52a.556.556 0 0 1-.397.165.556.556 0 0 1-.398-.165.566.566 0 0 1 0-.795L8.205 9 6.48 7.275a.566.566 0 0 1 0-.795.566.566 0 0 1 .795 0L9 8.205l1.725-1.725a.566.566 0 0 1 .795 0 .566.566 0 0 1 0 .795L9.795 9l1.725 1.725Z"
      />
    </svg>
  );
}
export default IconClose;
