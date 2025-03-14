"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface TOCItem {
  id: string
  text: string
  level: number
  children?: TOCItem[]
}

interface TableOfContentsProps {
  className?: string
  headings?: TOCItem[]
  style?: React.CSSProperties
}

export function TableOfContents({ className, headings = [], style }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "0px 0px -80% 0px" },
    )

    const headingElements = document.querySelectorAll("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]")
    headingElements.forEach((element) => observer.observe(element))

    return () => {
      headingElements.forEach((element) => observer.unobserve(element))
    }
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      // Scroll the element into view with smooth behavior
      element.scrollIntoView({ behavior: "smooth", block: "start" })
      // Update the active ID
      setActiveId(id)
    }
  }

  const renderItems = (items: TOCItem[], depth = 0) => {
    return items.map((item, index) => {
      const isActive = activeId === item.id
      const hasChildren = item.children && item.children.length > 0

      return (
        <div key={item.id} className={cn("text-sm", depth > 0 && "ml-4")}>
          <button
            className={cn(
              "flex items-baseline py-1 hover:text-foreground transition-colors text-left w-full",
              isActive ? "text-foreground font-medium" : "text-muted-foreground",
            )}
            onClick={() => scrollToSection(item.id)}
          >
            <span className="mr-2 text-muted-foreground">{depth === 0 ? `${index + 1}` : `${index + 1}.${depth}`}</span>
            <span className="line-clamp-1">{item.text}</span>
          </button>
          {hasChildren && renderItems(item.children!, depth + 1)}
        </div>
      )
    })
  }

  return (
    <Card className={cn("p-4 bg-card text-card-foreground border-border", className)} style={style}>
      <div className="text-sm font-medium mb-3">Table of Contents</div>
      <div className="space-y-1">{renderItems(headings)}</div>
    </Card>
  )
}

export default TableOfContents

