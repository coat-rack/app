import { useDatabase } from "@/data"
import { Layout } from "@/layout"
import { trpcReact } from "@/trpc"
import { RpcRequest, RpcResponse, err, ok } from "@repo/data/rpc"
import { Db } from "@repo/sdk"
import { createLazyFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"
export const Route = createLazyFileRoute("/apps/$id")({
  component: Index,
})

function Index() {
  const sandboxHost = "http://localhost:5000"
  const host = window.location.origin
  const { id } = Route.useParams()
  const { data: appInfo } = trpcReact.apps.get.useQuery({ id })
  const { db } = useDatabase()

  const handler = (
    event: MessageEvent<RpcRequest<Db<unknown>>>,
  ): Promise<unknown> | undefined => {
    if (event.origin != sandboxHost) {
      return
    }
    if (!appInfo) {
      throw new Error("appInfo is missing - is the app id valid?")
    }

    const reply = async <Op extends keyof Db<unknown>>(
      value: RpcResponse<Db<unknown>, Op>["result"],
    ) => {
      const message = {
        result: value,
        op: event.data.op,
        requestId: event.data.requestId,
      }
      event.source?.postMessage(message, { targetOrigin: event.origin })
    }

    switch (event.data.op) {
      case "query":
        db.appdata
          .find({
            selector: {
              $and: [
                { app: appInfo.id },
                { data: event.data.args[0] },
                { isDeleted: false }, // TODO is this handled by the server?
              ],
            },
          })
          .exec()
          .then(
            (val) => reply(ok(val?.map((x) => x?.toJSON()?.data))),
            (e) => reply(err(e)),
          )
        return
      case "delete":
        const deleteRequest = event.data
        db.appdata
          .findByIds([event.data.args[0]])
          .exec()
          .then((foundItems) => {
            const foundItem = foundItems.get(deleteRequest.args[0])
            return new Promise<void>((resolve) => {
              if (foundItem) {
                foundItem.remove().then(() => resolve())
              } else {
                resolve()
              }
            })
          })
          .then(
            () => reply(ok(undefined)),
            (e) => reply(err(e)),
          )
        return
      case "get":
        const getRequest = event.data
        db.appdata
          .findByIds([event.data.args[0]])
          .exec()
          .then(
            (foundItems) => {
              const foundItem = foundItems.get(getRequest.args[0])?.toJSON()
              reply(ok(foundItem?.data))
            },
            (e) => reply(err(e)),
          )
        return
      case "create":
        db.appdata
          .upsert({
            id: `${appInfo.id}__${Date.now()}`,
            data: event.data.args[0],
            app: appInfo.id,
            timestamp: Date.now(),
            type: "app-data",
            space: "public",
          })
          .then(
            (doc) => {
              const docUnwrapped = doc.toJSON()
              reply(ok({ id: docUnwrapped.id, data: docUnwrapped.data }))
            },
            (e) => reply(err(e)),
          )
        return
      case "update":
        db.appdata
          .upsert({
            id: event.data.args[0],
            data: event.data.args[1],
            app: appInfo.id,
            timestamp: Date.now(),
            type: "app-data",
            space: "public",
          })
          .then(
            (doc) => {
              const docUnwrapped = doc.toJSON()
              reply(ok({ id: docUnwrapped.id, data: docUnwrapped.data }))
            },
            (e) => reply(err(e as Error)),
          )
        return
    }
  }
  useEffect(() => {
    window.addEventListener("message", handler)
    return () => window.removeEventListener("message", handler)
  })

  if (!appInfo) {
    return null
  }

  const url = `${sandboxHost}/?host=${encodeURIComponent(
    host,
  )}&url=${encodeURIComponent(appInfo.url)}`

  return (
    <Layout title={appInfo?.id || "Loading"}>
      <iframe src={url}></iframe>
    </Layout>
  )
}
