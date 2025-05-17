import { useDatabase } from "@/data"
import { RpcRequest, RpcResponse, err, ok } from "@coat-rack/core/rpc"
import { SharedChannel } from "@coat-rack/core/shared-channel"
import { Db } from "@coat-rack/sdk"
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

export function useIFrameRPC(
  appId: string,
  space: string,
  filtered: boolean,
  port?: SharedChannel,
) {
  const { db } = useDatabase()

  const handler = (event: RpcRequest<Db<unknown>>) => {
    console.log("event", event)
    const reply = async <Op extends keyof Db<unknown>>(
      value: RpcResponse<Db<unknown>, Op>["result"],
    ) => {
      const message = {
        type: "rpc.response",
        result: value,
        op: event.op,
        requestId: event.requestId,
      } as RpcResponse<Db<unknown>, Op>

      port?.postMessage(message)
    }

    const replyError = (e: unknown) => reply(err(e))

    if (event.op === "query") {
      const [data] = event.args

      const dataQuery = createDataQuery(data)

      const filterSelector = filtered ? { space } : {}

      db.appdata
        .find({
          selector: {
            ...dataQuery,
            ...filterSelector,
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
                  timestamp: docUnwrapped.timestamp,
                }
              }),
            ),
          ),
        )
        .catch(replyError)
    } else if (event.op === "delete") {
      const [id] = event.args
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
    } else if (event.op === "get") {
      const [id] = event.args
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
                timestamp: foundItem.timestamp,
              }),
            )
          }
        })
        .catch(replyError)
    } else if (event.op === "create") {
      const [data] = event.args
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
              timestamp: docUnwrapped.timestamp,
            }),
          )
        })
        .catch(replyError)
    } else if (event.op === "update") {
      const [id, space, data] = event.args

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
              timestamp: docUnwrapped.timestamp,
            }),
          )
        })
        .catch(replyError)
    }
  }

  useEffect(() => {
    if (!port) {
      return
    }

    port.subscribe("rpc.request", handler)

    return () => port.unsubscribe("rpc.request", handler)
  }, [port])
}
