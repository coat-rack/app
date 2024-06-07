import { useDatabase } from "@/data"
import { RpcRequest, RpcResponse, err, ok } from "@repo/data/rpc"
import { Db } from "@repo/sdk"
import { useEffect } from "react"

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
      db.appdata
        .find({
          selector: {
            $and: [{ app: appId }, { data }, { space }],
          },
        })
        .exec()
        .then((documents) =>
          reply(ok(documents?.map((doc) => doc?.toJSON()?.data))),
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
          reply(ok(foundItem?.data))
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
          reply(ok({ id: docUnwrapped.id, data: docUnwrapped.data }))
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
          reply(ok({ id: docUnwrapped.id, data: docUnwrapped.data }))
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
  // TODO: maybe make these URLs
  appUrl: string
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
  const host = window.location.origin
  const url = `${sandboxHost}/?host=${encodeURIComponent(
    host,
  )}&url=${encodeURIComponent(appUrl)}`

  return <iframe className={className} src={url}></iframe>
}
