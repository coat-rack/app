import { Space } from "./models"

interface IFrameMessage<Scope extends string, Type extends string> {
  type: `${Scope}.${Type}`
}

// TODO: consolidate this and the RPCResponse in ./rpc.ts
export interface RPCResponseMessage extends IFrameMessage<"rpc", "response"> {
  op: string
  result: unknown
  requestId: string
}

export interface SpacesMessage extends IFrameMessage<"meta", "spaces"> {
  active?: Space
  all: Space[]
  filtered: boolean
}

export type IFrameMessageTypes = RPCResponseMessage | SpacesMessage
