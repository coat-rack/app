import { ChevronDown, Plus } from "@coat-rack/icons/regular"
import {
  App,
  ProvideAppContext,
  ProvideSpace,
  type Entry,
} from "@coat-rack/sdk"
import { Button } from "@coat-rack/ui/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@coat-rack/ui/components/card"
import { Checkbox } from "@coat-rack/ui/components/checkbox"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@coat-rack/ui/components/collapsible"
import { Input } from "@coat-rack/ui/components/input"
import { Label } from "@coat-rack/ui/components/label"
import { DependencyList, useEffect, useState } from "react"
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

function Entry({ context }: Entry<TaskData>) {
  const { db, activeSpace } = context
  const [title, setTitle] = useState("")

  const [key, refresh] = useRefresh()

  const todo = usePromise(
    () =>
      db.query({
        completed: false,
      }),
    [key, activeSpace],
  )

  const completed = usePromise(
    () =>
      db.query({
        completed: true,
      }),
    [key, activeSpace],
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

  const updateTask = async (id: string, space: string, task: Task) => {
    await db.update(id, space, task)

    setTitle("")
    refresh()
  }

  return (
    <ProvideAppContext {...context}>
      <main className="mx-4 flex flex-1 flex-col justify-between gap-2">
        <h1>Tasks</h1>

        <div className="flex flex-col gap-2 md:flex-row">
          <Card className="flex-1">
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
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
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
                  <ProvideSpace
                    space={task.space}
                    as="li"
                    className="flex flex-row items-center gap-2"
                    key={task.id}
                  >
                    <Checkbox
                      id={task.id}
                      checked={task.data.completed}
                      onClick={() =>
                        updateTask(task.id, task.space, {
                          ...task.data,
                          completed: true,
                        })
                      }
                    />
                    <Label htmlFor={task.id}>{task.data?.title}</Label>
                  </ProvideSpace>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Collapsible asChild>
            <Card className="flex-1">
              <CardHeader>
                <CardTitle className="flex flex-row items-center justify-between">
                  <div>Completed</div>
                  <CollapsibleTrigger asChild>
                    <Button title="Toggle Collapsible" variant="ghost">
                      <ChevronDown className="h-4 w-4 fill-current" />
                    </Button>
                  </CollapsibleTrigger>
                </CardTitle>
                <CardDescription>
                  {completed?.length || 0} tasks completed
                </CardDescription>
              </CardHeader>
              <CollapsibleContent asChild>
                <CardContent>
                  <ul className="flex flex-col gap-4">
                    {completed?.map((task) => (
                      <ProvideSpace
                        as="li"
                        space={task.space}
                        className="flex flex-row items-center gap-2"
                        key={task.id}
                      >
                        <Checkbox
                          id={task.id}
                          checked={task.data.completed}
                          onClick={() =>
                            updateTask(task.id, task.space, {
                              ...task.data,
                              completed: false,
                            })
                          }
                        />
                        <Label htmlFor={task.id}>{task.data?.title}</Label>
                      </ProvideSpace>
                    ))}
                  </ul>
                </CardContent>
              </CollapsibleContent>
            </Card>
          </Collapsible>
        </div>
      </main>
    </ProvideAppContext>
  )
}

export const Tasks: App = {
  Entry,
}

export default Tasks
