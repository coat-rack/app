import { ChannelMessage } from "./messsage"

export type Subscriber<T extends ChannelMessage = ChannelMessage> = (
  ev: T,
  reply: (message: ChannelMessage) => void,
) => void
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
    const data = ev.data as ChannelMessage | undefined
    const type = data?.type

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
