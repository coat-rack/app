type RpcMessage = {
  requestId: string
}

type Fn = (...args: any[]) => any

type RpcRequestShape<I> = {
  [K in keyof I]: I[K] extends Fn
    ? RpcMessage & {
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
export type Err<E = Error> = {
  ok: false
  error: E
}
export type Result<T, E = Error> = Ok<T> | Err<E>

export function ok<T>(value?: T): Ok<T> {
  return { ok: true, value }
}
export function err<E = Error>(error: E) {
  return { ok: false, error }
}

type RpcResponseShape<I> = {
  [K in keyof I]: I[K] extends Fn
    ? RpcMessage & {
        op: K
        result: Result<Awaited<ReturnType<I[K]>>>
      }
    : never
}

export type RpcResponse<I, K extends keyof I = keyof I> = RpcResponseShape<I>[K]
