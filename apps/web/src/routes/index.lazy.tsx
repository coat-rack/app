import { createLazyFileRoute } from "@tanstack/react-router"
import { trpc } from "../trpc"
import { db } from "../db"

import { Observable } from "rxjs"
import { useEffect, useState } from "react"

export const Route = createLazyFileRoute("/")({
  component: Index,
})

const useObservable = <T extends any>(obs: Observable<T>) => {
  const [value, setValue] = useState<T>()

  useEffect(() => {
    obs.subscribe(setValue)
  }, [])

  return value
}

function Index() {
  const data = trpc.getName.useQuery()
  const todos = useObservable(db.todos.find({}).$)

  const addTodo = () => {
    db.todos.insert({
      id: Date.now().toString(),
      title: new Date().toString(),
      done: true,
    })
  }

  return (
    <div>
      <h1>Message From Server</h1>

      <pre>{data?.data}</pre>

      <button onClick={addTodo}>Add Todo</button>

      <ol>{todos?.map((todo) => <li key={todo.id}>{todo.title}</li>)}</ol>
    </div>
  )
}
