import { ChannelMessage } from "./messsage"

type RpcMessage = {
  requestId: string
}

type RpcResponseMessage = RpcMessage & ChannelMessage<"rpc", "response">
type RpcRequestMessage = RpcMessage & ChannelMessage<"rpc", "request">

type Fn = (...args: any[]) => any

type RpcRequestShape<I> = {
  [K in keyof I]: I[K] extends Fn
    ? RpcRequestMessage & {
        op: K
        args: Parameters<I[K]>
      }
    : never
}
export type RpcRequest<I, K extends keyof I = keyof I> = RpcRequestShape<I>[K]
export type Ok<T> = {
  ok: true
  value?: T
}
export type Err<E> = {
  ok: false
  error: E
}
export type Result<T, E> = Ok<T> | Err<E>

export function ok<T>(value?: T): Ok<T> {
  return { ok: true, value }
}
export function err<E>(error: E) {
  return { ok: false, error }
}

type RpcResponseShape<I> = {
  [K in keyof I]: I[K] extends Fn
    ? RpcResponseMessage & {
        op: K
        result: Result<Awaited<ReturnType<I[K]>>, unknown>
      }
    : never
}

export type RpcResponse<I, K extends keyof I = keyof I> = RpcResponseShape<I>[K]

export const HOST_ORIGIN = "hostOrigin"
