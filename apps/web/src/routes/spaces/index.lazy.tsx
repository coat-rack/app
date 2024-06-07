import { createLazyFileRoute } from "@tanstack/react-router"

import { useObservable } from "@/async"
import { useDatabase } from "@/data"

export const Route = createLazyFileRoute("/spaces/")({
  component: Index,
})

function Index() {
  const { db } = useDatabase()
  const users = useObservable(db.users.find({}).$)
  const spaces = useObservable(db.spaces.find({}).$)

  return (
    <>
      <h2 className="text-xl">Users</h2>
      <ol>{users?.map((user) => <li key={user.id}>{user.name}</li>)}</ol>

      <h2 className="text-xl">Spaces</h2>
      <ol>{spaces?.map((space) => <li key={space.id}>{space.name}</li>)}</ol>
    </>
  )
}
