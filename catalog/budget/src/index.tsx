import { App, ProvideAppContext } from "@coat-rack/sdk"

import { createRouter, RouterProvider } from "@tanstack/react-router"
import { DbTypes } from "./models"
import { routeTree } from "./routeTree.gen"
import "./styles.css"

const router = createRouter({ routeTree })
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router
  }
}

export const BudgetApp: App<DbTypes> = {
  /**
   *  The Entrypoint for the app
   */
  Entry: ({ context }) => {
    return (
      <ProvideAppContext {...context}>
        <RouterProvider router={router} context={context}></RouterProvider>
      </ProvideAppContext>
    )
  },
}

export default BudgetApp
