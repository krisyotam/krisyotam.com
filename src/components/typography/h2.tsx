"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface H2Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
  className?: string
  id?: string
}

export function H2({ children, className, id, ...props }: H2Props) {
  const handleClick = () => {
    if (id && typeof window !== "undefined") {
      const url = `${window.location.origin}${window.location.pathname}#${id}`
      navigator.clipboard.writeText(url)
    }
  }

  return (
    <h2
      id={id}
      className={cn(
        "scroll-m-20 text-3xl font-semibold tracking-tight mt-8",
        id && "cursor-pointer hover:opacity-70 transition-opacity",
        className
      )}
      onClick={id ? handleClick : undefined}
      title={id ? "Click to copy link" : undefined}
      {...props}
    >
      {children}
    </h2>
  )
}

// Set displayName explicitly to help with component detection
H2.displayName = "H2"

