import type { SVGProps } from "react"
const SvgDivider = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path d="M3 6h18v1H3zM1 11h22v2H1zM3 17h18v1H3z" />
  </svg>
)
export default SvgDivider
