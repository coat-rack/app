import { RpcRequest, RpcResponse } from "@coat-rack/core/rpc"
import { SharedChannel } from "@coat-rack/core/shared-channel"
import { Db } from "@coat-rack/sdk"

function guidGenerator(): string {
  if (window.isSecureContext) {
    return crypto.randomUUID()
  }

  return new Date().valueOf().toString()
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

type ProxyProps = Pick<RpcRequest<Db>, "op" | "args">

export const getRpcDb = (port: SharedChannel): Db<unknown> => {
  const rpcHost: (message: ProxyProps) => Promise<unknown | undefined> = (
    message,
  ) => {
    return new Promise<unknown>((resolve, reject) => {
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
            apply: (_, __, args) =>
              rpcHost({
                op: prop,
                args,
              } as ProxyProps),
          })
        }
        return Reflect.get(target, prop)
      },
    })
  }

  return constructRpcProxy(initialDb)
}
