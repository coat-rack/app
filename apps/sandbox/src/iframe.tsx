import { IFrameMessage } from "@repo/data/messaging"
import { useEffect } from "react"

export const useIFrameMessage = <T extends IFrameMessage<string, string>>(
  type: T["type"],
  onMessage: (message: T) => void,
) =>
  useEffect(() => {
    const listener = (ev: MessageEvent<T>) => {
      if (ev.data?.type !== type) {
        return
      }

      onMessage(ev.data)
    }

    window.addEventListener("message", listener)

    return () => window.removeEventListener("message", listener)
  })
