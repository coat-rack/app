import { Link, createLazyFileRoute } from "@tanstack/react-router"

import { Layout } from "@/layout"

export const Route = createLazyFileRoute("/")({
  component: Index,
})

function Index() {
  return (
    <Layout title="Server Content">
      <Link to="/apps/todos">Todos</Link>
      <Link to="/apps/notes">Notes</Link>
    </Layout>
  )
}
