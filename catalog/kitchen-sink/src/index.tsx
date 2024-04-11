import { App } from "@repo/sdk"
import { Button } from "@repo/ui/components/button"
import { Label } from "@repo/ui/components/label"
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/radio-group"
import "./styles.css"

export const Tasks: App = {
  /**
   * Name of the app
   */
  name: "kitchen-sink",
  /**
   *  The Entrypoint for the app
   */
  Entry: () => {
    return (
      <div className="flex flex-col gap-6 p-4">
        <div className="flex flex-col gap-4">
          <h1>Button</h1>

          <div className="flex flex-row gap-2">
            <Button variant="default">Click Me</Button>
            <Button variant="secondary">Click Me</Button>
            <Button variant="link">Click Me</Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h1>Radio Group</h1>

          <div className="flex flex-row gap-2">
            <RadioGroup defaultValue="option-one">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-one" id="option-one" />
                <Label htmlFor="option-one">Option One</Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-two" id="option-two" />
                <Label htmlFor="option-two">Option Two</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </div>
    )
  },
}

export default Tasks
