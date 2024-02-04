import { createLazyFileRoute } from "@tanstack/react-router"

import { useObservable } from "@/async"
import { useDatabase } from "@/data"
import { Layout } from "@/layout"
import { trpcReact } from "@/trpc"

export const Route = createLazyFileRoute("/spaces/")({
  component: Index,
})

function Index() {
  const users = trpcReact.users.getAll.useQuery()
  const { db } = useDatabase()
  const spaces = useObservable(db.spaces.find({}).$)

  return (
    <Layout title="Manage Spaces">
      <h2 className="text-xl">Users</h2>
      <ol>{users.data?.map((user) => <li key={user.id}>{user.name}</li>)}</ol>

      <h2 className="text-xl">Spaces</h2>
      <ol>{spaces?.map((space) => <li key={space.id}>{space.name}</li>)}</ol>
    </Layout>
  )
}
