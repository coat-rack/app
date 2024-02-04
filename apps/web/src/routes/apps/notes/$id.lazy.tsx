import { useObservable } from "@/async"
import { useDatabase } from "@/data"
import { Layout } from "@/layout"
import { createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/apps/notes/$id")({
  component: Note,
})

function Note() {
  const { id } = Route.useParams()
  const { db } = useDatabase()
  const note = useObservable(
    db.notes.findOne({
      selector: {
        id,
      },
    }).$,
    [id],
  )

  if (!note) {
    return <Layout title="Note not found" />
  }

  const updateTitle = (title?: string) => {
    note.update({
      $set: {
        timestamp: Date.now(),
        title,
      },
    })
  }

  const updateContent = (content?: string) => {
    note.update({
      $set: {
        timestamp: Date.now(),
        content,
      },
    })
  }

  return (
    <Layout>
      <input
        className="text-5xl"
        value={note.title}
        onChange={(e) => updateTitle(e.target.value)}
      />

      <textarea
        value={note.content}
        className="w-full h-96 border-solid border-black border-4 p-4"
        onChange={(e) => updateContent(e.target.value)}
      />
    </Layout>
  )
}
