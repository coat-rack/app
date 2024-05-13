import { SynchronizedIframe } from "@/SynchronizedIFrame"
import { useObservable } from "@/async"
import { useDatabase } from "@/data"
import { Layout } from "@/layout"
import { createLazyFileRoute } from "@tanstack/react-router"
export const Route = createLazyFileRoute("/apps/$id")({
  component: Index,
})
const PUBLIC_SPACE = "public"

function Index() {
  const sandboxHost = "http://localhost:5000" // TODO: this should be config
  const { id } = Route.useParams()

  const { db } = useDatabase()
  const app = useObservable(
    db.apps.findOne({
      selector: {
        id,
      },
    }).$,
  )

  return (
    <Layout title={app?.id || "Loading"}>
      {app && (
        <SynchronizedIframe
          appId={app.id}
          appUrl={app.url}
          sandboxHost={sandboxHost}
          space={PUBLIC_SPACE}
        />
      )}
    </Layout>
  )
}
