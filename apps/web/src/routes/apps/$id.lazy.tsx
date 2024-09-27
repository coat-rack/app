import { SynchronizedIframe } from "@/SynchronizedIFrame"
import { useDatabase } from "@/data"
import { useObservable } from "@repo/sdk/hooks"
import { createLazyFileRoute } from "@tanstack/react-router"

const PUBLIC_SPACE = "public"

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
      {app && (
        <SynchronizedIframe
          className="h-full w-full"
          appId={app.id}
          appUrl={resolveAppUrl(app.port)}
          sandboxHost={sandboxHost}
          space={PUBLIC_SPACE}
        />
      )}
    </div>
  )
}
