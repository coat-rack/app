import { Link, createLazyFileRoute } from "@tanstack/react-router"
import { db, useObservable } from "../db"

import { Layout } from "@/layout"
import { Todo } from "@repo/data/models"
import { RxDocument } from "rxdb"

export const Route = createLazyFileRoute("/")({
  component: Index,
})

function Index() {
  const todos = useObservable(db.todos.find({}).$)

  console.log({ todos })

  const addTodo = () => {
    const now = new Date()
    const todo: Todo = {
      space: "basic",
      type: "todo",
      isDeleted: false,
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
    <Layout title="Server Content">
      <Link to="/apps/notes">Notes</Link>

      <ol>
        {todos?.map((todo) => (
          <li onClick={() => deleteTodo(todo)} key={todo.id}>
            {todo.title}
          </li>
        ))}
      </ol>
      <button onClick={addTodo}>Add Todo</button>
    </Layout>
  )
}
