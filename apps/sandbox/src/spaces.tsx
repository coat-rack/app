import { useChannelSubscription } from "@coat-rack/core/messaging"
import { SpacesMessage, SpacesRequestMessage } from "@coat-rack/core/messsage"
import { SharedChannel } from "@coat-rack/core/shared-channel"
import { useEffect, useState } from "react"

/**
 * Spaces are communicated as updates via the host using the `meta.spaces` update
 */
export const useSpacesMeta = (port?: SharedChannel) => {
  const [spaces, setSpaces] = useState<SpacesMessage>()

  useEffect(() => {
    if (!port) {
      return
    }

    port.postMessage({
      type: "meta.spaces-request",
    } satisfies SpacesRequestMessage)
  }, [port])

  useChannelSubscription<SpacesMessage>(
    "meta.spaces",
    (message) => setSpaces(message),
    port,
  )
  return spaces
}
