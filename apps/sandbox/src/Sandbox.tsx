import { getAppUrlsFromQueryString, useApp } from "./dynamic"

import { getRpcDb } from "./rpc"
import { useSpaces } from "./spaces"

function Sandbox() {

  const query = new URLSearchParams(window.location.search)
  const [appUrl, manifestUrl] = getAppUrlsFromQueryString(query)
  const [{ app }, error] = useApp(appUrl, manifestUrl)
  const spaces = useSpaces()
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

  const rpc = getRpcDb()

  return App && <App db={rpc} spaces={spaces} />
}

export default Sandbox
