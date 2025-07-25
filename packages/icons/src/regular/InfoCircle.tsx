import type { SVGProps } from "react"
const SvgInfoCircle = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path d="M14 15v2h-4v-2h1v-5h-1V9h3v6zM11 6h2v2h-2z" />
    <path d="M22 9V7h-1V5h-1V4h-1V3h-2V2h-2V1H9v1H7v1H5v1H4v1H3v2H2v2H1v6h1v2h1v2h1v1h1v1h2v1h2v1h6v-1h2v-1h2v-1h1v-1h1v-2h1v-2h1V9zm-1 6h-1v2h-1v1h-1v1h-1v1h-2v1H9v-1H7v-1H6v-1H5v-1H4v-2H3V9h1V7h1V6h1V5h1V4h2V3h6v1h2v1h1v1h1v1h1v2h1z" />
    <path fill="none" d="M0 0h24v24H0z" />
  </svg>
)
export default SvgInfoCircle
