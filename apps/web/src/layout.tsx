import { useObservable } from "@coat-rack/core/async"
import { Button } from "@coat-rack/ui/components/button"
import { Link } from "@tanstack/react-router"
import { PropsWithChildren } from "react"
import { useLoggedInContext } from "./data"
import { Navigation } from "./ui/navigation"

export const Layout = ({ children }: PropsWithChildren) => {
  const { signOut, db } = useLoggedInContext()
  const apps = useObservable(db.apps.find({}).$)

  return (
    <Navigation
      signOut={signOut}
      Links={apps?.map((app) => (
        <Button asChild variant="link" size="sm" key={app.id}>
          <Link
            to="/apps/$id"
            className="block h-auto"
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
