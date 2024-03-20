import { useEffect } from "react"
import { useApp } from "./dynamic"

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
      console.log("sandbox: got message", event.data)
    }
    window.addEventListener("message", handler)

    return () => window.removeEventListener("message", handler)
  }, [])

  if (!host) {
    return null
  }

  window.parent?.postMessage({ testing: 123 }, host)

  return App && <App />
}

export default Sandbox
