import { SynchronizedIframe } from "@/iframe/synchronized"
import { useLoggedInContext } from "@/logged-in-context"
import { useObservable } from "@coat-rack/core/async"
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
  const sandboxHost = new URL(window.location.toString())
  sandboxHost.port = import.meta.env.VITE_SANDBOX_PORT
  sandboxHost.pathname = ""
  const { id } = Route.useParams()

  const { db, activeSpace, filterSpaces } = useLoggedInContext()

  const app = useObservable(
    db.apps.findOne({
      selector: {
        id,
      },
    }).$,
    [id],
  )

  const hasConfig = app && activeSpace
  if (!hasConfig) {
    return undefined
  }

  const appUrl = resolveAppUrl(app.port)

  return (
    <div className="h-full w-full" id={id} key={id}>
      <SynchronizedIframe
        className="h-full w-full"
        appId={app.id}
        appUrl={appUrl}
        filteredSpaces={filterSpaces || false}
        space={activeSpace.id}
      />
    </div>
  )
}
