import { Db, RpcResponse } from "@repo/sdk"
import { useEffect } from "react"
import { useApp } from "./dynamic"

const api: Db = {
  get(_type, _key) {
    return new Promise((_resolve, reject) => reject("Not connected to host!"))
  },
  upsert(_type, _value) {
    return new Promise((_resolve, reject) => reject("Not connected to host!"))
  },
  delete(_type, _key) {
    return new Promise((_resolve, reject) => reject("Not connected to host!"))
  },
  query(_type, _query) {
    return new Promise((_resolve, reject) => reject("Not connected to host!"))
  },
}

function guidGenerator() {
  if (window.isSecureContext) {
    return crypto.randomUUID()
  }

  // https://stackoverflow.com/a/6860916/1492861
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  )
}

const useRpc = () => {
  const queryString = new URLSearchParams(window.location.search)
  const host = queryString.get("host") || undefined
  if (!host) {
    throw new Error("Couldn't determine host origin")
  }

  const rpcHost: (message: Object) => Promise<unknown> = (message) => {
    return new Promise((resolve, _reject) => {
      const requestId = guidGenerator()
      const handler = (event: MessageEvent<RpcResponse<unknown>>) => {
        if (event.origin != host || event.data.requestId != requestId) {
          return
        }
        window.removeEventListener("message", handler)
        resolve(event.data.value)
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

  useEffect(() => {
    const rpc = useRpc()

    rpc.get("notes", "1").then((val) => {
      console.log("get returned", val)
    })

    rpc
      .upsert("notes", {
        id: "1",
        content: "",
        space: "",
        type: "note",
        title: "",
        timestamp: new Date().valueOf(),
      })
      .then((val) => {
        console.log("upsert returned", val)
      })

    rpc
      .query("notes", {
        id: "1",
      })
      .then((val) => {
        console.log("query returned", val)
      })

    rpc.delete("notes", "1").then(() => {
      console.log("delete returned")
    })
  }, [])

  return App && <App />
}

export default Sandbox
