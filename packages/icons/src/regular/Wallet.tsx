import type { SVGProps } from "react"
const SvgWallet = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path d="M18 12v1h1v2h-1v1h-2v-1h-1v-2h1v-1z" />
    <path d="M23 8v13h-1v1H2v-1H1V3h1V2h19v1h1v1H3v16h18V9H5V7h17v1z" />
  </svg>
)
export default SvgWallet
