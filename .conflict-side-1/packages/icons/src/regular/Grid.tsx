import type { SVGProps } from "react"
const SvgGrid = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path d="M10 13H2v1H1v8h1v1h8v-1h1v-8h-1zm-1 8H3v-6h6zM10 2V1H2v1H1v8h1v1h8v-1h1V2zM3 9V3h6v6zM22 13h-8v1h-1v8h1v1h8v-1h1v-8h-1zm-1 8h-6v-6h6zM22 2V1h-8v1h-1v8h1v1h8v-1h1V2zm-1 7h-6V3h6z" />
  </svg>
)
export default SvgGrid
