import type React from "react"
import { cn } from "@/lib/utils"

interface H2Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
  className?: string
  id?: string
}

export function H2({ children, className, id, ...props }: H2Props) {
  return (
    <h2
      id={id}
      className={cn("scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0", className)}
      {...props}
    >
      {children}
    </h2>
  )
}

// Set displayName explicitly to help with component detection
H2.displayName = "H2"

