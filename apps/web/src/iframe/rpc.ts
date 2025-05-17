import { useDatabase } from "@/data"
import { useChannelSubscription } from "@coat-rack/core/messaging"
import { ChannelMessage } from "@coat-rack/core/messsage"
import { RpcRequest, RpcResponse, err, ok } from "@coat-rack/core/rpc"
import { SharedChannel } from "@coat-rack/core/shared-channel"
import { Db } from "@coat-rack/sdk"

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
  channel: SharedChannel,
  appId: string,
  space: string,
  filtered: boolean,
) {
  const { db } = useDatabase()

  const handler = (
    event: RpcRequest<Db<unknown>>,
    reply: (message: ChannelMessage) => void,
  ) => {
    const sendResponse = async <Op extends keyof Db<unknown>>(
      value: RpcResponse<Db<unknown>, Op>["result"],
    ) => {
      const message = {
        type: "rpc.response",
        result: value,
        op: event.op,
        requestId: event.requestId,
      } as RpcResponse<Db<unknown>, Op>

      reply(message)
    }

    const sendError = (e: unknown) => sendResponse(err(e))

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
          sendResponse(
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
        .catch(sendError)
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
        .then(() => sendResponse(ok(undefined)))
        .catch(sendError)
    } else if (event.op === "get") {
      const [id] = event.args
      db.appdata
        .findByIds([id])
        .exec()
        .then((foundItems) => {
          const foundItem = foundItems.get(id)?.toJSON()
          if (!foundItem) {
            sendResponse(ok(undefined))
          } else {
            sendResponse(
              ok({
                id: foundItem.id,
                space: foundItem.space,
                data: foundItem.data,
                timestamp: foundItem.timestamp,
              }),
            )
          }
        })
        .catch(sendError)
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
          sendResponse(
            ok({
              id: docUnwrapped.id,
              data: docUnwrapped.data,
              space: docUnwrapped.space,
              timestamp: docUnwrapped.timestamp,
            }),
          )
        })
        .catch(sendError)
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
          sendResponse(
            ok({
              id: docUnwrapped.id,
              data: docUnwrapped.data,
              space: docUnwrapped.space,
              timestamp: docUnwrapped.timestamp,
            }),
          )
        })
        .catch(sendError)
    }
  }

  useChannelSubscription(channel, "rpc.request", handler)
}
