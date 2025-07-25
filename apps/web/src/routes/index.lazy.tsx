import { useLoggedInContext } from "@/logged-in-context"
import { useObservable } from "@coat-rack/core/async"
import { Link, createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/")({
  component: Index,
})

function Index() {
  const { db } = useLoggedInContext()
  const apps = useObservable(db.apps.find({}).$)

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl">Manage</h2>
        <div className="flex flex-col gap-1">
          <Link to="/spaces">Spaces</Link>
          <Link to="/apps">Apps</Link>
        </div>
      </div>

      <div>
        <h2 className="text-xl">Apps</h2>
        <div className="flex flex-col gap-1">
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
        </div>
      </div>
    </div>
  )
}
