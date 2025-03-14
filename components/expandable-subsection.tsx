"use client"

import type React from "react"

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface ExpandableSubsectionProps {
  title: string
  children: React.ReactNode
}

export function ExpandableSubsection({ title, children }: ExpandableSubsectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="border-l-2 border-border pl-4 py-2 mb-4">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left mb-2 group"
        aria-expanded={isExpanded}
      >
        <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">{title}</h3>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {children}
      </div>
    </div>
  )
}

