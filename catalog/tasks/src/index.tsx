import { App } from "@repo/sdk"
import "./styles.css"
import { Button } from "@repo/ui/components/button"

export const Tasks: App = {
  /**
   * Name of the app
   */
  name: "tasks",
  /**
   *  The Entrypoint for the app
   */
  Entry: () => {
    return (
      <>
      <h1 className="bg-purple-500 text-white transition-all hover:text-green-500 hover:underline">
        Hello Tasks
      </h1>
      
      <Button>Click Me</Button>
      </>
    )
  },
}

export default Tasks
