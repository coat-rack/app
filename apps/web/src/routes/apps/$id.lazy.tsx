import { SynchronizedIframe } from "@/SynchronizedIFrame"
import { Layout } from "@/layout"
import { trpcReact } from "@/trpc"
import { createLazyFileRoute } from "@tanstack/react-router"
export const Route = createLazyFileRoute("/apps/$id")({
  component: Index,
})
const PUBLIC_SPACE = "public"

function Index() {
  const sandboxHost = "http://localhost:5000" // TODO: this should be config
  const { id } = Route.useParams()
  const { data: app } = trpcReact.apps.get.useQuery({ id })

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
