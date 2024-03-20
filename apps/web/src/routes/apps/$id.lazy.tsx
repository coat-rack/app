import { Layout } from "@/layout"
import { trpcReact } from "@/trpc"
import { createLazyFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"

export const Route = createLazyFileRoute("/apps/$id")({
  component: Index,
})

function Index() {
  const sandboxHost = "http://localhost:5000"
  const host = window.location.origin
  const { id } = Route.useParams()
  const { data } = trpcReact.apps.get.useQuery({ id })

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.origin != sandboxHost) {
        return
      }
      console.log("web: got message from sandbox", event.data)
      event.source?.postMessage("hello from web", {
        targetOrigin: event.origin,
      })
    }
    window.addEventListener("message", handler)

    return () => window.removeEventListener("message", handler)
  }, [])

  if (!data) {
    return null
  }

  const url = `${sandboxHost}/?host=${encodeURIComponent(
    host,
  )}&url=${encodeURIComponent(data.url)}`

  return (
    <Layout title={data?.id || "Loading"}>
      <iframe src={url}></iframe>
    </Layout>
  )
}
