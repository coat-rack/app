import { useApp } from "./dynamic"

function Sandbox() {
  const url = ""
  const app = useApp(url)
  const App = app?.Entry

  return App && <App />
}

export default Sandbox
