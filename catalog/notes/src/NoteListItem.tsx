import { DbRecord, SpaceTheme } from "@repo/sdk"
import { Note } from "./note"

interface NoteListItemProps {
  note: DbRecord<Note>
  onClick: (note: DbRecord<Note>) => void
}
export function NoteListItem({ note, onClick }: NoteListItemProps) {
  return (
    <SpaceTheme
      space={note.space}
      className="border-primary border-2 border-solid p-4"
      onClick={() => onClick(note)}
    >
      <h3 className="pb-1">{note.data.title}</h3>
      <p className="text-xs italic">
        Last updated: {new Date(note.timestamp).toDateString()}
      </p>
    </SpaceTheme>
  )
}
