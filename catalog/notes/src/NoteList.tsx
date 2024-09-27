import { DbRecord } from "@repo/sdk"
import { NoteListItem } from "./NoteListItem"
import { Note } from "./note"

interface NoteListProps {
  notes: DbRecord<Note>[]
  onNoteSelected: (note: DbRecord<Note>) => void
}
export function NoteList({ notes, onNoteSelected }: NoteListProps) {
  return (
    <div className="flex flex-col gap-2">
      {notes.length ? (
        notes.map((note) => (
          <NoteListItem key={note.id} note={note} onClick={onNoteSelected} />
        ))
      ) : (
        <div>No notes yet</div>
      )}
    </div>
  )
}
