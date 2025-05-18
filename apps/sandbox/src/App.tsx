import { usePromise } from "@coat-rack/core/async"
import { createMessageChannelForChild } from "@coat-rack/core/messaging"
import { useMemo } from "react"
import { Sandbox } from "./Sandbox"

export function App() {
  const channelPromise = useMemo(() => createMessageChannelForChild(), [])
  const [channel] = usePromise(() => channelPromise, [])

  if (!channel) {
    return
  }

  return <Sandbox channel={channel} />
}
