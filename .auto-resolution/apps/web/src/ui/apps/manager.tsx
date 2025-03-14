import { useActiveSpace } from "@/db/local"
import { App } from "@coat-rack/core/models"
import { Pencil } from "@coat-rack/icons/regular"
import { getSpaceStyles } from "@coat-rack/sdk"
import { Button } from "@coat-rack/ui/components/button"
import { Checkbox } from "@coat-rack/ui/components/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@coat-rack/ui/components/dialog"
import { Label } from "@coat-rack/ui/components/label"

export function AppManager({
  app,
  setDevMode,
}: {
  app: App
  setDevMode: (devMode: boolean) => void
}) {
  const space = useActiveSpace()

  const spaceStyles = getSpaceStyles(space)

  return (
    <Dialog>
      <div className="flex flex-row items-center gap-2">
        <DialogTrigger asChild>
          <Button
            variant="link"
            className="flex flex-row items-center gap-2 p-0"
            title={"edit app " + app.id}
          >
            <Pencil className="h-4 w-4 fill-current" />
            {app.id}
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent style={spaceStyles}>
        <DialogHeader>
          <DialogTitle className="text-primary">{app.id}</DialogTitle>
          <DialogDescription>view and update app details</DialogDescription>
          <DialogDescription>{app.installURL}</DialogDescription>
        </DialogHeader>

        <DialogFooter className="mt-4 flex flex-col gap-4">
          <div className="flex flex-row items-center justify-start gap-2">
            <Checkbox
              name="dev-mode"
              checked={app.devMode || false}
              onCheckedChange={() => setDevMode(!app.devMode)}
            />
            <Label htmlFor="dev-mode">is dev mode</Label>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
