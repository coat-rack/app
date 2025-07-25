import { createLazyFileRoute } from "@tanstack/react-router"

import { useLoggedInContext } from "@/logged-in-context"
import { SpaceCreator } from "@/ui/spaces/creator"
import { SpaceEditor } from "@/ui/spaces/editor"
import { useObservable } from "@coat-rack/core/async"
import { Space } from "@coat-rack/core/models"
import { useState } from "react"

export const Route = createLazyFileRoute("/spaces/")({
  component: Index,
})

function Index() {
  const { db, spacesCollection, user } = useLoggedInContext()
  const users = useObservable(db.users.find({}).$)
  const spaces = useObservable(db.spaces.find({}).$)

  const [createKey, setCreateKey] = useState(Date.now())

  const upsertSpace = async (space: Space) => {
    setCreateKey(Date.now())
    await db.spaces.upsert(space)
    spacesCollection.reSync()
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
              user={user.id}
              onSubmit={upsertSpace}
            />
          )}
        </div>
        <div className="flex flex-col">
          {spaces
            ?.filter((s) => s.owner === user.id)
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
              ?.filter((s) => s.owner !== user.id)
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
