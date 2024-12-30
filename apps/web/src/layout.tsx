import { useObservable } from "@repo/core/async"
import { ProvideSpaces } from "@repo/sdk"
import { Button } from "@repo/ui/components/button"
import { Link } from "@tanstack/react-router"
import { PropsWithChildren } from "react"
import { useDatabase } from "./data"
import { useActiveSpace } from "./db/local"
import { Navigation } from "./ui/navigation"

export const Layout = ({ children }: PropsWithChildren) => {
  const { signOut, db } = useDatabase()
  const apps = useObservable(db.apps.find({}).$)
  const spaces = useObservable(db.spaces.find({}).$)
  const space = useActiveSpace()

  return (
    <ProvideSpaces
      spaces={{
        active: space,
        all: spaces?.map((s) => s._data) || [],
      }}
    >
      <Navigation
        signOut={signOut}
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
    </ProvideSpaces>
  )
}
