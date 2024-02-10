import { Link, createLazyFileRoute } from "@tanstack/react-router"

import { Layout } from "@/layout"
import { trpcReact } from "@/trpc"

export const Route = createLazyFileRoute("/")({
  component: Index,
})

function Index() {
  const { data: apps } = trpcReact.apps.list.useQuery()

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
