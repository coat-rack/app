import { SharedChannel } from "@coat-rack/core/shared-channel"
import { AppContext } from "@coat-rack/sdk"
import { getAppUrlsFromQueryString, useApp } from "./dynamic"
import { getRpcDb } from "./rpc"
import { useSpacesMeta } from "./spaces"

interface Props {
  channel: SharedChannel
}

export function Sandbox({ channel }: Props) {
  const query = new URLSearchParams(window.location.search)
  const [appUrl, manifestUrl] = getAppUrlsFromQueryString(query)

  const [{ app }, error] = useApp(appUrl, manifestUrl)
  const App = app?.Entry

  const spaces = useSpacesMeta(channel)
  const db = getRpcDb(channel)

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

  const isLoaded = App && spaces

  if (!isLoaded) {
    return
  }

  const context: AppContext = {
    db,
    activeSpace: spaces.active,
    spaces: spaces.all,
  }

  // ideally we would want to wrap this with `ProvideAppContext` so apps don't
  // need to do that, but that doesn't seem to work. maybe it can be done using
  // React.lazy and suspense but that would need quite a bit of refactoring on
  // the app-loading side of things
  return <App context={context} />
}
