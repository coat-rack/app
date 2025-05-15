import {
  createTRPCClient,
  createTRPCReact,
  httpBatchLink,
  loggerLink,
} from "@trpc/react-query"

import type { AppRouter } from "@coat-rack/server/src/types"

function getServerUrl() {
  const url = new URL(window.location.toString())
  url.port = import.meta.env.VITE_SERVER_PORT
  url.pathname = ""
  return url
}
const config = {
  links: [
    loggerLink(),
    httpBatchLink({
      url: getServerUrl(),
      // We can add additional things like auth headers, etc. here
    }),
  ],
}

export const trpcReact = createTRPCReact<AppRouter>()
export const trpcReactClient = trpcReact.createClient(config)

export const trpcClient = createTRPCClient<AppRouter>(config)
