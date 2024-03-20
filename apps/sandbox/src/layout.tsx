import { Link } from "@tanstack/react-router"
import { PropsWithChildren } from "react"
import { useDatabase } from "./data"

type Props = PropsWithChildren<{
  title?: string
}>

export const Layout = ({ title, children }: Props) => {
  const { user, signOut } = useDatabase()

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-row justify-between">
        <Link to="/">Home</Link>

        <button onClick={signOut}>Sign out</button>
      </div>
      {title && <h1 className="font-title text-5xl">{title}</h1>}
      <p>
        <span>User: {user}</span>
      </p>

      <div>{children}</div>
    </div>
  )
}
