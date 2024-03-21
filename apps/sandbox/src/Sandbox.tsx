import { useEffect } from "react"
import { useApp } from "./dynamic"

interface ApiCall {
  correlationId: string
  method: string
  args: Array<any>
}

interface ApiResponse<T> {
  correlationId: string
  value: T
}

const toResolve = new Map<string, (val: any) => void>()

function rpcHost<T>(call: ApiCall, host: string): Promise<T> {
  const p = new Promise<T>((resolve, reject) => {
    toResolve.set(call.correlationId, resolve)
  })
  window.parent?.postMessage(call, host)
  return p
}

function Sandbox() {
  const queryString = new URLSearchParams(window.location.search)
  const host = queryString.get("host") || undefined
  const url = queryString.get("url") || undefined
  const app = useApp(url)
  const App = app?.Entry

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (event.origin != host) {
        return
      }

      if (!("correlationId" in event.data && "value" in event.data)) {
        return
      }

      const resolve = toResolve.get(event.data.correlationId)

      if (!resolve) {
        return
      }

      resolve(event.data.value)
      toResolve.delete(event.data.correlationId)
    }
    window.addEventListener("message", handler)

    return () => window.removeEventListener("message", handler)
  }, [])

  if (!host) {
    return null
  }

  rpcHost({ method: "get", args: [1], correlationId: "1" }, host).then((val) =>
    console.log("got rpc response", val),
  )

  return App && <App />
}

export default Sandbox
