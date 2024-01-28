import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { trpcReact, trpcReactClient } from "./trpc"

import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import { RouterProvider, createRouter } from "@tanstack/react-router"
import { routeTree } from "./routeTree.gen"

const queryClient = new QueryClient()
// Import the generated route tree

// Create a new router instance
const router = createRouter({ routeTree })

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

function App() {
  return (
    <trpcReact.Provider client={trpcReactClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools />
      </QueryClientProvider>
    </trpcReact.Provider>
  )
}

export default App
