import { Button } from "@repo/ui/components/button"
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
  <div
    className="relative grid h-screen w-screen"
    style={{
      gridTemplateRows: "auto 1fr",
      gridTemplateColumns: "auto 1fr",
    }}
  >
    <nav className="col-span-2 row-auto flex flex-row justify-between bg-white p-2">
      <div>{title}</div>
      <Button variant="ghost" size="sm" onClick={signOut}>
        sign out
      </Button>
    </nav>
    <nav
      className="col-span-1 flex flex-1 rotate-180 justify-between gap-4 bg-white"
      style={{
        writingMode: "vertical-rl",
      }}
    >
      {Links}
    </nav>

    <main>{children}</main>
  </div>
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
          <Button asChild variant="link" size="sm">
            <Link to="/">Home</Link>
          </Button>
          {apps?.map((app) => (
            <Button asChild variant="link" size="sm">
              <Link
                key={app.id}
                to="/apps/$id"
                params={{
                  id: app.id,
                }}
              >
                {app.id}
              </Link>
            </Button>
          ))}
        </>
      }
    >
      {children}
    </Navigation>
  )
}
