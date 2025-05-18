import { ChannelMessage } from "./messsage"

export type Subscriber<T extends ChannelMessage = ChannelMessage> = (
  ev: T,
  reply: (message: ChannelMessage) => void,
) => void

/**
 * Provides small wrapper around [MessagePort](https://developer.mozilla.org/en-US/docs/Web/API/MessagePort)
 * to handle the following pitfalls/usecases
 *
 * - Subscribers don't need to `port.start()` when using `addEventListener`
 *     - This is important as it can be confusing to manage this and the docs don't really cover it well
 * - Logs debugging info in a centeral place
 * - Provides types and some basic type checking on messages
 * - Makes it easy for subscribers to only handle messages they care about
 */
export class SharedChannel {
  private subscribers: Record<string, Subscriber[]> = {}

  constructor(
    private readonly port: MessagePort,
    private readonly name: string,
  ) {
    // using port.onmessage implies the call to port.start()
    port.onmessage = (ev) => this.onMessage(ev)
  }

  private onMessage(ev: MessageEvent<unknown>) {
    const data = ev.data as ChannelMessage | undefined
    const type = data?.type

    console.debug(
      `CHANNEL ${this.name} GOT for ${
        type && this.subscribers[type]?.length
      } subs`,
      ev.data,
    )

    if (!type) {
      return
    }

    const subscribers = this.subscribers[type] || []

    const reply = (message: ChannelMessage) => this.postMessage(message)

    for (const subscriber of subscribers) {
      subscriber(data, reply)
    }
  }

  subscribe<T extends ChannelMessage>(
    type: T["type"],
    subscriber: Subscriber<T>,
  ) {
    const subscribers = this.subscribers[type] || []
    subscribers.push(subscriber as Subscriber)

    this.subscribers[type] = subscribers
  }

  unsubscribe<T extends ChannelMessage>(
    type: T["type"],
    subscriber: Subscriber<T>,
  ) {
    const subscribers = this.subscribers[type] || []

    this.subscribers[type] = subscribers.filter((s) => s !== subscriber)
  }

  postMessage<T extends ChannelMessage>(message: T) {
    console.debug(`CHANNEL ${this.name} SEND`, message)
    this.port.postMessage(message)
  }
}
