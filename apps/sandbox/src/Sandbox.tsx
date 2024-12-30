import { AppContext } from "@repo/sdk"
import { getAppUrlsFromQueryString, useApp } from "./dynamic"
import { getRpcDb } from "./rpc"
import { useSpacesMeta } from "./spaces"

function Sandbox() {
  const query = new URLSearchParams(window.location.search)
  const [appUrl, manifestUrl] = getAppUrlsFromQueryString(query)

  const [{ app }, error] = useApp(appUrl, manifestUrl)
  const App = app?.Entry

  const spaces = useSpacesMeta()
  const db = getRpcDb()

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

  if (!App) {
    return
  }

  const context: AppContext = {
    db,
    activeSpace: spaces.active,
    spaces: spaces.all,
  }

  // It may also be useful to create a DB context here so apps aren't dependant
  // on being injected with this directly
  return <App {...context} />
}

export default Sandbox
