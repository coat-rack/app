import { App, DbRecord } from "@repo/sdk"

import { Button } from "@repo/ui/components/button"
import { useEffect, useState } from "react"
import { NoteEditor } from "./NoteEditor"
import { Note } from "./note"
import "./styles.css"

export const Notes: App<Note> = {
  /**
   *  The Entrypoint for the app
   */
  Entry: ({ db }) => {
    const [notes, setNotes] = useState([] as DbRecord<Note>[])

    const newNote = async () => {
      await db.create({
        title: "New note",
        contents: "",
      })
      getNotes()
    }

    const getNotes = () => db.query<Note>().then((res) => setNotes(res))

    useEffect(() => {
      getNotes()
    }, [])

    return (
      <>
        <h1>notes</h1>
        <Button onClick={newNote}>New note</Button>
        <pre>{JSON.stringify(notes)}</pre>
        <div className="md:grid-cols:3 grid grid-cols-1 gap-4">
          <div>
            {notes.length ? (
              notes.map((note) => (
                <NoteEditor db={db} noteId={note.id} key={note.id} />
              ))
            ) : (
              <div>No notes yet</div>
            )}
          </div>
        </div>
      </>
    )
  },
}

export default Notes
