import { db, useObservable } from "@/db"
import { Layout, useUser } from "@/layout"
import { Todo } from "@repo/data/models"
import { createLazyFileRoute } from "@tanstack/react-router"
import { useState } from "react"
import { RxDocument } from "rxdb"

export const Route = createLazyFileRoute("/apps/todos/")({
  component: Index,
})

function Index() {
  const todos = useObservable(db.todos.find({}).$)
  const user = useUser()

  const [value, setValue] = useState("")
  const addTodo = () => {
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
        className="p-2 border-solid border-4 border-black"
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
