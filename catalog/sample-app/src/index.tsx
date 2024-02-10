import { App } from "@repo/sdk"

export const SampleApp: App = {
  name: "my-sample-app",
  Entry: () => {
    return <h1>I am rendered from an app in the sample catalog</h1>
  },
}

export default SampleApp
