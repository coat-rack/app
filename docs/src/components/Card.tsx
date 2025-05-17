import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@coat-rack/ui/components/card"
import type { PropsWithChildren } from "react"

interface LinkButtonProps {
  title: string
}

export default function LinkButton({
  title,
  children,
}: PropsWithChildren<LinkButtonProps>) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{children}</CardDescription>
      </CardHeader>
    </Card>
  )
}
