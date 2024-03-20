import { useApp } from "./dynamic"

function Sandbox() {
  const url =
    new URLSearchParams(window.location.search).get("url") || undefined
  const app = useApp(url)
  const App = app?.Entry

  return App && <App />
}

export default Sandbox
