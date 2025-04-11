import { RpcResponse } from "@coat-rack/core/rpc"
import { Db } from "@coat-rack/sdk"

function guidGenerator() {
  if (window.isSecureContext) {
    return crypto.randomUUID()
  }

  return new Date().valueOf()
}

const initialDb: Db = {
  get: async () => {
    throw new Error("Not connected to host!")
  },
  create: async () => {
    throw new Error("Not connected to host!")
  },
  update: async () => {
    throw new Error("Not connected to host!")
  },
  delete: async () => {
    throw new Error("Not connected to host!")
  },
  query: async () => {
    throw new Error("Not connected to host!")
  },
  subscribe: async () => {
    throw new Error("Not connected to host!")
  },
}

export const getRpcDb = (): Db<unknown> => {
  const host = document.referrer.replace(/\/$/, "")
  if (!host) {
    throw new Error("Couldn't determine host origin")
  }

  const rpcHost: (message: Object) => Promise<unknown | undefined> = (
    message,
  ) => {
    return new Promise<unknown | undefined>((resolve, reject) => {
      const requestId = guidGenerator()
      const handler = (event: MessageEvent<RpcResponse<Db>>) => {
        if (event.origin != host || event.data.requestId != requestId) {
          return
        }
        window.removeEventListener("message", handler)
        if (event.data.result.ok) {
          resolve(event.data.result.value)
        } else {
          reject(event.data.result.error)
        }
      }
      window.addEventListener("message", handler)
      window.parent.postMessage(
        {
          requestId,
          ...message,
        },
        host,
      )
    })
  }

  const constructRpcProxy = <T extends Object>(object: T): T => {
    return new Proxy(object, {
      get(target, prop) {
        if (typeof target[prop as keyof T] === "function") {
          const method = target[prop as keyof T] as CallableFunction
          return new Proxy(method, {
            apply: (_, __, args) => {
              return rpcHost({
                op: prop,
                args,
              })
            },
          })
        }
        return Reflect.get(target, prop)
      },
    })
  }

  return constructRpcProxy(initialDb)
}
