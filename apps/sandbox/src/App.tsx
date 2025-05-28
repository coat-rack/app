import { usePromise } from "@coat-rack/core/async"
import {
  createMessageChannelForChild,
  getParentOriginForChild,
} from "@coat-rack/core/messaging"
import { useMemo } from "react"
import { Sandbox } from "./Sandbox"

export function App() {
  const parentOrigin = getParentOriginForChild(window.location)

  if (!parentOrigin) {
    throw "Unable to determine host origin"
  }

  const channelPromise = useMemo(
    () => createMessageChannelForChild(parentOrigin),
    [parentOrigin],
  )
  const [channel] = usePromise(() => channelPromise, [])

  if (!channel) {
    return
  }

  return <Sandbox channel={channel} />
}
