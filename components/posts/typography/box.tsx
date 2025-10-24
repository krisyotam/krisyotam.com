// components/posts/typography/Box.tsx
import { cn } from "@/lib/utils"
import React, { ReactNode } from "react"

export interface BoxProps {
  children: ReactNode
  className?: string
}

export function Box({ children, className }: BoxProps) {
  const base = [
    "p-6",
    "rounded-none",
    "my-6",
    // exactly the same light-mode tint your Cards use:
    "bg-muted/50",
    // keep your perfect 9% black in dark
    "dark:bg-[hsl(var(--popover))]",
    "w-full",
  ].join(" ")

  return <div className={cn(base, className)}>{children}</div>
}
