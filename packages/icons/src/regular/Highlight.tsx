import type { SVGProps } from "react"
const SvgHighlight = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path d="M21 1v8H11V1H9v10h1v2h1v2h1v6H1v2h19v-8h1v-2h1v-2h1V1zm-3 20h-4v-4h4zm2-8h-1v2h-6v-2h-1v-2h8z" />
  </svg>
)
export default SvgHighlight
