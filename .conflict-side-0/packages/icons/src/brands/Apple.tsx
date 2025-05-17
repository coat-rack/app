import type { SVGProps } from "react"
const SvgApple = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <path
      fill="#000"
      d="M15 1v3h-1v1h-1v1h-2V3h1V2h1V1zM21 17v1h-1v2h-1v1h-1v1h-1v1h-2v-1h-5v1H8v-1H7v-1H6v-1H5v-1H4v-2H3v-7h1V8h1V7h2V6h3v1h4V6h3v1h2v1h1v1h-1v1h-1v5h1v1h1v1z"
    />
  </svg>
)
export default SvgApple
