import { Space } from "./models"

/**
 * Base message type for communication across IFrame boundary between web and sandbox
 */
export interface IFrameMessage<Scope extends string, Type extends string> {
  type: `${Scope}.${Type}`
}

/**
 * Sent from Sandbox to Web, to initialize IFrame source for further communication
 */
export type HandshakeSandboxMessage = IFrameMessage<"meta", "handshake">

export interface SpacesMessage extends IFrameMessage<"meta", "spaces"> {
  active?: Space
  all: Space[]
  filtered: boolean
}

export function isOfMessageType<T extends IFrameMessage<string, string>>(
  type: T["type"],
  message: MessageEvent<unknown>,
): message is MessageEvent<T> {
  const data = message.data as T | undefined
  return data?.type === type
}
