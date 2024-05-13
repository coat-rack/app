import { Link, createLazyFileRoute } from "@tanstack/react-router"

import { useObservable } from "@/async"
import { useDatabase } from "@/data"
import { Layout } from "@/layout"

export const Route = createLazyFileRoute("/")({
  component: Index,
})

function Index() {
  const { db } = useDatabase()
  const apps = useObservable(db.apps.find({}).$)

  return (
    <Layout title="Home">
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="text-xl">Links</h2>
          <div className="flex flex-col gap-1">
            <Link to="/spaces">Spaces</Link>
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
    </Layout>
  )
}
