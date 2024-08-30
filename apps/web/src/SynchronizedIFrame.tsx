import { useDatabase } from "@/data"
import { RpcRequest, RpcResponse, err, ok } from "@repo/data/rpc"
import { Db } from "@repo/sdk"
import { useEffect } from "react"

type DataKey = `data.${string}`
type DataQuery = Record<DataKey, unknown>

function createDataQuery(data: Record<string, unknown> = {}): DataQuery {
  const result: DataQuery = {}
  const entries = Object.entries(data as Record<string, unknown>)

  for (const [k, value] of entries) {
    result[`data.${k}`] = value
  }

  return result
}

function useIframeSynchronization(
  appId: string,
  sandboxHost: string,
  space: string,
) {
  const { db } = useDatabase()

  const handler = (event: MessageEvent<RpcRequest<Db<unknown>>>) => {
    if (event.origin != sandboxHost) {
      return
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

    const replyError = (e: unknown) => reply(err(e))

    if (event.data.op === "query") {
      const [data] = event.data.args

      const dataQuery = createDataQuery(data)

      console.log(dataQuery)
      db.appdata
        .find({
          selector: {
            ...dataQuery,
            app: appId,
          },
        })
        .exec()
        .then((documents) =>
          reply(
            ok(
              documents?.map((doc) => {
                const docUnwrapped = doc.toJSON()
                return {
                  id: docUnwrapped.id,
                  space: docUnwrapped.space,
                  data: docUnwrapped.data,
                }
              }),
            ),
          ),
        )
        .catch(replyError)
    } else if (event.data.op === "delete") {
      const [id] = event.data.args
      db.appdata
        .findByIds([id])
        .exec()
        .then(async (foundItems) => {
          const foundItem = foundItems.get(id)
          if (!foundItem) {
            return
          }

          return foundItem.remove()
        })
        .then(() => reply(ok(undefined)))
        .catch(replyError)
    } else if (event.data.op === "get") {
      const [id] = event.data.args
      db.appdata
        .findByIds([id])
        .exec()
        .then((foundItems) => {
          const foundItem = foundItems.get(id)?.toJSON()
          if (!foundItem) {
            reply(ok(undefined))
          } else {
            reply(
              ok({
                id: foundItem.id,
                space: foundItem.space,
                data: foundItem.data,
              }),
            )
          }
        })
        .catch(replyError)
    } else if (event.data.op === "create") {
      const [data] = event.data.args
      db.appdata
        .insert({
          id: `${appId}__${Date.now()}`, // TODO is this default ID safe? what about batch inserts?
          data,
          app: appId,
          timestamp: Date.now(),
          type: "app-data",
          space,
        })
        .then((doc) => {
          const docUnwrapped = doc.toJSON()
          reply(
            ok({
              id: docUnwrapped.id,
              data: docUnwrapped.data,
              space: docUnwrapped.space,
            }),
          )
        })
        .catch(replyError)
    } else if (event.data.op === "update") {
      const [id, data] = event.data.args
      db.appdata
        .upsert({
          id,
          data,
          app: appId,
          timestamp: Date.now(),
          type: "app-data",
          space,
        })
        .then((doc) => {
          const docUnwrapped = doc.toJSON()
          reply(
            ok({
              id: docUnwrapped.id,
              data: docUnwrapped.data,
              space: docUnwrapped.space,
            }),
          )
        })
        .catch(replyError)
    }
  }

  useEffect(() => {
    window.addEventListener("message", handler)
    return () => window.removeEventListener("message", handler)
  })
}

interface SynchronizedIframeProps {
  appId: string
  appUrl: URL
  sandboxHost: string
  space: string
  className?: string
}

export function SynchronizedIframe({
  appId,
  appUrl,
  sandboxHost,
  space,
  className,
}: SynchronizedIframeProps) {
  useIframeSynchronization(appId, sandboxHost, space)
  const url = `${sandboxHost}/?appUrl=${encodeURIComponent(appUrl.toString())}`

  return (
    <iframe
      className={className}
      src={url}
      referrerPolicy="strict-origin"
    ></iframe>
  )
}
