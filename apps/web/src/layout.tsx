import { Link } from "@tanstack/react-router"
import { PropsWithChildren } from "react"
import { useObservable } from "./async"
import { useDatabase } from "./data"

type Props = PropsWithChildren<{
  title?: string
}>

const Navigation = ({
  signOut,
  title = "",
  Links,
  children,
}: React.PropsWithChildren<{
  Links?: React.ReactNode
  signOut: () => void
  title?: string
}>) => (
  <nav
    className="grid h-screen w-screen"
    style={{
      gridTemplateRows: "auto 1fr",
      gridTemplateColumns: "auto 1fr",
    }}
  >
    <section className="col-span-2 row-auto flex flex-row justify-between bg-white p-2">
      <div>{title}</div>
      <button onClick={signOut}>Sign Out</button>
    </section>
    <section
      className="col-span-1 flex flex-1 rotate-180 justify-between gap-4 bg-white"
      style={{
        writingMode: "vertical-rl",
      }}
    >
      {Links}
    </section>

    <div>{children}</div>
  </nav>
)

export const Layout = ({ title, children }: Props) => {
  const { signOut, db } = useDatabase()
  const apps = useObservable(db.apps.find({}).$)

  return (
    <Navigation
      signOut={signOut}
      title={title}
      Links={
        <>
          <Link to="/">Home</Link>
          {apps?.map((app) => (
            <Link
              key={app.id}
              to="/apps/$id"
              params={{
                id: app.id,
              }}
            >
              {app.id}
            </Link>
          ))}
        </>
      }
    >
      {children}
    </Navigation>
  )
}
