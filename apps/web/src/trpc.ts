import {
  createTRPCClient,
  createTRPCReact,
  httpBatchLink,
  loggerLink,
} from "@trpc/react-query"

import type { AppRouter } from "server/src/types"

const config = {
  links: [
    loggerLink(),
    httpBatchLink({
      url: import.meta.env.VITE_SERVER_URL,
      // We can add additional things like auth headers, etc. here
    }),
  ],
}

export const trpcReact = createTRPCReact<AppRouter>()
export const trpcReactClient = trpcReact.createClient(config)

export const trpcClient = createTRPCClient<AppRouter>(config)
