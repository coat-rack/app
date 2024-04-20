import { RpcResponse } from "@repo/data/rpc"
import { Db } from "@repo/sdk"
import { useApp } from "./dynamic"

const api: Db = {
  get: (_) =>
    new Promise((_resolve, reject) => reject("Not connected to host!")),
  create: (_) =>
    new Promise((_resolve, reject) => reject("Not connected to host!")),
  update: (_, __) =>
    new Promise((_resolve, reject) => reject("Not connected to host!")),
  delete: (_) =>
    new Promise((_resolve, reject) => reject("Not connected to host!")),
  query: (_) =>
    new Promise((_resolve, reject) => reject("Not connected to host!")),
}

function guidGenerator() {
  if (window.isSecureContext) {
    return crypto.randomUUID()
  }

  return new Date().valueOf()
}

const getApi = () => {
  const queryString = new URLSearchParams(window.location.search)
  // TODO: we probably need a more secure way of doing this
  const host = queryString.get("host") || undefined
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

  return constructRpcProxy(api)
}

function Sandbox() {
  const queryString = new URLSearchParams(window.location.search)
  const host = queryString.get("host") || undefined
  const url = queryString.get("url") || undefined
  const app = useApp(url)
  const App = app?.Entry

  if (!host) {
    return null
  }
  const rpc = getApi()

  return App && <App db={rpc} />
}

export default Sandbox
