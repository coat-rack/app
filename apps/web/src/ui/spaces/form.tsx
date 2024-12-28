import { Checkbox } from "@repo/ui/components/checkbox"

import { Label } from "@repo/ui/components/label"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select"

import { Input } from "@repo/ui/components/input"

import { Space, User } from "@repo/data/models"
import { useEffect, useState } from "react"

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

export const randomColor = () =>
  COLORS[Math.floor(Math.random() * COLORS.length)]

export function SpaceProvider({
  space,
  children,
}: React.PropsWithChildren<{ space: Space }>) {
  return (
    <div style={{ "--primary": space.color } as React.CSSProperties}>
      {children}
    </div>
  )
}

export function SpaceForm({
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
