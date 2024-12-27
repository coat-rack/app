import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog"

import { Checkbox } from "@repo/ui/components/checkbox"

import { Label } from "@repo/ui/components/label"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select"

import { Check, Pencil, Plus, Save } from "@repo/icons/regular"
import { Input } from "@repo/ui/components/input"
import { createLazyFileRoute } from "@tanstack/react-router"

import { useObservable } from "@/async"
import { useDatabase } from "@/data"
import { useLocalUser } from "@/db/rxdb"
import { SpaceProvider } from "@/layout"
import { Space, User } from "@repo/data/models"
import { Button } from "@repo/ui/components/button"
import { useEffect, useState } from "react"

export const Route = createLazyFileRoute("/spaces/")({
  component: Index,
})

/**
 * Color palette for primary theme
 */
const COLORS = [
  "#f97316",
  "#eab308",
  "#84cc16",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
  "#d946ef",
  "#ec4899",
]

const randomColor = () => COLORS[Math.floor(Math.random() * COLORS.length)]

function SpaceForm({
  space,
  appUsers,
  onChange,
  onSubmit,
}: {
  space: Space
  appUsers: User[]
  onChange: (space: Space) => void
  onSubmit: () => void
}) {
  const [name, setName] = useState(space.name)
  const [color, setColor] = useState(space.color || "")
  const [users, setUsers] = useState(space.users || [])

  useEffect(() => {
    const updatedSpace: Space = {
      ...space,
      name,
      color,
      users,
    }

    onChange(updatedSpace)
  }, [name, color, users])

  const toggleUser = (user: User, selected: boolean) => {
    if (selected) {
      if (users.includes(user.id)) {
        return
      }

      setUsers([...users, user.id])
    } else {
      setUsers(users.filter((u) => u !== user.id))
    }
  }

  const editableUsers = appUsers.filter((u) => u.id !== space.owner)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
    >
      <Label htmlFor="name">name</Label>
      <Input
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Label htmlFor="color">color</Label>
      <Select name="color" value={color} onValueChange={setColor}>
        <SelectTrigger>
          <SelectValue placeholder="color" />
        </SelectTrigger>
        <SelectContent>
          {COLORS.map((c) => (
            <SelectItem key={c} value={c}>
              <div className="flex flex-row gap-2">
                <div className="h-4 w-4" style={{ backgroundColor: c }} />
                {c}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {space.spaceType === "shared" && (
        <>
          <Label htmlFor="users">users</Label>
          <div className="flex flex-col gap-2">
            {editableUsers.map((u) => (
              <Label
                key={u.id}
                htmlFor={"user-" + u.id}
                className="flex flex-row items-center gap-2"
              >
                <Checkbox
                  name={"user" + u.id}
                  checked={users.includes(u.id)}
                  onCheckedChange={(v) => toggleUser(u, v as boolean)}
                />
                {u.name}
              </Label>
            ))}
          </div>
        </>
      )}
    </form>
  )
}

function SpaceCreator({
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
        <DialogContent>
          <SpaceProvider space={space}>
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
          </SpaceProvider>
        </DialogContent>
      </Dialog>
    </>
  )
}

function SpaceEditor({
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

function Index() {
  const { db } = useDatabase()
  const users = useObservable(db.users.find({}).$)
  const spaces = useObservable(db.spaces.find({}).$)

  const [createKey, setCreateKey] = useState(Date.now())

  const user = useLocalUser()

  const upsertSpace = async (space: Space) => {
    setCreateKey(Date.now())
    await db.spaces.upsert(space)
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="flex flex-row items-center justify-between">
          <h2 className="text-xl">Your Spaces</h2>

          {user && (
            <SpaceCreator
              key={createKey}
              appUsers={users || []}
              user={user}
              onSubmit={upsertSpace}
            />
          )}
        </div>
        <div className="flex flex-col">
          {spaces
            ?.filter((s) => s.owner === user)
            ?.map((space) => (
              <SpaceEditor
                key={space.id}
                space={space._data}
                onSubmit={upsertSpace}
                appUsers={users || []}
              />
            ))}
        </div>

        <div>
          <h2 className="text-xl">Shared Spaces</h2>
          <ol>
            {spaces
              ?.filter((s) => s.owner !== user)
              ?.map((s) => (
                <li key={s.id} style={{ color: s.color }}>
                  {s.name}
                </li>
              ))}
          </ol>
        </div>
      </div>
    </div>
  )
}
