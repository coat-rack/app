import type { SVGProps } from "react"
const SvgExpand = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path d="M9 1v2H3v6H1V2h1V1zM9 21v2H2v-1H1v-7h2v6zM23 15v7h-1v1h-7v-2h6v-6zM23 2v7h-2V3h-6V1h7v1z" />
  </svg>
)
export default SvgExpand
