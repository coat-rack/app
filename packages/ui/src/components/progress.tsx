import * as ProgressPrimitive from "@radix-ui/react-progress"
import * as React from "react"

import { cva, VariantProps } from "class-variance-authority"
import { cn } from "../lib/utils"

const progressVariants = cva("bg-muted relative w-full overflow-hidden", {
  variants: {
    size: {
      default: "h-4 border-solid border-2 border-primary",
      slim: "h-2",
    },
  },
  defaultVariants: {
    size: "default",
  },
})

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, size, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(progressVariants({ size, className }), className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="bg-primary h-full w-full flex-1 transition-all"
      style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress, progressVariants }
