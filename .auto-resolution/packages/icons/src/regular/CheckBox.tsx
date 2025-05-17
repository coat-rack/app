import type { SVGProps } from "react"
const SvgCheckBox = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path d="M19 9v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-1v1h-2v-1H9v-1H8v-1H7v-1H6v-1H5v-1h1v-1h1V9h1v1h1v1h1v1h2v-1h1v-1h1V9h1V8h1V7h1v1h1v1z" />
    <path d="M22 2V1H2v1H1v20h1v1h20v-1h1V2zm-1 19H3V3h18z" />
  </svg>
)
export default SvgCheckBox
