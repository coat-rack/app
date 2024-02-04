import { createLazyFileRoute } from "@tanstack/react-router"

import { Layout } from "@/layout"

export const Route = createLazyFileRoute("/spaces/")({
  component: Index,
})

function Index() {
  return <Layout title="Manage Spaces"></Layout>
}
