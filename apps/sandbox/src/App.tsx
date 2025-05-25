import { usePromise } from "@coat-rack/core/async"
import { createMessageChannelForChild } from "@coat-rack/core/messaging"
import { HostOriginQueryParam } from "@coat-rack/core/rpc"
import { useMemo } from "react"
import { Sandbox } from "./Sandbox"

export function App() {
  const channelPromise = useMemo(() => {
    const search = new URLSearchParams(window.location.search)
    const hostOrigin = search.get(HostOriginQueryParam)
    if (!hostOrigin) {
      throw "Unable to determine host origin"
    }
    return createMessageChannelForChild(hostOrigin)
  }, [])
  const [channel] = usePromise(() => channelPromise, [])

  if (!channel) {
    return
  }

  return <Sandbox channel={channel} />
}
