import { useDatabase } from "@/data"
import { Layout } from "@/layout"
import { trpcReact } from "@/trpc"
import { RpcRequest, RpcResponse } from "@repo/sdk"
import { createLazyFileRoute } from "@tanstack/react-router"
import { useEffect } from "react"

export const Route = createLazyFileRoute("/apps/$id")({
  component: Index,
})

function Index() {
  const sandboxHost = "http://localhost:5000"
  const host = window.location.origin
  const { id } = Route.useParams()
  const { data } = trpcReact.apps.get.useQuery({ id })
  const { db } = useDatabase()

  const handler = (event: MessageEvent<RpcRequest<unknown>>) => {
    if (event.origin != sandboxHost) {
      return
    }
    const reply = <T,>(response?: T) => {
      const message: RpcResponse<T> = {
        requestId: event.data.requestId,
        value: response,
      }
      event.source?.postMessage(message, { targetOrigin: event.origin })
    }
    switch (event.data.op) {
      case "query":
        db.appdata
          .find({
            selector: {
              $and: [
                { app: data!.id },
                { data: event.data.args[0] },
                { isDeleted: false },
              ],
            },
          })
          .exec()
          .then((val) => reply(val?.map((x) => x?.toJSON()?.data)))
        return
      case "delete":
        const deleteRequest = event.data
        db.appdata
          .findByIds([event.data.args[0]])
          .exec()
          .then((foundItems) => {
            return new Promise<void>((resolve) => {
              const foundItem = foundItems.get(deleteRequest.args[0])
              if (foundItem) {
                return foundItem
                  .update({
                    $set: {
                      isDeleted: true,
                    },
                  })
                  .then(() => resolve())
              } else {
                resolve()
              }
            })
          })
          .then(() => reply())
        return
      case "get":
        const getRequest = event.data
        db.appdata
          .findByIds([event.data.args[0]])
          .exec()
          .then((foundItems) => {
            const foundItem = foundItems.get(getRequest.args[0])?.toJSON()
            reply(foundItem?.data)
          })
        return
      case "upsert":
        db.appdata
          .upsert({
            id: event.data.args[0],
            data: event.data.args[1],
            app: data!.id,
            timestamp: new Date().valueOf(),
            type: "app-data",
            space: "public",
          })
          .then((val) => {
            const v = val.toJSON()
            reply({ key: v.id, data: v.data })
          })
    }
  }
  useEffect(() => {
    window.addEventListener("message", handler)
    return () => window.removeEventListener("message", handler)
  })

  if (!data) {
    return null
  }

  const url = `${sandboxHost}/?host=${encodeURIComponent(
    host,
  )}&url=${encodeURIComponent(data.url)}`

  return (
    <Layout title={data?.id || "Loading"}>
      <iframe src={url}></iframe>
    </Layout>
  )
}
