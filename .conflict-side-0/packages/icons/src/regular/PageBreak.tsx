import type { SVGProps } from "react"
const SvgPageBreak = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path d="M3 8V1h2v5h14V1h2v7zM1 11h5v2H1zM10 11h4v2h-4zM21 16v7h-2v-5H5v5H3v-7zM18 11h5v2h-5z" />
  </svg>
)
export default SvgPageBreak
