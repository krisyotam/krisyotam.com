// components/posts/typography/poem.tsx
"use client"

import React from "react"
import { cn } from "@/lib/utils"

export interface PoemBoxProps {
  children: React.ReactNode
  className?: string
  disableHover?: boolean
}

type Item =
  | { type: "line"; content: React.ReactNode[] }
  | { type: "stanza" }

function extractItems(children: React.ReactNode): Item[] {
  const items: Item[] = []
  const nodes = React.Children.toArray(children)

  nodes.forEach((node, idx) => {
    if (React.isValidElement(node) && node.type === "p") {
      const inline = React.Children.toArray(node.props.children as React.ReactNode)
      let current: React.ReactNode[] = []
      inline.forEach(child => {
        if (React.isValidElement(child) && child.type === "br") {
          items.push({ type: "line", content: current })
          current = []
        } else {
          current.push(child)
        }
      })
      if (current.length) items.push({ type: "line", content: current })
      if (
        idx < nodes.length - 1 &&
        React.isValidElement(nodes[idx + 1]) &&
        (nodes[idx + 1] as React.ReactElement).type === "p"
      ) {
        items.push({ type: "stanza" })
      }
    } else if (typeof node === "string") {
      const parts = node.split("\n")
      parts.forEach((text, i) => {
        if (text) {
          items.push({ type: "line", content: [text] })
        } else if (i < parts.length - 1) {
          items.push({ type: "stanza" })
        }
      })
    } else {
      items.push({ type: "line", content: [node] })
    }
  })

  return items
}

export function PoemBox({ children, className, disableHover = false }: PoemBoxProps) {
  const items = extractItems(children)
  const base = cn(
    "p-6 my-6 rounded-none bg-muted/50 dark:bg-[hsl(var(--popover))] " +
      "overflow-y-auto max-h-[500px] space-y-1",
    className
  )

  // Define line class with or without hover effect
  const lineClass = disableHover 
    ? "px-1 transition-colors" 
    : "poem-line px-1 transition-colors"

  return (
    <div className={base}>
      {items.map((item, idx) => {
        if (item.type === "stanza") {
          // Create 2 empty lines for stanza spacing, each with its own hover effect
          return (
            <React.Fragment key={idx}>
              <div className={lineClass} style={{ height: "1.5rem" }}>&nbsp;</div>
              <div className={lineClass} style={{ height: "1.5rem" }}>&nbsp;</div>
            </React.Fragment>
          )
        } else {
          return (
            <div key={idx} className={lineClass}>
              {item.content}
            </div>
          )
        }
      })}

      {!disableHover && (
        <style jsx global>{`
          .poem-line {
            background-color: transparent !important;
          }
          .poem-line:hover {
            background-color: #e5e5e5 !important;
          }
          :global(.dark) .poem-line:hover {
            background-color: #2a2a2a !important;
          }
        `}</style>
      )}
    </div>
  )
}
