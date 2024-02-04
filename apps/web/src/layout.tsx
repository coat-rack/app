import { PropsWithChildren } from "react"
import { useDatabase } from "./data"

type Props = PropsWithChildren<{
  title?: string
}>

export const Layout = ({ title, children }: Props) => {
  const { user, signOut } = useDatabase()

  return (
    <div className="flex flex-col gap-4 p-4">
      {title && <h1 className="font-title text-5xl">{title}</h1>}
      <div>
        <span>User: {user}</span>
        <button onClick={signOut}>Sign out</button>
      </div>

      <div>{children}</div>
    </div>
  )
}
