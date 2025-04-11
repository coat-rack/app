import { App } from "@coat-rack/sdk"
import { Button } from "@coat-rack/ui/components/button"

import "./styles.css"

export const SampleApp: App = {
  /**
   *  The Entrypoint for the app
   */
  Entry: ({ context }) => {
    const { db, activeSpace } = context
    if (!activeSpace) {
      return <h1>Space loading</h1>
    }

    return (
      <>
        <h1>Hello sample-app</h1>
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
            db.update("", activeSpace.id, { something: "really cool" }).then(
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
