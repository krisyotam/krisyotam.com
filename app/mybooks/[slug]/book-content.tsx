"use client"

import { useState, useEffect } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

interface BookContentProps {
  htmlContent: string
}

export function BookContent({ htmlContent }: BookContentProps) {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([])
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    // Extract headings from content
    const parser = new DOMParser()
    const doc = parser.parseFromString(htmlContent, "text/html")
    const headingElements = doc.querySelectorAll("h1, h2, h3, h4, h5, h6")

    const extractedHeadings = Array.from(headingElements).map((heading) => {
      const level = Number.parseInt(heading.tagName.substring(1))
      const text = heading.textContent || ""
      const id = heading.id || text.toLowerCase().replace(/[^\w]+/g, "-")

      return { id, text, level }
    })

    setHeadings(extractedHeadings)
  }, [htmlContent])

  return (
    <>
      {headings.length > 0 && (
        <div className="mb-8 border rounded-lg overflow-hidden shadow-sm">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between w-full p-4 bg-muted/20 font-medium"
            style={{ fontFamily: "Georgia, serif" }}
          >
            <span className="text-lg">Table of Contents</span>
            {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
          </button>

          {isOpen && (
            <div className="p-4 pt-3 space-y-1 bg-background/80">
              {headings.map((heading, index) => (
                <a
                  key={index}
                  href={`#${heading.id}`}
                  className="block py-1 hover:underline text-muted-foreground hover:text-foreground transition-colors"
                  style={{
                    marginLeft: `${(heading.level - 1) * 0.85}rem`,
                    fontSize: heading.level === 1 ? "0.95rem" : "0.9rem",
                    lineHeight: "1.4",
                    fontFamily: "Georgia, serif",
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
      )}

      <style jsx global>{`
        /* Elegant markdown styling with !important */
        .book-content {
          font-family: 'Georgia', serif !important;
          line-height: 1.6 !important;
          color: var(--foreground) !important;
          letter-spacing: 0.01em !important;
        }
        
        .book-content h1, 
        .book-content h2, 
        .book-content h3, 
        .book-content h4, 
        .book-content h5, 
        .book-content h6 {
          font-family: 'Georgia', serif !important;
          margin-top: 1.8rem !important;
          margin-bottom: 0.8rem !important;
          font-weight: 700 !important;
          line-height: 1.3 !important;
          color: var(--foreground) !important;
        }
        
        .book-content h1 {
          font-size: 2rem !important;
          border-bottom: 1px solid var(--border) !important;
          padding-bottom: 0.5rem !important;
          margin-bottom: 1.2rem !important;
          text-align: center !important;
        }
        
        .book-content h2 {
          font-size: 1.6rem !important;
          margin-top: 1.6rem !important;
          position: relative !important;
        }
        
        .book-content h2:after {
          content: "" !important;
          display: block !important;
          width: 50px !important;
          height: 2px !important;
          background-color: var(--border) !important;
          margin-top: 0.3rem !important;
        }
        
        .book-content h3 {
          font-size: 1.4rem !important;
          margin-top: 1.4rem !important;
          font-style: italic !important;
        }
        
        .book-content h4 {
          font-size: 1.2rem !important;
          margin-top: 1.2rem !important;
        }
        
        .book-content h5, .book-content h6 {
          font-size: 1.1rem !important;
          margin-top: 1rem !important;
          font-style: italic !important;
        }
        
        .book-content p {
          margin-top: 0.7rem !important;
          margin-bottom: 0.7rem !important;
          line-height: 1.7 !important;
          text-align: justify !important;
        }
        
        .book-content a {
          color: var(--primary) !important;
          text-decoration: none !important;
          border-bottom: 1px dotted var(--primary) !important;
          transition: border-color 0.2s ease !important;
        }
        
        .book-content a:hover {
          border-bottom: 1px solid var(--primary) !important;
        }
        
        .book-content blockquote {
          border-left: 3px solid var(--border) !important;
          padding: 0.8rem 1.2rem !important;
          margin: 1.5rem 0 !important;
          background-color: var(--muted) !important;
          border-radius: 0 4px 4px 0 !important;
          font-style: italic !important;
          color: var(--muted-foreground) !important;
          position: relative !important;
        }
        
        .book-content blockquote:before {
          content: '"' !important;
          font-size: 3rem !important;
          font-family: Georgia, serif !important;
          color: var(--border) !important;
          position: absolute !important;
          left: 0.5rem !important;
          top: -1rem !important;
          opacity: 0.5 !important;
        }
        
        .book-content blockquote p {
          margin: 0.5rem 0 !important;
          line-height: 1.6 !important;
        }
        
        .book-content ul, .book-content ol {
          padding-left: 1.8rem !important;
          margin: 0.8rem 0 !important;
        }
        
        .book-content li {
          margin-bottom: 0.4rem !important;
          line-height: 1.6 !important;
        }
        
        .book-content code {
          font-family: 'Courier New', monospace !important;
          background-color: var(--muted) !important;
          padding: 0.2rem 0.4rem !important;
          border-radius: 3px !important;
          font-size: 0.9em !important;
          color: var(--foreground) !important;
        }
        
        .book-content pre {
          background-color: var(--muted) !important;
          padding: 1.2rem !important;
          border-radius: 5px !important;
          overflow-x: auto !important;
          margin: 1.2rem 0 !important;
          border: 1px solid var(--border) !important;
        }
        
        .book-content pre code {
          background-color: transparent !important;
          padding: 0 !important;
          border-radius: 0 !important;
          font-size: 0.9em !important;
          color: var(--foreground) !important;
          line-height: 1.5 !important;
        }
        
        .book-content img {
          max-width: 100% !important;
          height: auto !important;
          border-radius: 5px !important;
          margin: 1.5rem auto !important;
          display: block !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
          border: 1px solid var(--border) !important;
        }
        
        .book-content hr {
          border: 0 !important;
          height: 1px !important;
          background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0)) !important;
          margin: 2rem 0 !important;
        }
        
        .book-content table {
          width: 100% !important;
          border-collapse: separate !important;
          border-spacing: 0 !important;
          margin: 1.5rem 0 !important;
          border: 1px solid var(--border) !important;
          border-radius: 5px !important;
          overflow: hidden !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05) !important;
        }
        
        .book-content th {
          background-color: var(--muted) !important;
          font-weight: 600 !important;
          text-align: left !important;
          padding: 0.8rem 1rem !important;
          border-bottom: 2px solid var(--border) !important;
          font-family: 'Georgia', serif !important;
        }
        
        .book-content td {
          padding: 0.8rem 1rem !important;
          border-bottom: 1px solid var(--border) !important;
          border-right: 1px solid var(--border) !important;
        }
        
        .book-content td:last-child {
          border-right: none !important;
        }
        
        .book-content tr:last-child td {
          border-bottom: none !important;
        }
        
        .book-content tr:nth-child(even) {
          background-color: var(--muted) !important;
        }
        
        /* First letter styling for paragraphs after headings */
        .book-content h1 + p:first-letter,
        .book-content h2 + p:first-letter {
          font-size: 1.5em !important;
          font-weight: bold !important;
          float: left !important;
          margin-right: 0.1em !important;
          line-height: 1 !important;
        }
        
        /* Footnotes */
        .book-content .footnote {
          font-size: 0.9em !important;
          color: var(--muted-foreground) !important;
          margin-top: 2rem !important;
          padding-top: 1rem !important;
          border-top: 1px solid var(--border) !important;
        }
        
        /* Chapter styling */
        .book-content .chapter {
          page-break-before: always !important;
          margin-top: 3rem !important;
        }
        
        /* Spacing adjustments */
        .book-content h1 + p,
        .book-content h2 + p,
        .book-content h3 + p,
        .book-content h4 + p,
        .book-content h5 + p,
        .book-content h6 + p {
          margin-top: 0.5rem !important;
        }
        
        /* First paragraph after a heading */
        .book-content h1 + p,
        .book-content h2 + p {
          text-indent: 0 !important;
        }
        
        /* Subsequent paragraphs */
        .book-content p + p {
          text-indent: 1.5em !important;
          margin-top: 0.3rem !important;
        }
      `}</style>

      <div
        className="prose dark:prose-invert max-w-none book-content"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </>
  )
}

