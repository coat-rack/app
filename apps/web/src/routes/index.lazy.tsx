import { createLazyFileRoute } from "@tanstack/react-router"
import { trpc } from "../trpc"

export const Route = createLazyFileRoute("/")({
  component: Index,
})

function Index() {
  const data = trpc.getName.useQuery()

  return (
    <div>
      <h1>Message From Server</h1>

      <pre>{data?.data}</pre>
    </div>
  )
}
