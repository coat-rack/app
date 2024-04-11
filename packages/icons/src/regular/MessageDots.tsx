import type { SVGProps } from "react"
const SvgMessageDots = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path d="M19 9v2h-1v1h-2v-1h-1V9h1V8h2v1zM14 9v2h-1v1h-2v-1h-1V9h1V8h2v1zM9 9v2H8v1H6v-1H5V9h1V8h2v1z" />
    <path d="M22 2V1H2v1H1v16h1v1h6v4h1v-1h1v-1h1v-1h2v-1h9v-1h1V2zm-1 15H3V3h18z" />
  </svg>
)
export default SvgMessageDots
