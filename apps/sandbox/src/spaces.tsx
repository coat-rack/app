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
    channel.postMessage({
      type: "meta.spaces",
    } satisfies SpacesRequestMessage)
  }, [])

  // useChannelSubscription<SpacesResponseMessage>(
  //   channel,
  //   "meta.spaces-response",
  //   (message) => {
  //     setSpaces(message)},
  // )

  useEffect(() => {
    channel.subscribe<SpacesResponseMessage>(
      "meta.spaces-response",
      (message) => setSpaces(message),
    )

    channel.subscribe<SpacesResponseMessage>(
      "meta.spaces-response",
      (message) => console.log("got message", message),
    )
    channel.subscribe<SpacesRequestMessage>("meta.spaces", (message) =>
      console.log("got message", message),
    )
  }, [])

  return spaces
}
