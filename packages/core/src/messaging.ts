import { DependencyList, useEffect } from "react"
import {
  ChannelMessage,
  HandshakeChannelMessage,
  InitializeChannelMessage,
} from "./messsage"
import { SharedChannel } from "./shared-channel"

const PARENT_ORIGIN = "parentOrigin"

export function isOfMessageType<T extends ChannelMessage>(
  type: T["type"],
  message: MessageEvent<unknown>,
): message is MessageEvent<T> {
  const data = message.data as T | undefined
  return data?.type === type
}

/**
 * > THIS METHOD SHOULD ONLY BE CALLED ONCE PER IFRAME IN ORDER TO ENSURE THAT THE CHILD AND PARENT
 * > CHANNELS REMAIN IN SYNC
 *
 * Creates the `SharedChannel` for the host app. This attaches a `MessagePort` to the
 * `iframe` to enable two-way communication
 *
 * Messages should be queued when using `port.onmessage = ___` which is what the `SharedChannel` does
 * So we should not need to have an initialization process beyond creating the `SharedChannel` and
 * sending the `MessagePort` to the `iframe`
 *
 * > We need to wait for the `iframe` to be loaded however, since `window` events are not queued
 * > which is what is needed to send the intialization message
 *
 * @returns a `SharedChannel` that is used for two-way communication with the `iframe` and `onLoad`
 * which should be called to initalize the iframe once it's been loaded
 *
 * @example
 * ```ts
 * const [channel, onIFrameLoaded] = useMemo(() => createMessageChannelForChild(), [appId])
 * ```
 */
export function createMessageChannelForParent(
  parentOrigin: Location,
  childOrigin: URL,
): [
  iframeSrc: URL,
  channel: SharedChannel,
  onIFrameLoaded: (iframe: HTMLIFrameElement) => void,
] {
  const iframeSrc = new URL(childOrigin)
  iframeSrc.searchParams.set(PARENT_ORIGIN, parentOrigin.origin)

  const messageChannel = new MessageChannel()
  const parentPort = messageChannel.port1

  // port2 will be transferred once sent and cannot be used by the parent
  const iframePort = messageChannel.port2

  const channel = new SharedChannel(parentPort, "parent")

  const onIFrameLoaded = (iframe: HTMLIFrameElement) => {
    const contentWindow = iframe.contentWindow

    if (!contentWindow) {
      throw new Error(
        "iframe contentWindow must be defined when creating message channel",
      )
    }

    const handshakeHandler = (event: MessageEvent) => {
      if (
        event.origin == childOrigin.origin &&
        isOfMessageType<HandshakeChannelMessage>("channel.handshake", event)
      ) {
        contentWindow.postMessage(
          {
            type: "channel.init",
            port: iframePort,
          } satisfies InitializeChannelMessage,
          childOrigin.origin,
          [iframePort],
        )
        window.removeEventListener("message", handshakeHandler)
      }
    }

    window.addEventListener("message", handshakeHandler)
  }

  return [iframeSrc, channel, onIFrameLoaded]
}

export function getParentOriginForChild(location: Location) {
  const search = new URLSearchParams(location.search)
  const parentOrigin = search.get(PARENT_ORIGIN)

  if (!parentOrigin) {
    return undefined
  }

  return new URL(parentOrigin)
}

/**
 * > THIS METHOD SHOULD ONLY BE CALLED ONCE FOR THE LIFETIME OF THE IFRAME TO ENSURE THAT CHANNEL
 * > INSTANCES REMAIN IN SYNC
 *
 * Creates the `SharedChannel` for the `iframe` app. This listens for the `MessagePort`
 * shared by the host app in order to enable two-way communication
 *
 * > This must be called before the host tries to initialize. It will resolve once initialized
 *
 * @returns a `SharedChannel` that is used for two-way communication with the host app
 *
 * @example
 * ```ts
 * const channel = useMemo(() => createMessageChannelForChild(), [])
 * ```
 */
export async function createMessageChannelForChild(
  parentOrigin: URL,
): Promise<SharedChannel> {
  const promise = new Promise<SharedChannel>((resolve) => {
    const listener = (ev: MessageEvent<unknown>) => {
      if (
        ev.origin == parentOrigin.origin &&
        isOfMessageType<InitializeChannelMessage>("channel.init", ev)
      ) {
        const port = ev.data.port

        window.removeEventListener("message", listener)

        resolve(new SharedChannel(port, "child"))
      }
    }

    window.addEventListener("message", listener)
  })

  window.parent.postMessage(
    {
      type: "channel.handshake",
    } satisfies HandshakeChannelMessage,
    parentOrigin.origin,
  )
  return promise
}

export function useChannelSubscription<T extends ChannelMessage>(
  channel: SharedChannel,
  type: T["type"],
  listener: (message: T, reply: (message: ChannelMessage) => void) => void,
  deps: DependencyList = [],
) {
  useEffect(() => {
    channel.subscribe(type, listener)

    return () => channel.unsubscribe(type, listener)
  }, [channel, type, listener, ...deps])
}
