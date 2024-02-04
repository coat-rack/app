import { Link, createLazyFileRoute } from "@tanstack/react-router"

import { Layout } from "@/layout"

export const Route = createLazyFileRoute("/")({
  component: Index,
})

function Index() {
  return (
    <Layout title="Home">
      <div className="flex flex-col gap-1">
        <Link to="/apps/todos">Todos</Link>
        <Link to="/apps/notes">Notes</Link>
        <Link to="/spaces">Spaces</Link>
      </div>
    </Layout>
  )
}
