import { createLazyFileRoute } from "@tanstack/react-router"
import { db } from "../db"
import { trpcReact } from "../trpc"

import { Todo } from "@repo/data/models"
import { useEffect, useState } from "react"
import { RxDocument } from "rxdb"
import { Observable } from "rxjs"

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
  const data = trpcReact.getName.useQuery()
  const todos = useObservable(db.todos.find({}).$)

  const addTodo = () => {
    const now = new Date()
    const todo: Todo = {
      id: now.getTime().toString(),
      timestamp: now.getTime(),
      done: false,
      title: now.toString(),
    }

    db.todos.insert(todo)
  }

  const deleteTodo = (todo: RxDocument<Todo>) => {
    todo.remove()
  }

  return (
    <div>
      <h1>Message From Server</h1>

      <pre>{data?.data}</pre>

      <button onClick={addTodo}>Add Todo</button>

      <ol>
        {todos?.map((todo) => (
          <li onClick={() => deleteTodo(todo)} key={todo.id}>
            {todo.title}
          </li>
        ))}
      </ol>
    </div>
  )
}
