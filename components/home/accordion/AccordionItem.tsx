/**
 * Accordion Item Component
 * @author Kris Yotam
 * @date 2025-12-29
 * @description Collapsible section with title and content
 */

import type React from "react"

interface AccordionItemProps {
  title: string
  content: React.ReactNode
  isOpen: boolean
  onToggle: () => void
}

export function AccordionItem({
  title,
  content,
  isOpen,
  onToggle
}: AccordionItemProps) {
  const slug = title.toLowerCase().replace(/\s+/g, "-")

  return (
    <div className="border-b border-border" id={slug}>
      <button
        onClick={onToggle}
        className="w-full py-8 flex justify-between items-center text-left"
        aria-expanded={isOpen}
        aria-controls={`section-${slug}`}
      >
        <h2 className="text-2xl font-normal text-foreground">
          <a className="hover:text-primary transition-colors">
            {title}
          </a>
        </h2>
        {isOpen ? (
          <span className="text-2xl text-foreground" aria-hidden="true">
            -
          </span>
        ) : (
          <span className="text-2xl text-foreground" aria-hidden="true">
            +
          </span>
        )}
      </button>
      <div
        id={`section-${slug}`}
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[5000px] mb-8" : "max-h-0"
        }`}
      >
        {content}
      </div>
    </div>
  )
}
