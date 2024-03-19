import { App } from "@repo/sdk"
import { Button } from "@repo/ui/components/button"

import "./styles.css"  

export const SampleApp: App = {
  /**
   * Name of the app
   */
  name: "sample-app",
  /**
   *  The Entrypoint for the app
   */
  Entry: () => {
    return (<>
        <h1 className="bg-red-500">Hello sample-app</h1>
        <Button>Click Me</Button>
      </>
    )
  },
}

export default SampleApp 
