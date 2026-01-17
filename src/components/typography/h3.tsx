import type React from "react"
import { cn } from "@/lib/utils"

interface H3Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
  className?: string
  id?: string
}

export function H3({ children, className, id, ...props }: H3Props) {
  return (
    <h3 id={id} className={cn("scroll-m-20 text-2xl font-semibold tracking-tight mt-8", className)} {...props}>
      {children}
    </h3>
  )
}

// Set displayName explicitly to help with component detection
H3.displayName = "H3"

