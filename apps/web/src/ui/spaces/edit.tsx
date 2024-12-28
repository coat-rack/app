import { Space, User } from "@repo/data/models"
import { Check, Pencil, Save } from "@repo/icons/regular"
import { Button } from "@repo/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog"
import { useState } from "react"
import { SpaceForm, SpaceProvider } from "./form"

export function SpaceEditor({
  space,
  onSubmit,
  appUsers,
}: {
  space: Space
  onSubmit: (space: Space) => void
  appUsers: User[]
}) {
  const [changed, setChanged] = useState(false)
  const [updated, setUpdated] = useState(space)

  const isValid = updated.color && updated.name

  const handleSubmit = () => {
    if (!isValid) {
      return
    }

    onSubmit(updated)
    setChanged(false)
  }

  const handleChange = (space: Space) => {
    setChanged(true)
    setUpdated(space)
  }

  return (
    <>
      <Dialog>
        <div className="flex flex-row items-center gap-2">
          <DialogTrigger asChild>
            <Button
              style={{
                color: space.color,
              }}
              variant="link"
              className="flex flex-row items-center gap-2 p-0"
              title={"edit space " + space.name}
            >
              <Pencil className="h-4 w-4 fill-current" />
              {space.name}
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent>
          <SpaceProvider space={updated}>
            <DialogHeader>
              <DialogTitle className="text-primary">
                editing {updated.name}
              </DialogTitle>
              <DialogDescription>
                config is shared for all users of the space.
              </DialogDescription>
            </DialogHeader>

            <SpaceForm
              space={space}
              appUsers={appUsers}
              onChange={handleChange}
              onSubmit={handleSubmit}
            />

            <DialogFooter className="mt-4">
              <Button
                disabled={!changed || !isValid}
                variant="default"
                className="flex flex-row items-center gap-2"
                onClick={handleSubmit}
              >
                {changed ? (
                  <>
                    save
                    <Save className="h-4 w-4 fill-current" />
                  </>
                ) : (
                  <>
                    saved
                    <Check className="h-4 w-4 fill-current" />
                  </>
                )}
              </Button>
            </DialogFooter>
          </SpaceProvider>
        </DialogContent>
      </Dialog>
    </>
  )
}
