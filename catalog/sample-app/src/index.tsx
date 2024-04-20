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
  Entry: ({ db }) => {
    return (
      <>
        <h1 className="bg-red-500">Hello sample-app</h1>
        <Button
          onClick={() =>
            db.get<any>("1").then(
              (v) => console.log("get", v),
              (err) => console.error(err),
            )
          }
        >
          Get
        </Button>
        <Button
          onClick={() =>
            db.create<any>({ something: "cool" }).then(
              (v) => console.log("create", v),
              (err) => console.error(err),
            )
          }
        >
          Create
        </Button>
        <Button
          onClick={() =>
            db.update("", { something: "really cool" }).then(
              (v) => console.log("update", v),
              (err) => console.error(err),
            )
          }
        >
          Update
        </Button>
        <Button
          onClick={() =>
            db.delete("1").then(
              () => console.log("delete"),
              (err) => console.error(err),
            )
          }
        >
          Delete
        </Button>
        <Button
          onClick={() =>
            db.query<any>({ something: "cool" }).then(
              (v) => console.log(v),
              (err) => console.error(err),
            )
          }
        >
          Query
        </Button>
      </>
    )
  },
}

export default SampleApp
