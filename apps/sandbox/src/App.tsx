import { usePromise } from "@coat-rack/core/async"
import { createMessageChannelForChild } from "@coat-rack/core/messaging"
import { Sandbox } from "./Sandbox"

export function App() {
  const [channel] = usePromise(() => createMessageChannelForChild(), [])

  if (!channel) {
    return
  }

  return <Sandbox channel={channel} />
}
