import { PropsWithChildren } from "react"

export const Layout: React.ComponentType<PropsWithChildren> = ({
  children,
}) => <main>{children}</main>
