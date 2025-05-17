import { Space } from "./models"

/**
 * Base message type for communication across IFrame boundary between web and sandbox
 */

export interface ChannelMessage<
  Scope extends string = string,
  Type extends string = string,
> {
  type: `${Scope}.${Type}`
}

/**
 * Sent from Web to Sandbox to initialize the message channel for further communication
 */
export interface InitializeChannelMessage
  extends ChannelMessage<"channel", "init"> {
  port: MessagePort
}

/**
 * From Sandbox to Web to request ths current spaces-state
 */
export type SpacesRequestMessage = ChannelMessage<"meta", "spaces">

/**
 * From Web to Sandbox to respond with ths current spaces-state
 */
export interface SpacesResponseMessage
  extends ChannelMessage<"meta", "spaces-response"> {
  active?: Space
  all: Space[]
  filtered: boolean
}
