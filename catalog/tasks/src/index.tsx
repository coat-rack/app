import { App } from "@repo/sdk"

export const Tasks: App = {
  /**
   * Name of the app
   */
  name: "tasks",
  /**
   *  The Entrypoint for the app
   */
  Entry: () => {
    return <h1>Hello Tasks</h1>
  },
}

export default Tasks 
