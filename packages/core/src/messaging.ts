import { RefObject, useEffect } from "react"
import { usePromise } from "./async"
import {
  ChannelMessage,
  InitializeChannelMessage,
  InitializeChannelSuccessMessage,
} from "./messsage"
import { SharedChannel } from "./shared-channel"

export function isOfMessageType<T extends ChannelMessage>(
  type: T["type"],
  message: MessageEvent<unknown>,
): message is MessageEvent<T> {
  const data = message.data as T | undefined
  return data?.type === type
}

export async function createMessageChannelForParent(
  iframe: HTMLIFrameElement,
  origin = "*",
): Promise<SharedChannel> {
  const channel = new MessageChannel()
  const parentPort = channel.port1

  // port2 will be transferred once sent and cannot be used by the parent
  const iframePort = channel.port2

  const contentWindow = iframe.contentWindow

  if (!contentWindow) {
    throw new Error(
      "iframe contentWindow must be defined when creating message channel",
    )
  }

  return new Promise<SharedChannel>((resolve) => {
    parentPort.onmessage = (ev: MessageEvent<unknown>) => {
      if (
        isOfMessageType<InitializeChannelSuccessMessage>(
          "channel.init-success",
          ev,
        )
      ) {
        resolve(new SharedChannel(parentPort, "parent"))
      }
    }

    contentWindow.postMessage(
      {
        type: "channel.init",
        port: iframePort,
      } satisfies InitializeChannelMessage,
      origin,
      [iframePort],
    )
  })
}

export async function createMessageChannelForChild(): Promise<SharedChannel> {
  return new Promise<SharedChannel>((resolve) => {
    const listener = (ev: MessageEvent<unknown>) => {
      if (isOfMessageType<InitializeChannelMessage>("channel.init", ev)) {
        const port = ev.data.port

        port.postMessage({
          type: "channel.init-success",
        } satisfies InitializeChannelSuccessMessage)

        window.removeEventListener("message", listener)

        resolve(new SharedChannel(port, "child"))
      }
    }

    window.addEventListener("message", listener)
  })
}

export function useChannelForParent(
  ref: RefObject<HTMLIFrameElement>,
  loaded: boolean,
) {
  const [port] = usePromise(() => {
    const exec = async () => {
      const iframe = ref.current
      if (iframe) {
        return await createMessageChannelForParent(iframe)
      }
    }

    return exec()
  }, [ref.current, loaded])

  return port
}

export function useChannelForChild() {
  const [port] = usePromise(() => createMessageChannelForChild(), [])

  return port
}

export function useChannelSubscription<T extends ChannelMessage>(
  type: T["type"],
  listener: (message: T, reply: (message: ChannelMessage) => void) => void,
  port?: SharedChannel,
) {
  useEffect(() => {
    if (!port) {
      return
    }

    port.subscribe(type, listener)

    return () => port.unsubscribe(type, listener)
  }, [port, listener])
}
