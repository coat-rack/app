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

type RpcResponseShape<I> = {
  [K in keyof I]: I[K] extends Fn
    ? RpcMessage & {
        op: K
        value: Awaited<ReturnType<I[K]>>
      }
    : never
}

export type RpcResponse<I, K extends keyof I = keyof I> = RpcResponseShape<I>[K]
