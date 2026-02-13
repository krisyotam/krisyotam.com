"use client"

import type React from "react"
import { cn } from "@/lib/utils"

interface H1Props extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
  className?: string
  id?: string
}

export function H1({ children, className, id, ...props }: H1Props) {
  const handleClick = () => {
    if (id && typeof window !== "undefined") {
      const url = `${window.location.origin}${window.location.pathname}#${id}`
      navigator.clipboard.writeText(url)
    }
  }

  return (
    <h1
      id={id}
      className={cn(
        "scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mt-8",
        id && "cursor-pointer hover:opacity-70 transition-opacity",
        className
      )}
      onClick={id ? handleClick : undefined}
      title={id ? "Click to copy link" : undefined}
      {...props}
    >
      {children}
    </h1>
  )
}

// Set displayName explicitly to help with component detection
H1.displayName = "H1"

