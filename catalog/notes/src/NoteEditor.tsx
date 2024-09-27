import { Save, Trash } from "@repo/icons/regular"
import { Db } from "@repo/sdk"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Textarea } from "@repo/ui/components/textarea"
import { useEffect, useState } from "react"
import { Note } from "./note"
interface NoteEditorProps {
  noteId: string
  db: Db<Note>
  onNoteChanged?: (isDelete: boolean) => void
}

export function NoteEditor({ noteId, db, onNoteChanged }: NoteEditorProps) {
  const [note, setNote] = useState<Note | undefined>(undefined)
  useEffect(() => {
    db.get(noteId).then((res) => res && setNote(res.data))
  }, [noteId])

  const save = async () => {
    if (note) {
      await db.update(noteId, note)
      onNoteChanged?.(false)
    }
  }

  const remove = async () => {
    if (note) {
      await db.delete(noteId)
      onNoteChanged?.(true)
    }
  }

  if (!note) {
    return undefined
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      <Input
        value={note?.title}
        onChange={(e) => setNote({ ...note, title: e.target.value })}
      />
      <Textarea
        value={note?.contents}
        onChange={(e) => setNote({ ...note, contents: e.target.value })}
      />
      <div className="flex flex-row justify-end gap-1">
        <Button onClick={remove}>
          <Trash className="h-4 w-4 fill-current"></Trash>
        </Button>
        <Button onClick={save}>
          <Save className="h-4 w-4 fill-current"></Save>
        </Button>
      </div>
    </div>
  )
}
