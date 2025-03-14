
import type { PropsWithChildren } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@repo/ui/components/card'

interface LinkButtonProps {
  title: string,
}

export default function LinkButton({ title, children }: PropsWithChildren<LinkButtonProps>) {
  return <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
      <CardDescription>{children}</CardDescription>
    </CardHeader>
  </Card>
}
