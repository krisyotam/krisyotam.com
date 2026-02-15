"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronDown, ChevronUp } from "lucide-react"

export interface CollapseProps {
  /** Optional title — shown inline when collapsed */
  title?: string
  /** Content to display inside */
  children: React.ReactNode
  /** Start expanded */
  open?: boolean
  /** Additional classes for the outer wrapper */
  className?: string
}

export default function Collapse({ title, children, open = false, className }: CollapseProps) {
  const [isOpen, setIsOpen] = useState(open)

  if (!isOpen) {
    /* Collapsed — single solid bar, chevron on the right */
    return (
      <div
        role="button"
        tabIndex={0}
        className={cn(
          "my-6 flex items-center",
          "w-full cursor-pointer select-none",
          "bg-muted",
          "px-5 py-5",
          "transition-colors hover:bg-muted/80",
          className
        )}
        onClick={() => setIsOpen(true)}
        onKeyDown={(e) => e.key === "Enter" && setIsOpen(true)}
      >
        {title && (
          <span className="mr-auto text-sm font-bold text-muted-foreground">
            {title}
          </span>
        )}
        <ChevronDown className={cn("w-5 h-5 text-muted-foreground", !title && "ml-auto")} />
      </div>
    )
  }

  /* Expanded — sideways U: top bar + left strip + bottom bar, right open */
  return (
    <div className={cn("my-6", className)}>
      {/* Top bar */}
      <div
        role="button"
        tabIndex={0}
        className="flex items-center bg-muted px-5 py-4 cursor-pointer select-none transition-colors hover:bg-muted/80"
        onClick={() => setIsOpen(false)}
        onKeyDown={(e) => e.key === "Enter" && setIsOpen(false)}
      >
        {title && (
          <span className="mr-auto text-sm font-bold text-muted-foreground">
            {title}
          </span>
        )}
        <ChevronDown className={cn("w-5 h-5 text-muted-foreground", !title && "ml-auto")} />
      </div>

      {/* Content area with left accent strip */}
      <div className="flex">
        {/* Left strip */}
        <div className="w-2 bg-muted flex-shrink-0" />
        {/* Content */}
        <div className="flex-1 px-5 py-4 text-[0.95em] leading-[1.65] [&>:first-child]:mt-0">
          {children}
        </div>
      </div>

      {/* Bottom bar */}
      <div
        role="button"
        tabIndex={0}
        className="flex items-center justify-center bg-muted py-3 cursor-pointer select-none transition-colors hover:bg-muted/80"
        onClick={() => setIsOpen(false)}
        onKeyDown={(e) => e.key === "Enter" && setIsOpen(false)}
      >
        <ChevronUp className="w-5 h-5 text-muted-foreground" />
      </div>
    </div>
  )
}
