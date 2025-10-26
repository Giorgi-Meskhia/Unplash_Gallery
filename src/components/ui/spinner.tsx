"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type SpinnerProps = React.ComponentProps<"div"> & {
  size?: "sm" | "md" | "lg"
}

export function Spinner({ className, size = "md", ...props }: SpinnerProps) {
  const dimension = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-8 w-8" : "h-5 w-5"
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn("inline-block", className)}
      {...props}
    >
      <span className="sr-only">Loading</span>
      <div
        className={cn(
          "animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground",
          dimension
        )}
      />
    </div>
  )
}

export default Spinner


