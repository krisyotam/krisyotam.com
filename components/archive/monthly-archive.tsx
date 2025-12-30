"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface MonthlyArchiveProps {
  month: string
  content: React.ReactNode
}

export function MonthlyArchive({ month, content }: MonthlyArchiveProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border-b border-border pb-2">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex justify-between items-center py-4 text-left"
        aria-expanded={isExpanded}
      >
        <h3 className="text-xl font-medium text-foreground">{month}</h3>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[5000px] opacity-100 mb-8" : "max-h-0 opacity-0"
        }`}
      >
        {content}
      </div>
    </div>
  )
}

