import { ChevronDown, Plus } from "@repo/icons/regular"
import { App, ProvideSpaces, SpaceTheme, type Entry } from "@repo/sdk"
import { Button } from "@repo/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card"
import { Checkbox } from "@repo/ui/components/checkbox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@repo/ui/components/collapsible"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { ComponentProps, DependencyList, useEffect, useState } from "react"
import "./styles.css"

interface Task {
  type: "task"
  title: string
  completed: boolean
}

type TaskData = Task

function usePromise<T>(task: () => Promise<T>, deps: DependencyList = []) {
  const [value, setValue] = useState<T>()

  useEffect(() => {
    task().then(setValue)
  }, deps)

  return value
}

function useRefresh() {
  const [key, setKey] = useState(Date.now())
  const refresh = () => setKey(Date.now())

  return [key, refresh] as const
}

function Entry({ db, spaces }: ComponentProps<Entry<TaskData>>) {
  console.log(spaces)
  const [title, setTitle] = useState("")

  const [key, refresh] = useRefresh()

  const todo = usePromise(
    () =>
      db.query({
        completed: false,
      }),
    [key, spaces],
  )

  const completed = usePromise(
    () =>
      db.query({
        completed: true,
      }),
    [key, spaces],
  )

  const createTask = async () => {
    await db.create({
      type: "task",
      title,
      completed: false,
    })

    setTitle("")
    refresh()
  }

  const updateTask = async (id: string, task: Task) => {
    await db.update(id, task)

    setTitle("")
    refresh()
  }

  return (
    <ProvideSpaces spaces={spaces}>
      <main className="flex flex-col gap-2">
        <h1>Tasks</h1>

        <Card>
          <CardHeader>
            <CardTitle className="flex flex-row items-center justify-between">
              To Do
            </CardTitle>
            <CardDescription>{todo?.length || 0} tasks to do</CardDescription>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                createTask()
              }}
              className="flex flex-row items-center gap-2"
            >
              <Input value={title} onChange={(e) => setTitle(e.target.value)} />
              <Button
                disabled={!title}
                title="Add Item"
                variant="default"
                type="submit"
              >
                <Plus className="h-4 w-4 fill-current" />
              </Button>
            </form>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-4">
              {todo?.map((task) => (
                <SpaceTheme space={task.space}>
                  <li
                    className="flex flex-row items-center gap-2"
                    key={task.id}
                  >
                    <Checkbox
                      id={task.id}
                      checked={task.data.completed}
                      onClick={() =>
                        updateTask(task.id, { ...task.data, completed: false })
                      }
                    />
                    <Label htmlFor={task.id}>{task.data?.title}</Label>
                  </li>
                ))}
              </ul>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </main>
  )
}

export const Tasks: App<TaskData> = {
  Entry,
}

export default Tasks
