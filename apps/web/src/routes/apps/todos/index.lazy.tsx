import { useObservable } from "@/async"
import { useDatabase } from "@/data"
import { Layout } from "@/layout"
import { Todo } from "@repo/data/models"
import { createLazyFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { RxDocument } from "rxdb"

export const Route = createLazyFileRoute("/apps/todos/")({
  component: Index,
})

function Index() {
  const { db, user } = useDatabase()

  const todos = useObservable(db.todos.find({}).$)

  const [value, setValue] = useState("")
  const addTodo = () => {
    if (!user) {
      return
    }

    const todo: Todo = {
      type: "todo",
      id: Date.now().toString(),
      timestamp: Date.now(),
      title: value,
      space: user,
      isDeleted: false,
      done: false,
    }
    setValue("")
    db.todos.insert(todo)
  }

  const updateStatus = (todo: RxDocument<Todo>, done: boolean) => {
    todo.update({
      $set: {
        timestamp: Date.now(),
        done,
      },
    })
  }

  const updateTitle = (todo: RxDocument<Todo>, title: string) => {
    todo.update({
      $set: {
        timestamp: Date.now(),
        title,
      },
    })
  }

  return (
    <Layout title="Todos">
      <input
        className="border-4 border-solid border-black p-2"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={addTodo}>Add Todo</button>
      <ul>
        {todos?.map((todo) => (
          <li key={todo.id}>
            <input
              type="checkbox"
              checked={todo.done}
              onChange={(e) => updateStatus(todo, e.target.checked)}
            />
            <input
              type="text"
              value={todo.title}
              onChange={(e) => updateTitle(todo, e.target.value)}
            />
          </li>
        ))}
      </ul>
    </Layout>
  )
}
