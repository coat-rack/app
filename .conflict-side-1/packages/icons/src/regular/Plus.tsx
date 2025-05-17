import type { SVGProps } from "react"
const SvgPlus = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path d="M23 11v2H13v10h-2V13H1v-2h10V1h2v10z" />
  </svg>
)
export default SvgPlus
