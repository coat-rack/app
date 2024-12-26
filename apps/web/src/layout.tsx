import { HomeSolid, OctagonTimesSolid } from "@repo/icons/solid"
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
    <nav className="bg-background col-span-2 row-auto flex flex-row justify-between p-2 pl-0">
      <Button asChild variant="link" size="sm">
        <Link
          to="/"
          activeProps={{
            className: "text-primary",
          }}
          title="Home"
        >
          <HomeSolid className="h-4 w-4 fill-current" />
        </Link>
      </Button>
      <div>{title}</div>
      <Button
        variant="ghost"
        size="sm"
        className="align-center flex flex-row gap-2"
        onClick={signOut}
        title="Sign out"
      >
        sign out
        <OctagonTimesSolid className="h-4 w-4 fill-current" />
      </Button>
    </nav>
    <nav
      className="bg-background col-span-1 pb-4"
      style={{
        writingMode: "vertical-rl",
      }}
    >
      <div className="flex flex-1 rotate-180 justify-between gap-4">
        {Links}
      </div>
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
      Links={apps?.map((app) => (
        <Button asChild variant="link" size="sm" key={app.id}>
          <Link
            to="/apps/$id"
            className="block"
            activeProps={{
              className: "underline",
            }}
            params={{
              id: app.id,
            }}
          >
            {app.id}
          </Link>
        </Button>
      ))}
    >
      {children}
    </Navigation>
  )
}
