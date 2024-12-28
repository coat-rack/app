import { createLazyFileRoute } from "@tanstack/react-router"

import { useObservable } from "@/async"
import { useDatabase } from "@/data"
import { useLocalUser } from "@/db/rxdb"
import { Space } from "@repo/data/models"
import { useState } from "react"
import { SpaceCreator } from "../components/spaces/create"
import { SpaceEditor } from "../components/spaces/edit"

export const Route = createLazyFileRoute("/spaces/")({
  component: Index,
})

function Index() {
  const { db } = useDatabase()
  const users = useObservable(db.users.find({}).$)
  const spaces = useObservable(db.spaces.find({}).$)

  const [createKey, setCreateKey] = useState(Date.now())

  const user = useLocalUser()

  const upsertSpace = async (space: Space) => {
    setCreateKey(Date.now())
    await db.spaces.upsert(space)
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-xl">Your Spaces</h2>

          {user && (
            <SpaceCreator
              key={createKey}
              appUsers={users || []}
              user={user}
              onSubmit={upsertSpace}
            />
          )}
        </div>
        <div className="flex flex-col">
          {spaces
            ?.filter((s) => s.owner === user)
            ?.map((space) => (
              <SpaceEditor
                key={space.id}
                space={space._data}
                onSubmit={upsertSpace}
                appUsers={users || []}
              />
            ))}
        </div>

        <div>
          <h2 className="text-xl">Shared Spaces</h2>
          <ol>
            {spaces
              ?.filter((s) => s.owner !== user)
              ?.map((s) => (
                <li key={s.id} style={{ color: s.color }}>
                  {s.name}
                </li>
              ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
