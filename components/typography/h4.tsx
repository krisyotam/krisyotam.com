import type React from "react"
import { cn } from "@/lib/utils"

interface H4Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
  className?: string
  id?: string
}

export function H4({ children, className, id, ...props }: H4Props) {
  return (
    <h4 id={id} className={cn("scroll-m-20 text-xl font-semibold tracking-tight", className)} {...props}>
      {children}
    </h4>
  )
}

// Set displayName explicitly to help with component detection
H4.displayName = "H4"

