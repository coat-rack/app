import type { SVGProps } from "react"
const SvgParagraph = (props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" {...props}>
    <path d="M7 1v1H5v1H4v1H3v2H2v6h1v2h1v1h1v1h2v1h4v6h2V3h3v20h2V3h4V1zm4 14H7v-1H5v-2H4V6h1V4h2V3h4z" />
  </svg>
)
export default SvgParagraph
