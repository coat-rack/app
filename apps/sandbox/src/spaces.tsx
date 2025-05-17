import {
  SharedChannel,
  SpacesMessage,
  SpacesRequestMessage,
  useMessageChannel,
} from "@coat-rack/core/messaging"
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

  useMessageChannel<SpacesMessage>(
    "meta.spaces",
    (message) => setSpaces(message),
    port,
  )
  return spaces
}
