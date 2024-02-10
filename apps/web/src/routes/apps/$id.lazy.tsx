import { createLazyFileRoute } from "@tanstack/react-router"

import { useApp } from "@/dynamic"
import { Layout } from "@/layout"
import { trpcReact } from "@/trpc"

export const Route = createLazyFileRoute("/apps/$id")({
  component: Index,
})

function Index() {
  const { id } = Route.useParams()
  const { data } = trpcReact.apps.get.useQuery({ id })

  const app = useApp(data?.url)
  const App = app?.Entry

  return <Layout title={data?.id || "Loading"}>{App && <App />}</Layout>
}
