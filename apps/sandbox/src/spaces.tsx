import { useChannelSubscription } from "@coat-rack/core/messaging"
import {
  SpacesRequestMessage,
  SpacesResponseMessage,
} from "@coat-rack/core/messsage"
import { SharedChannel } from "@coat-rack/core/shared-channel"
import { useEffect, useState } from "react"

/**
 * Spaces are communicated as updates via the host using the `meta.spaces` update
 */
export const useSpacesMeta = (channel: SharedChannel) => {
  const [spaces, setSpaces] = useState<SpacesResponseMessage>()

  useEffect(() => {
    if (!channel) {
      return
    }

    channel.postMessage({
      type: "meta.spaces",
    } satisfies SpacesRequestMessage)
  }, [channel])

  useChannelSubscription<SpacesResponseMessage>(
    channel,
    "meta.spaces-response",
    (message) => setSpaces(message),
  )
  return spaces
}
