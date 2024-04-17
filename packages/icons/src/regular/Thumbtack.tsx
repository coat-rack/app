import type { SVGProps } from "react"
const SvgThumbtack = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path d="M18 13v-1h-1v-1h-1V4h2V2h-1V1H7v1H6v2h2v7H7v1H6v1H5v2h1v1h5v7h2v-7h5v-1h1v-2zM9 3h6v1h-1v8h1v1h1v1H8v-1h1v-1h1V4H9z" />
  </svg>
)
export default SvgThumbtack
