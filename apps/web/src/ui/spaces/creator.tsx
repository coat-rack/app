import { Space, User } from "@coat-rack/core/models"
import { Plus } from "@coat-rack/icons/regular"
import { getSpaceStyles } from "@coat-rack/sdk"
import { Button } from "@coat-rack/ui/components/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@coat-rack/ui/components/dialog"
import { useState } from "react"
import { SpaceForm, randomColor } from "./form"

export function SpaceCreator({
  onSubmit,
  appUsers,
  user,
}: {
  onSubmit: (space: Space) => void
  appUsers: User[]
  user: string
}) {
  const [changed, setChanged] = useState(false)
  const [space, setSpace] = useState<Space>({
    id: "space-" + Date.now().toString(),
    type: "space",
    spaceType: "shared",
    name: "",
    owner: user,
    timestamp: Date.now(),
    users: [user],
    color: randomColor(),
  })

  const isValid = space.color && space.name

  const handleSubmit = () => {
    if (!isValid) {
      return
    }

    onSubmit(space)
    setChanged(false)
  }

  const handleChange = (space: Space) => {
    setSpace(space)
    setChanged(true)
  }

  const spaceStyles= getSpaceStyles(space)

  return (
    <>
      <Dialog>
        <div className="flex flex-row items-center gap-2">
          <DialogTrigger asChild>
            <Button variant="link" className="flex flex-row items-center gap-2">
              create space
              <Plus className="h-4 w-4 fill-current" />
            </Button>
          </DialogTrigger>
        </div>
        <DialogContent style={spaceStyles}>
            <DialogHeader>
              <DialogTitle className="text-primary">
                create {space.name || "new space"}
              </DialogTitle>
              <DialogDescription>create a new shared space</DialogDescription>
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
                create
                <Plus className="h-4 w-4 fill-current" />
              </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
