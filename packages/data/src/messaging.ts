import { Space } from "./models"

/**
 * Base message type for communication across IFrame boundary between web and sandbox
 */
export interface IFrameMessage<Scope extends string, Type extends string> {
  type: `${Scope}.${Type}`
}

export interface SpacesMessage extends IFrameMessage<"meta", "spaces"> {
  active?: Space
  all: Space[]
  filtered: boolean
}
