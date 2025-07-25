import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { RouterProvider, createRouter } from "@tanstack/react-router"
import { LoggedInContextProvider } from "./logged-in-context"
import { routeTree } from "./routeTree.gen"
import { trpcReact, trpcReactClient } from "./trpc"

const queryClient = new QueryClient()
// Import the generated route tree

// Create a new router instance
const router = createRouter({
  routeTree,
  /** Currently the route will be loaded on hover but when supported we should
   * be able to upgrade this to preload when in the viewport
   *
   * https://tanstack.com/router/v1/docs/framework/react/guide/preloading
   */
  defaultPreload: "intent",
})

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
        <LoggedInContextProvider>
          <RouterProvider router={router} />
        </LoggedInContextProvider>
      </QueryClientProvider>
    </trpcReact.Provider>
  )
}

export default App
