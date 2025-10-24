import { ReactNode } from "react"

interface BoxProps {
  children: ReactNode
  className?: string
}

export function Box({ children, className = "" }: BoxProps) {
  return (
    <div className={`border border-border rounded-none bg-card text-card-foreground shadow-sm ${className}`}>
      {children}
    </div>
  )
}
