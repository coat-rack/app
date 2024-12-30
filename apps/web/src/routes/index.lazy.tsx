import { Link, createLazyFileRoute } from "@tanstack/react-router"

import { useDatabase } from "@/data"
import { trpcClient } from "@/trpc"
import { useObservable } from "@repo/core/async"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { useState } from "react"

export const Route = createLazyFileRoute("/")({
  component: Index,
})

function Index() {
  const { db, appsCollection } = useDatabase()
  const apps = useObservable(db.apps.find({}).$)

  const [url, setUrl] = useState("")
  const installApp = async () => {
    const result = await trpcClient.apps.install.mutate(url)
    setUrl("")

    console.log("Installation Result", result)

    const synced = await appsCollection.reSync()
    console.log("Synced Result", synced)
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl">Links</h2>
        <div className="flex flex-col gap-1">
          <Link to="/spaces">Spaces</Link>
        </div>
      </div>

      <div>
        <Input value={url} onChange={(ev) => setUrl(ev.target.value)}></Input>
        <Button onClick={installApp}>Install app</Button>
      </div>

      <div>
        <h2 className="text-xl">Apps</h2>
        <div className="flex flex-col gap-1">
          {apps?.map((app) => (
            <Link
              key={app.id}
              to="/apps/$id"
              params={{
                id: app.id,
              }}
            >
              {app.id}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
