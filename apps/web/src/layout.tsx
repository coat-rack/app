import { PropsWithChildren } from "react"

type Props = PropsWithChildren<{
  title: string
}>

export const Layout = ({ title, children }: Props) => (
  <div className="flex flex-col gap-4">
    <h1 className="font-title text-5xl">{title}</h1>
    <div>{children}</div>
  </div>
)
