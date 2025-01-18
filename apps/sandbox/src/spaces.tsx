import { useIFrameMessage } from "@repo/core/iframe"
import { SpacesMessage } from "@repo/core/messaging"
import { useState } from "react"

/**
 * Spaces are communicated as updates via the host using the `meta.spaces` update
 */
export const useSpacesMeta = () => {
  const [spaces, setSpaces] = useState<SpacesMessage>({
    type: "meta.spaces",
    filtered: false,
    all: [],
  })

  useIFrameMessage<SpacesMessage>("meta.spaces", setSpaces)

  return spaces
}
