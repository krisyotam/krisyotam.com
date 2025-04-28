"use client"

import React, { useState } from "react"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"

export interface CollapseProps {
  /** Title shown when collapsed */
  title: string
  /** Content (MDX/Markdown) to display inside */
  children: React.ReactNode
  /** Additional classes for the outer wrapper */
  className?: string
}

export default function Collapse({ title, children, className }: CollapseProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div
      className={cn(
        "my-6 rounded-lg bg-muted/50 dark:bg-[hsl(var(--popover))]",
        className
      )}
    >
      <button
        type="button"
        className="flex w-full items-center justify-between px-4 py-2 text-left font-medium select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <ChevronRight
          className={cn(
            "w-4 h-4 transform transition-transform",
            isOpen && "rotate-90"
          )}
        />
      </button>
      {isOpen && (
        <div className="px-4 py-4 prose dark:prose-invert">
          {children}
        </div>
      )}
    </div>
  )
}