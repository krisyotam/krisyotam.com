import type React from "react"
import { cn } from "@/lib/utils"

interface PProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children: React.ReactNode
  className?: string
  startArticle?: boolean
}

export function P({ children, className, startArticle, ...props }: PProps) {
  return (
    <p className={cn("leading-7 m-0 p-0", startArticle && "article-start", className)} {...props}>
      {children}
    </p>
  )
}

// Set displayName explicitly to help with component detection
P.displayName = "P"

