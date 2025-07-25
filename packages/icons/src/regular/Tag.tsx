import type { SVGProps } from "react"
const SvgTag = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path d="M8 5v2H7v1H5V7H4V5h1V4h2v1z" />
    <path d="M22 13v-1h-1v-1h-1v-1h-1V9h-1V8h-1V7h-1V6h-1V5h-1V4h-1V3h-1V2h-1V1H2v1H1v9h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h2v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-1h1v-2zM3 3h7v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v1h1v2h-1v1h-1v1h-1v1h-1v1h-1v1h-2v-1h-1v-1h-1v-1h-1v-1H9v-1H8v-1H7v-1H6v-1H5v-1H4v-1H3z" />
  </svg>
)
export default SvgTag
