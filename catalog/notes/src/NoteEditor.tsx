import { Save, Trash } from "@coat-rack/icons/regular"
import { useAppContext, useSpace } from "@coat-rack/sdk"
import { Button } from "@coat-rack/ui/components/button"
import { Input } from "@coat-rack/ui/components/input"
import { Textarea } from "@coat-rack/ui/components/textarea"
import { useEffect, useState } from "react"
import { Note } from "./note"

interface NoteEditorProps {
  noteId: string
  onNoteChanged?: (isDelete: boolean) => void
}

export function NoteEditor({ noteId, onNoteChanged }: NoteEditorProps) {
  const { db } = useAppContext<Note>()
  const space = useSpace()
  const [note, setNote] = useState<Note | undefined>(undefined)
  const [dirty, setDirty] = useState<boolean>(false)

  useEffect(() => {
    db.get(noteId).then((res) => res && setNote(res.data))
  }, [noteId])

  const changeNote = (note: Note) => {
    setDirty(true)
    setNote(note)
  }

  const save = async () => {
    if (note && space) {
      await db.update(noteId, space.id, note)
      onNoteChanged?.(false)
      setDirty(false)
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
        onChange={(e) => changeNote({ ...note, title: e.target.value })}
      />
      <Textarea
        value={note?.contents}
        onChange={(e) => changeNote({ ...note, contents: e.target.value })}
      />
      <div className="flex flex-row place-items-center justify-end gap-2">
        {dirty && <span className="text-xs italic">unsaved changes</span>}
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
