import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@repo/ui/components/dialog"


import { Checkbox } from "@repo/ui/components/checkbox"

import { Label } from '@repo/ui/components/label'


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select"

import { Input } from '@repo/ui/components/input'
import { createLazyFileRoute } from "@tanstack/react-router"
import { Pencil, Save } from "@repo/icons/regular"

import { useObservable } from "@/async"
import { useDatabase } from "@/data"
import { Space, User } from "@repo/data/models"
import { Button } from "@repo/ui/components/button"
import { useState } from "react"
import { useLocalUser } from "@/db/rxdb"

export const Route = createLazyFileRoute("/spaces/")({
  component: Index,
})

/**
 * Colour palette for primary theme
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

function SpaceProvider({ space, children }: React.PropsWithChildren<{ space: Space }>) {

  return <div style={{ '--primary': space.color } as React.CSSProperties}>
    {children}
  </div>
}

function SpaceEditor({ space, onSubmit, appUsers, editable }: { space: Space, onSubmit: (space: Space) => void, appUsers: User[], editable: boolean }) {

  console.log(space)

  const [changed, setChanged] = useState(false)
  const [name, setName] = useState(space.name)
  const [color, setColor] = useState(space.color || '')
  const [users, setUsers] = useState(space.users || [])

  const updatedSpace: Space = {
    type: 'space',
    id: space.id,
    owner: space.owner,
    spaceType: space.spaceType,
    timestamp: space.timestamp,
    isDeleted: false,
    name: name.trim() || space.name,
    color: color || space.color,
    users: Array.from(users.values())
  }


  const handleSubmit = () => {
    onSubmit(updatedSpace)
    setChanged(false)
  }

  const toggleUser = (user: User, selected: boolean) => {

    if (selected) {
      if (users.includes(user.id)) {
        return
      }

      setUsers([...users, user.id])
    } else {
      setUsers(users.filter(u => u !== user.id));
    }
  }

  const editableUsers = appUsers.filter(u => u.id !== space.owner)

  const ownerName = appUsers.find(u => u.id === space.owner)?.name || space.owner

  if (!editable) {
    return <SpaceProvider space={space}>{space.name} - owned by {ownerName}</SpaceProvider>
  }

  return <>

    <Dialog >

      <SpaceProvider space={space} >
        <div className="flex flex-row gap-2 items-center">
          {space.name}
          <DialogTrigger asChild>
            <Button style={{
              color: space.color,
            }} variant="link" className="flex flex-row gap-2 items-center">
              edit
              <Pencil className="h-4 w-4 fill-current" />
            </Button>
          </DialogTrigger>
        </div>
      </SpaceProvider>
      <DialogContent>

        <SpaceProvider space={updatedSpace} >
          <DialogHeader>
            <DialogTitle>editing {name}</DialogTitle>
            <DialogDescription>
              config is shared for all users of the space.
            </DialogDescription>
          </DialogHeader>

          <form onChange={() => setChanged(true)}>

            <Label htmlFor="name">name</Label>
            <Input name="name" value={name} onChange={e => setName(e.target.value)} />

            <Label htmlFor="color">color</Label>
            <Select name="color" value={color} onValueChange={setColor}>
              <SelectTrigger>
                <SelectValue placeholder="color" />
              </SelectTrigger>
              <SelectContent>
                {COLORS.map(c =>
                  <SelectItem key={c} value={c}>
                    <div className="flex flex-row gap-2">
                      <div className="h-4 w-4" style={{ backgroundColor: c }} />
                      {c}
                    </div>
                  </SelectItem>
                )}
              </SelectContent>
            </Select>

            {space.spaceType === 'shared' &&

              <>


                <Label htmlFor="users">users</Label>
                <div className="flex flex-col gap-2">
                  {editableUsers.map(u =>
                    <Label key={u.id} htmlFor={'user-' + u.id} className="flex flex-row gap-2 items-center" >
                      <Checkbox
                        name={'user' + u.id}
                        checked={users.includes(u.id)} onCheckedChange={(v) => toggleUser(u, v as boolean)} />
                      {u.name}
                    </Label>
                  )}
                </div>

              </>


            }


          </form>


          <DialogFooter>
            <Button disabled={!changed} variant="default" className="flex flex-row gap-2 items-center" onClick={handleSubmit}>
              save
              <Save />
            </Button>
          </DialogFooter>
        </SpaceProvider>
      </DialogContent>
    </Dialog >
  </>


}

function Index() {
  const { db } = useDatabase()
  const users = useObservable(db.users.find({}).$)
  const spaces = useObservable(db.spaces.find({}).$)

  const user = useLocalUser()

  const updateSpace = async (space: Space) => {
    console.log("updating", space)
    const result = await db.spaces.upsert(
      {
        ...space,
        type: "space",
      })

    console.log("updated space", result)
  }

  return (
    <div className="flex flex-col gap-4">
      <div>

        <h2 className="text-xl">Users</h2>
        <ol>{users?.map((user) => <li key={user.id}>{user.name}</li>)}</ol>
      </div>

      <div>
        <h2 className="text-xl">Spaces</h2>
        <div className="flex flex-col gap-2">{
          spaces?.map((space) => <SpaceEditor key={space.id} space={space} onSubmit={updateSpace} appUsers={users || []} editable={user === space.owner} />)
        }</div>

      </div>
    </div>
  )
}
