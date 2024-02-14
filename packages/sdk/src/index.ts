import React from "react"

export interface App {
  /**
   * Name of the app
   */
  name: string
  /**
   *  The Entrypoint for the app
   */
  Entry: React.ComponentType
}
