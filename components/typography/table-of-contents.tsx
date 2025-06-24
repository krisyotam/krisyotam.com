"use client"

import { cn } from "@/lib/utils"
import React, { useState } from "react"
import { ChevronRight } from "lucide-react"

export interface TableOfContentsItem {
  id: string
  text: string
  level: number
}

export interface TableOfContentsProps {
  headings: TableOfContentsItem[]
  className?: string
}

export function TableOfContents({ headings, className }: TableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false)

  if (!headings || headings.length === 0) {
    return null
  }

  // Add hierarchical numbering
  const addHierarchicalNumbering = (items: TableOfContentsItem[]) => {
    const counters = [0, 0, 0, 0]
    return items.map((item) => {
      const lvl = item.level
      // Reset deeper levels
      for (let i = lvl; i < counters.length; i++) counters[i] = 0
      counters[lvl - 1]++
      const number = counters.slice(0, lvl).join(".")
      return { ...item, number }
    })
  }

  const numberedHeadings = addHierarchicalNumbering(headings)

  return (
    <div
      className={cn(
        "my-2 bg-muted/50 dark:bg-[hsl(var(--popover))] w-full",
        className
      )}
    >
      <button
        type="button"
        className="flex w-full items-center justify-between px-4 py-2 text-left font-medium select-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>Table of Contents</span>
        <ChevronRight
          className={cn(
            "w-4 h-4 transform transition-transform",
            isOpen && "rotate-90"
          )}
        />
      </button>
      <div 
        className={cn(
          "px-4 py-2",
          !isOpen && "hidden"
        )}
      >
        <ul className="space-y-2">
          {numberedHeadings.map((heading) => (
            <li 
              key={heading.id} 
              style={{ paddingLeft: `${(heading.level - 1) * 16}px` }}
            >
              <a
                href={`#${heading.id}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-start gap-3 py-1 leading-relaxed"
                onClick={() => setIsOpen(false)} // Close TOC when clicking a link
              >
                <span className="text-xs text-muted-foreground/70 mt-0.5 flex-shrink-0 min-w-[24px]">
                  {heading.number}.
                </span>
                <span className="break-words">{heading.text}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
