import { usePromise } from "@coat-rack/core/async"
import { createMessageChannelForChild } from "@coat-rack/core/messaging"
import { HOST_ORIGIN } from "@coat-rack/core/rpc"
import { useMemo } from "react"
import { Sandbox } from "./Sandbox"

export function App() {
  const search = new URLSearchParams(window.location.search)
  const hostOrigin = search.get(HOST_ORIGIN)
  if (!hostOrigin) {
    throw "Unable to determine host origin"
  }

  const hostOriginUrl = new URL(hostOrigin)

  const channelPromise = useMemo(
    () => createMessageChannelForChild(hostOriginUrl),
    [hostOriginUrl],
  )
  const [channel] = usePromise(() => channelPromise, [])

  if (!channel) {
    return
  }

  return <Sandbox channel={channel} />
}