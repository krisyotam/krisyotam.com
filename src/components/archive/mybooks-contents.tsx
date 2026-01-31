"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface TableOfContentsProps {
  content: string
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([])
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    // Extract headings from content
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, "text/html")
    const headingElements = doc.querySelectorAll("h1, h2, h3, h4, h5, h6")

    const extractedHeadings = Array.from(headingElements).map((heading) => {
      const level = Number.parseInt(heading.tagName.substring(1))
      const text = heading.textContent || ""
      const id = heading.id || text.toLowerCase().replace(/[^\w]+/g, "-")

      return { id, text, level }
    })

    setHeadings(extractedHeadings)
  }, [content])

  if (headings.length === 0) {
    return null
  }

  return (
    <div className="mb-6 border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-3 bg-muted/30 font-medium"
        style={{ fontSize: "1rem !important" }}
      >
        Table of Contents
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {isOpen && (
        <div className="p-3 pt-2 space-y-0">
          {headings.map((heading, index) => (
            <a
              key={index}
              href={`#${heading.id}`}
              className="block py-1 text-sm hover:underline text-muted-foreground hover:text-foreground transition-colors"
              style={{
                marginLeft: `${(heading.level - 1) * 0.75}rem !important`,
                fontSize: "0.85rem !important",
                lineHeight: "1.2 !important",
              }}
              onClick={(e) => {
                e.preventDefault()
                const element = document.getElementById(heading.id)
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" })
                }
              }}
            >
              {heading.text}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

