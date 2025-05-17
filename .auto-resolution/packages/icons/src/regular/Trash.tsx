import type { SVGProps } from "react"
const SvgTrash = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path d="M4 6v8h1v8h1v1h12v-1h1v-8h1V6zm14 7h-1v8H7v-8H6V8h12zM21 3v2H3V3h1V2h5V1h6v1h5v1z" />
  </svg>
)
export default SvgTrash
