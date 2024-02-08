import { Link, createLazyFileRoute } from "@tanstack/react-router"

import { usePromise } from "@/async"
import { Layout } from "@/layout"
import React from "react"

export const Route = createLazyFileRoute("/")({
  component: Index,
})

const files = [
  "http://localhost:3000/catalog/sample-app/dist/sample-app.iife.js",
  "http://localhost:3000/catalog/sample-app/dist/sample-app.js",
  "http://localhost:3000/catalog/sample-app/dist/sample-app.mjs",

  // UMD seems to be the only one that doesn't crash, registers the app globally
  // using the name of the app. This could be a bit conflicty but probably okay for now
  "http://localhost:3000/catalog/sample-app/dist/sample-app.umd.js",
  "http://localhost:3000/catalog/sample-app/example-module.js",
]

window["React"] = React

const sampleAppImport =
  "http://localhost:3000/catalog" + "/sample-app/dist/sample-app.mjs"

function Index() {
  const dynamic = usePromise(() => import(sampleAppImport))

  const DynamicComponent = dynamic?.default?.entry

  return (
    <Layout title="Home">
      {DynamicComponent && <DynamicComponent />}
      <div className="flex flex-col gap-1">
        <Link to="/apps/todos">Todos</Link>
        <Link to="/apps/notes">Notes</Link>
        <Link to="/spaces">Spaces</Link>
      </div>
    </Layout>
  )
}
