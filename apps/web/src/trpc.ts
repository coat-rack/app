import {
  createTRPCClient,
  createTRPCReact,
  httpBatchLink,
} from "@trpc/react-query"

import type { AppRouter } from "server/src/types"

const config = {
  links: [
    httpBatchLink({
      url: "http://localhost:3000",
      // We can add additional things like auth headers, etc. here
    }),
  ],
}

export const trpcReact = createTRPCReact<AppRouter>()
export const trpcReactClient = trpcReact.createClient(config)

export const trpcClient = createTRPCClient<AppRouter>(config)
