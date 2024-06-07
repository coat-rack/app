import { SynchronizedIframe } from "@/SynchronizedIFrame"
import { useObservable } from "@/async"
import { useDatabase } from "@/data"
import { createLazyFileRoute } from "@tanstack/react-router"

const PUBLIC_SPACE = "public"

export const Route = createLazyFileRoute("/apps/$id")({
  component: Index,
})

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
          appUrl={app.url}
          sandboxHost={sandboxHost}
          space={PUBLIC_SPACE}
        />
      )}
    </div>
  )
}
