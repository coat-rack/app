import { createLazyFileRoute } from "@tanstack/react-router"

import { Layout } from "@/layout"
import { trpcReact } from "@/trpc"

export const Route = createLazyFileRoute("/apps/$id")({
  component: Index,
})

function Index() {
  const { id } = Route.useParams()
  const { data } = trpcReact.apps.get.useQuery({ id })

  if (!data) {
    return null
  }

  const url = `http://localhost:5000/?url=${encodeURIComponent(data.url)}`

  return (
    <Layout title={data?.id || "Loading"}>
      <iframe src={url}></iframe>
    </Layout>
  )
}
