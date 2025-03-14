import { useActiveSpace } from "@/db/local"
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
import { Input } from "@coat-rack/ui/components/input"
import { Label } from "@coat-rack/ui/components/label"
import { useState } from "react"

export function AppInstaller({
  onSubmit,
}: {
  onSubmit: (url: string) => void
}) {
  const space = useActiveSpace()
  const [url, setUrl] = useState("")

  const spaceStyles = getSpaceStyles(space)

  const handleSubmit = async () => {
    onSubmit(url)
    setUrl("")
  }

  return (
    <Dialog>
      <div className="flex flex-row items-center gap-2">
        <DialogTrigger asChild>
          <Button variant="link" className="flex flex-row items-center gap-2">
            install app
            <Plus className="h-4 w-4 fill-current" />
          </Button>
        </DialogTrigger>
      </div>
      <DialogContent style={spaceStyles}>
        <DialogHeader>
          <DialogTitle className="text-primary">install an app</DialogTitle>
          <DialogDescription>install a coat rack app</DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSubmit()
          }}
        >
          <Label htmlFor="url">app url</Label>
          <Input
            name="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </form>

        <DialogFooter className="mt-4">
          <Button
            disabled={!url}
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
  )
}
