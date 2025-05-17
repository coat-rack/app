import type { SVGProps } from "react"
const SvgStrikeThrough = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path d="M2 11h20v2H2zM19 2v1H9v1H8v5H6V3h1V2h1V1h10v1zM18 15v6h-1v1h-1v1H6v-1H5v-1h10v-1h1v-5z" />
  </svg>
)
export default SvgStrikeThrough
