import { db, useObservable } from "@/db"
import { createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/apps/notes/$id")({
  component: Note,
})

function Note() {
  const { id } = Route.useParams()
  const note = useObservable(
    db.notes.findOne({
      selector: {
        id,
      },
    }).$,
  )

  return <div>{note?.title}</div>
}
