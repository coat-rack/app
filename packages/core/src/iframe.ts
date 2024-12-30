import { useWindowEvent } from "./event"
import { IFrameMessage } from "./messaging"

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
