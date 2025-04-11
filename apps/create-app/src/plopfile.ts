import { NodePlopAPI } from "plop"

export default function (plop: NodePlopAPI) {
  plop.setActionType("create-app", (answers) => {
    return JSON.stringify(answers)
  })

  plop.setGenerator("create-app", {
    actions: [
      {
        type: "create-app",
      },
    ],
    prompts: [
      {
        type: "input",
        name: "name",
      },
    ],
  })
}
