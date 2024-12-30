import { App, DbRecord, ProvideAppContext, ProvideSpace } from "@repo/sdk"
import { Button } from "@repo/ui/components/button"
import { useEffect, useState } from "react"
import { NoteEditor } from "./NoteEditor"
import { NoteList } from "./NoteList"
import { Note } from "./note"
import "./styles.css"

function useRefresh() {
  const [key, setKey] = useState(Date.now())
  const refresh = () => setKey(Date.now())

  return [key, refresh] as const
}

export const Notes: App<Note> = {
  /**
   *  The Entrypoint for the app
   */
  Entry: ({ context }) => {
    const { db, activeSpace } = context
    const [notes, setNotes] = useState([] as DbRecord<Note>[])
    const [signal, doRefresh] = useRefresh()

    const getNotes = () => db.query<Note>().then((res) => setNotes(res))

    const [activeNote, setActiveNote] = useState<DbRecord<Note> | undefined>(
      undefined,
    )

    const noteChanged = (isDelete: boolean) => {
      if (isDelete) {
        setActiveNote(undefined)
      }
      doRefresh()
    }

    const newNote = async () => {
      const note = await db.create({
        title: "New note",
        contents: "",
      })

      await getNotes()
      setActiveNote(note)
    }

    useEffect(() => {
      getNotes()
    }, [signal, activeSpace])

    return (
      <ProvideAppContext {...context}>
        <main>
          <h1>notes</h1>
          <Button onClick={newNote}>New note</Button>
          <div className="grid grid-cols-3 grid-rows-1 gap-4 py-2">
            <NoteList notes={notes} onNoteSelected={setActiveNote} />
            <div className="col-span-2">
              {(activeNote && (
                <ProvideSpace space={activeNote.space}>
                  <NoteEditor
                    noteId={activeNote.id}
                    onNoteChanged={noteChanged}
                  ></NoteEditor>
                </ProvideSpace>
              )) || <p>Select a note</p>}
            </div>
          </div>
        </main>
      </ProvideAppContext>
    )
  },
}

export default Notes
