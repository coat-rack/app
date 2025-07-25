import { createLazyFileRoute } from "@tanstack/react-router"

import { useLoggedInContext } from "@/logged-in-context"
import { trpcClient } from "@/trpc"
import { AppInstaller } from "@/ui/apps/installer"
import { AppManager } from "@/ui/apps/manager"
import { useObservable } from "@coat-rack/core/async"
import { useState } from "react"

export const Route = createLazyFileRoute("/apps/")({
  component: Index,
})

function Index() {
  const { db, appsCollection } = useLoggedInContext()

  const [createKey, setCreateKey] = useState(Date.now())

  const installApp = async (url: string) => {
    await trpcClient.apps.install.mutate(url)
    appsCollection.reSync()
    setCreateKey(Date.now())
  }

  const setDevMode = (appId: string) => async (devMode: boolean) => {
    await trpcClient.apps.setDevMode.mutate({ appId, devMode })
    appsCollection.reSync()
    setCreateKey(Date.now())
  }

  const apps = useObservable(db.apps.find({}).$, [createKey])

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-xl">Your Apps</h2>
          <AppInstaller onSubmit={installApp} />
        </div>
        <div className="flex flex-col">
          <ol>
            {apps?.map((app) => (
              <li key={app.id}>
                <AppManager app={app._data} setDevMode={setDevMode(app.id)} />
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
