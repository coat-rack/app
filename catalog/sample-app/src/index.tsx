import { App } from "@repo/sdk"

import "./styles.css"

export const SampleApp: App = {
  name: "my-sample-app",
  Entry: () => {
    return (
      <h1 className="bg-red-500">
        I am rendered from an app in the sample catalog
      </h1>
    )
  },
}

export default SampleApp
