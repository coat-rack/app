import { App } from "@repo/sdk"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@repo/ui/components/alert-dialog"
import { Button } from "@repo/ui/components/button"
import { Calendar } from "@repo/ui/components/calendar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@repo/ui/components/carousel"
import { Checkbox } from "@repo/ui/components/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog"
import { Input } from "@repo/ui/components/input"
import { Label } from "@repo/ui/components/label"
import { RadioGroup, RadioGroupItem } from "@repo/ui/components/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@repo/ui/components/select"
import { Toaster, toast } from "@repo/ui/components/sonner"
import { Textarea } from "@repo/ui/components/textarea"
import { CSSProperties, useState } from "react"

import { ChartConfig, ChartContainer } from "@repo/ui/components/chart"
import { Bar, BarChart, Legend } from "recharts"
import "./styles.css"

export const Tasks: App = {
  /**
   *  The Entrypoint for the app
   */
  Entry: () => {
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [spaceColor, setSpaceColor] = useState<string>(
      window.getComputedStyle(document.body).getPropertyValue("--space"),
    )

    const chartData = [
      { month: "January", desktop: 186, mobile: 80 },
      { month: "February", desktop: 305, mobile: 200 },
      { month: "March", desktop: 237, mobile: 120 },
      { month: "April", desktop: 73, mobile: 190 },
      { month: "May", desktop: 209, mobile: 130 },
      { month: "June", desktop: 214, mobile: 140 },
    ]

    const chartConfig = {
      desktop: {
        label: "Desktop",
        color: "hsl(var(--chart-1))",
      },
      mobile: {
        label: "Mobile",
        color: "hsl(var(--chart-2))",
      },
    } satisfies ChartConfig

    return (
      <div
        style={
          spaceColor ? ({ "--space": spaceColor } as CSSProperties) : undefined
        }
        className="bg-background flex flex-col gap-4"
      >
        <div className="flex flex-col gap-4">
          <h1 className="flex flex-row  justify-start gap-4">
            <input
              className="h-8 w-8"
              type="color"
              value={spaceColor}
              onChange={(e) => setSpaceColor(e.target.value)}
            />

            <div>Colors</div>
          </h1>
          <div className="flex flex-row flex-wrap gap-4">
            <div className="text-foreground bg-background p-4">bg/fg</div>
            <div className="text-card-foreground bg-card p-4">card</div>
            <div className="text-popover-foreground bg-popover p-4">
              popover
            </div>
            <div className="text-primary-foreground bg-primary p-4">
              primary
            </div>
            <div className="text-secondary-foreground bg-secondary p-4">
              secondary
            </div>
            <div className="text-muted-foreground bg-muted p-4">muted</div>
            <div className="text-accent-foreground bg-accent p-4">accent</div>
            <div className="text-destructive-foreground bg-destructive p-4">
              destructive
            </div>
            <div className="bg-border p-4">border</div>
            <div className="bg-input p-4">input</div>
            <div className="bg-ring p-4">ring</div>
            <div className="bg-[color:--chart-1] p-4">chart-1</div>
            <div className="bg-[color:--chart-2] p-4">chart-2</div>
            <div className="bg-[color:--chart-3] p-4">chart-3</div>
            <div className="bg-[color:--chart-4] p-4">chart-4</div>
            <div className="bg-[color:--chart-5] p-4">chart-5</div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h1>Button</h1>

          <div className="flex flex-row gap-2">
            <Button variant="default">Click Me</Button>
            <Button variant="secondary">Click Me</Button>
            <Button variant="link">Click Me</Button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h1>Input</h1>

          <div className="flex flex-row items-center gap-2">
            <Input />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h1>Textarea</h1>

          <div className="flex flex-row items-center gap-2">
            <Textarea />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h1>Radio Group</h1>

          <div className="flex flex-row gap-2">
            <RadioGroup defaultValue="option-one">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-one" id="option-one" />
                <Label htmlFor="option-one">Option One</Label>
              </div>

              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-two" id="option-two" />
                <Label htmlFor="option-two">Option Two</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h1>Checkbox</h1>

          <div className="flex flex-row items-center gap-2">
            <Checkbox id="checkbox" />
            <Label htmlFor="checkbox">Accept</Label>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h1>Select</h1>

          <div className="flex flex-row items-center gap-2">
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h1>Calendar</h1>

          <div className="flex flex-row items-center gap-2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h1>Card</h1>

          <div className="flex flex-row items-center gap-2">
            <Card>
              <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>Card Description</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Card Content</p>
              </CardContent>
              <CardFooter>
                <p>Card Footer</p>
              </CardFooter>
            </Card>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h1>Carousel</h1>

          <Carousel>
            <CarouselContent>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <h1>Item 1</h1>
              </CarouselItem>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <h1>Item 2</h1>
              </CarouselItem>
              <CarouselItem className="md:basis-1/2 lg:basis-1/3">
                <h1>Item 3</h1>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </div>

        <div className="flex flex-col gap-4">
          <h1>Sonner</h1>

          <div className="flex flex-row items-center gap-2">
            <Button
              onClick={() =>
                toast("Event has been created", {
                  description: "Sunday, December 03, 2023 at 9:00 AM",
                  action: {
                    label: "Undo",
                    onClick: () => console.log("Undo"),
                  },
                })
              }
            >
              Show Message
            </Button>
            <Toaster />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h1>Dialog</h1>

          <div className="flex flex-row items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Open Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Are you absolutely sure?</DialogTitle>
                  <DialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h1>Alert Dialog</h1>

          <div className="flex flex-row items-center gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button>Open Alert Dialog</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                </AlertDialogHeader>

                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>

                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <h1>Chart</h1>

          <div className="flex flex-row items-center gap-2">
            <Card>
              <CardHeader>
                <CardTitle>Example Chart</CardTitle>
                <CardDescription>Data rendered using recharts</CardDescription>
              </CardHeader>

              <CardContent>
                <ChartContainer
                  config={chartConfig}
                  className="min-h-[200px] w-full"
                >
                  <BarChart accessibilityLayer data={chartData}>
                    <Legend verticalAlign="top" align="right" />
                    <Bar dataKey="desktop" fill="var(--color-desktop)" />
                    <Bar dataKey="mobile" fill="var(--color-mobile)" />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  },
}

export default Tasks
