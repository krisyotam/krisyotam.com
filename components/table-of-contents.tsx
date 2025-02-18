"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface TOCItem {
  id: string
  text: string
  level: number
}

export function TableOfContents({ content }: { content: string }) {
  const [toc, setToc] = useState<TOCItem[]>([])
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, "text/html")
    const headings = doc.querySelectorAll("h1, h2, h3, h4, h5, h6")
    const tocItems: TOCItem[] = Array.from(headings).map((heading, index) => ({
      id: `heading-${index}`,
      text: heading.textContent || "",
      level: Number.parseInt(heading.tagName[1]),
    }))
    setToc(tocItems)

    // Add IDs to the actual content
    const contentElement = document.querySelector(".book-content")
    if (contentElement) {
      const realHeadings = contentElement.querySelectorAll("h1, h2, h3, h4, h5, h6")
      realHeadings.forEach((heading, index) => {
        heading.id = `heading-${index}`
      })
    }
  }, [content]) // Added content to the dependency array

  if (toc.length === 0) return null

  return (
    <div className="mb-8 border rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 bg-secondary text-secondary-foreground font-semibold"
      >
        Table of Contents
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>
      {isOpen && (
        <nav className="p-4">
          <ul className="space-y-2">
            {toc.map((item) => (
              <li key={item.id} style={{ marginLeft: `${(item.level - 1) * 1.5}rem` }}>
                <a
                  href={`#${item.id}`}
                  className="text-sm hover:underline cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault()
                    const element = document.getElementById(item.id)
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" })
                    }
                  }}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  )
}

