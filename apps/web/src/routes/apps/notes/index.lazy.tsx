import { db, useObservable } from "@/db"
import { Layout } from "@/layout"
import { Note } from "@repo/data/models"
import { Link, createLazyFileRoute, useNavigate } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/apps/notes/")({
  component: Index,
})

function Index() {
  const notes = useObservable(db.notes.find({}).$)

  console.log({ notes })

  const navigate = useNavigate()

  const addNote = () => {
    const note: Note = {
      type: "note",
      id: Date.now().toString(),
      timestamp: Date.now(),
      title: "Title",
      space: "base",
      content: "",
      isDeleted: false,
    }
    db.notes
      .insert(note)
      .then((result) =>
        navigate({ to: "/apps/notes/$id", params: { id: result.id } }),
      )
  }
  return (
    <Layout title="Notes">
      <button onClick={addNote}>Add Note</button>
      <ul>
        {notes?.map((note) => (
          <li key={note.id}>
            <Link
              key={note.id}
              to="/apps/notes/$id"
              params={{
                id: note.id,
              }}
            >
              {note.title}
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  )
}
