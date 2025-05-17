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
 * Sent from Sandbox to Web to indicate that message channel has been established successfully
 */
export type InitializeChannelSuccessMessage = ChannelMessage<
  "channel",
  "init-success"
>

export type SpacesRequestMessage = ChannelMessage<"meta", "spaces-request">

export interface SpacesMessage extends ChannelMessage<"meta", "spaces"> {
  active?: Space
  all: Space[]
  filtered: boolean
}
