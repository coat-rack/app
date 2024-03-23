import { useDatabase } from "@/data"
import { Layout } from "@/layout"
import { trpcReact } from "@/trpc"
import { Schema } from "@repo/data/models"
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

  useEffect(() => {
    const handler = (event: MessageEvent<RpcRequest<keyof Schema>>) => {
      if (event.origin != sandboxHost) {
        return
      }
      const reply = <T,>(response: T) => {
        const message: RpcResponse<T> = {
          requestId: event.data.requestId,
          value: response,
        }
        console.log("host responding", message)
        event.source?.postMessage(message, { targetOrigin: event.origin })
      }
      console.log("host", event.data)
      const collectionName = event.data.args[0]
      const collection = db[collectionName]
      switch (event.data.op) {
        case "query":
          collection
            .find({ selector: event.data.args[1] })
            .exec()
            .then((val) => reply(val.map((x) => x.toJSON())))
          return
        case "delete":
          const deleteOp = event.data
          collection
            .findByIds([event.data.args[1]])
            .exec()
            .then((foundItems) => {
              const foundItem = foundItems.get(deleteOp.args[1])
              if (foundItem) {
                return foundItem.update({
                  $set: {
                    isDeleted: true,
                  },
                })
              }
              return new Promise<void>((resolve) => {
                resolve()
              })
            })
            .then(() => reply(undefined))
          return
        case "get":
          const getOp = event.data
          collection
            .findByIds([event.data.args[1]])
            .exec()
            .then((foundItems) => {
              const foundItem = foundItems.get(getOp.args[1])?.toJSON()
              reply(foundItem)
            })
          return
        case "upsert":
          collection.upsert(event.data.args[1]).then(() => reply(undefined))
      }
    }
    window.addEventListener("message", handler)

    return () => window.removeEventListener("message", handler)
  }, [])

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
