import { IFrameMessage } from "@repo/data/messaging"
import { useWindowEvent } from "./event"

export const useIFrameMessage = <T extends IFrameMessage<string, string>>(
  type: T["type"],
  onMessage: (message: T) => void,
) =>
  useWindowEvent("message", (ev: MessageEvent<T>) => {
    if (ev.data?.type !== type) {
      return
    }

    onMessage(ev.data)
  })
