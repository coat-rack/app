import { RefObject, useEffect } from "react"
import { usePromise } from "./async"
import { Space } from "./models"

/**
 * Base message type for communication across IFrame boundary between web and sandbox
 */
export interface IFrameMessage<Scope extends string, Type extends string> {
  type: `${Scope}.${Type}`
}

/**
 * Sent from Web to Sandbox to initialize the message channel for further communication
 */
interface InitializeChannelMessage extends IFrameMessage<"channel", "init"> {
  port: MessagePort
}

/**
 * Sent from Sandbox to Web to indicate that message channel has been established successfully
 */
type InitializeChannelSuccessMessage = IFrameMessage<"channel", "init-success">

export type SpacesRequestMessage = IFrameMessage<"meta", "spaces-request">

export interface SpacesMessage extends IFrameMessage<"meta", "spaces"> {
  active?: Space
  all: Space[]
  filtered: boolean
}

// TODO: make this work with the new message types since we don't expose the raw iframe message
export function isOfMessageType<T extends IFrameMessage<string, string>>(
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

export function useMessageChannelForParent(
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

export function useMessageChannelForChild() {
  const [port] = usePromise(() => createMessageChannelForChild(), [])

  return port
}

export function useMessageChannel<T extends IFrameMessage<string, string>>(
  type: T["type"],
  listener: (
    message: T,
    reply: (message: IFrameMessage<string, string>) => void,
  ) => void,
  port?: SharedChannel,
) {
  useEffect(() => {
    if (!port) {
      return
    }

    port.subscribe(type, listener)

    return () => port.unsubscribe(type, listener)

    // return port.removeEventListener("message", listener)
  }, [port, listener])
}

type Subscriber<
  T extends IFrameMessage<string, string> = IFrameMessage<string, string>,
> = (ev: T, reply: (message: IFrameMessage<string, string>) => void) => void

/**
 * MessagePort doesn't work well with multiple subscribers.
 * This makes it possible for us to share a port and manage subscribers on our own.
 */
export class SharedChannel {
  subscribers: Record<string, Subscriber[]> = {}

  constructor(
    private readonly port: MessagePort,
    private readonly name: string,
  ) {
    port.onmessage = (ev) => {
      this.onMessage(ev)
    }
  }

  private onMessage(ev: MessageEvent<unknown>) {
    console.debug(`CHANNEL ${this.name} GOT`, ev.data)
    const data = ev.data as IFrameMessage<string, string> | undefined
    const type = data?.type

    if (!type) {
      return
    }

    const subscribers = this.subscribers[type] || []

    const reply = (message: IFrameMessage<string, string>) =>
      this.postMessage(message)

    for (const subscriber of subscribers) {
      subscriber(data, reply)
    }
  }

  subscribe<T extends IFrameMessage<string, string>>(
    type: T["type"],
    subscriber: Subscriber<T>,
  ) {
    const subscribers = this.subscribers[type] || []
    subscribers.push(subscriber as Subscriber)

    this.subscribers[type] = subscribers
  }

  unsubscribe<T extends IFrameMessage<string, string>>(
    type: T["type"],
    subscriber: Subscriber<T>,
  ) {
    const subscribers = this.subscribers[type] || []

    this.subscribers[type] = subscribers.filter((s) => s !== subscriber)
  }

  postMessage<T extends IFrameMessage<string, string>>(message: T) {
    console.debug(`CHANNEL ${this.name} SEND`, message)
    this.port.postMessage(message)
  }
}
