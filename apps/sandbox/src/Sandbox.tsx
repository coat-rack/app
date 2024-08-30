import { RpcResponse } from "@repo/data/rpc"
import { Db } from "@repo/sdk"
import { useApp } from "./dynamic"

const api: Db = {
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

function guidGenerator() {
  if (window.isSecureContext) {
    return crypto.randomUUID()
  }

  return new Date().valueOf()
}

const getApi = () => {
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

  return constructRpcProxy(api)
}

const MANIFEST_FILE = "manifest.json"
const INDEX_FILE = "index.mjs"

function getAppUrlsFromQueryString() {
  const queryString = new URLSearchParams(window.location.search)
  const appUrl = queryString.get("appUrl")

  if (!appUrl) {
    throw new Error("App URL is not defined")
  }

  const baseUrl = new URL(appUrl)

  const manifestUrl = new URL(MANIFEST_FILE, baseUrl)
  const indexUrl = new URL(INDEX_FILE, baseUrl)

  return [indexUrl, manifestUrl]
}

function Sandbox() {
  const [appUrl, manifestUrl] = getAppUrlsFromQueryString()
  const [{ app }, error] = useApp(appUrl, manifestUrl)
  const App = app?.Entry

  if (error) {
    return (
      <div>
        <h1>Error Loading App</h1>
        <p>
          <code>{`${JSON.stringify(error, null, 2)}`}</code>
        </p>
      </div>
    )
  }

  const rpc = getApi()

  return App && <App db={rpc} />
}

export default Sandbox
