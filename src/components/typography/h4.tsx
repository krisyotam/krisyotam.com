"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface H4Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
  className?: string
  id?: string
}

export function H4({ children, className, id, ...props }: H4Props) {
  const handleClick = () => {
    if (id && typeof window !== "undefined") {
      const url = `${window.location.origin}${window.location.pathname}#${id}`
      navigator.clipboard.writeText(url)
    }
  }

  return (
    <h4
      id={id}
      className={cn(
        "scroll-m-20 text-xl font-semibold tracking-tight mt-8",
        id && "cursor-pointer hover:opacity-70 transition-opacity",
        className
      )}
      onClick={id ? handleClick : undefined}
      title={id ? "Click to copy link" : undefined}
      {...props}
    >
      {children}
    </h4>
  )
}

// Set displayName explicitly to help with component detection
H4.displayName = "H4"

