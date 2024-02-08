import { Link, createLazyFileRoute } from "@tanstack/react-router"

import { useApp } from "@/dynamic"
import { Layout } from "@/layout"

export const Route = createLazyFileRoute("/")({
  component: Index,
})

const sampleAppImport =
  "http://localhost:3000/catalog/sample-app/dist/sample-app.mjs"

function Index() {
  const app = useApp(sampleAppImport)

  const App = app?.entry

  return (
    <Layout title="Home">
      {App && <App />}
      <div className="flex flex-col gap-1">
        <Link to="/apps/todos">Todos</Link>
        <Link to="/apps/notes">Notes</Link>
        <Link to="/spaces">Spaces</Link>
      </div>
    </Layout>
  )
}
