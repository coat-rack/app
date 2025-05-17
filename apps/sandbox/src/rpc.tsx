import { SharedChannel } from "@coat-rack/core/messaging"
import { RpcRequest, RpcResponse } from "@coat-rack/core/rpc"
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

export const getRpcDb = (port: SharedChannel): Db<unknown> => {
  const rpcHost: (message: Object) => Promise<unknown | undefined> = (
    message,
  ) => {
    return new Promise<unknown | undefined>((resolve, reject) => {
      const requestId = guidGenerator()
      const handler = (event: RpcResponse<Db>) => {
        if (event.requestId != requestId) {
          return
        }

        port.unsubscribe<RpcResponse<Db>>("rpc.response", handler)
        if (event.result.ok) {
          resolve(event.result.value)
        } else {
          reject(event.result.error)
        }
      }

      port.subscribe("rpc.response", handler)
      port.postMessage<RpcRequest<Db>>({
        type: "rpc.request",
        requestId,
        ...message,
      } as RpcRequest<Db>)
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

  console.log(port)

  return constructRpcProxy(initialDb)
}
