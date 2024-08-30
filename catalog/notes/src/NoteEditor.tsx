import { Db } from "@repo/sdk"
import { Button } from "@repo/ui/components/button"
import { Input } from "@repo/ui/components/input"
import { Textarea } from "@repo/ui/components/textarea"
import { useEffect, useState } from "react"
import { Note } from "./note"
type NoteEditorProps = {
  noteId: string
  db: Db<Note>
  onNoteChanged?: () => void
}

export function NoteEditor({ noteId, db, onNoteChanged }: NoteEditorProps) {
  const [note, setNote] = useState<Note | undefined>(undefined)
  useEffect(() => {
    db.get(noteId).then((res) => setNote(res.data))
  }, [])

  const save = () => {
    if (note) {
      db.update(noteId, note)
      onNoteChanged?.()
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
      <Button onClick={save}>Save</Button>
    </div>
  )
}
