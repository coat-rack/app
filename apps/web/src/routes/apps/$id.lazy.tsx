import { SynchronizedIframe } from "@/SynchronizedIFrame"
import { useObservable } from "@/async"
import { useDatabase } from "@/data"
import { useActiveSpace, useFilterSpaces, useLocalUser } from "@/db/rxdb"
import { createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/apps/$id")({
  component: Index,
})

function resolveAppUrl(port: number) {
  const base = new URL("/", window.location.toString())
  base.port = port.toString()

  return base
}

function Index() {
  const sandboxHost = import.meta.env.VITE_SANDBOX_URL
  const { id } = Route.useParams()

  const user = useLocalUser()
  const activeSpace = useActiveSpace()
  const filtered = useFilterSpaces()

  const space = activeSpace?.id || user

  const { db } = useDatabase()
  const app = useObservable(
    db.apps.findOne({
      selector: {
        id,
      },
    }).$,
    [id],
  )

  return (
    <div className="h-full w-full" id={id} key={id}>
      {space && app && (
        <SynchronizedIframe
          className="h-full w-full"
          appId={app.id}
          appUrl={resolveAppUrl(app.port)}
          sandboxHost={sandboxHost}
          filteredSpaces={filtered || false}
          space={space}
        />
      )}
    </div>
  )
}
