/**
 * =============================================================================
 * Verse Component
 * =============================================================================
 *
 * A unified poetry component providing precise whitespace and layout control
 * for displaying verse content. Based on Gwern's poetry typesetting research.
 *
 * Features:
 * - Three display modes: inline, block, concrete
 * - Caesura marks (/ and ||) with proper styling
 * - Enjambment support with staircase indentation
 * - Orphan prevention (non-breaking spaces)
 * - Line numbering
 * - Rhyme scheme annotations
 * - Hover interaction
 *
 * @author Kris Yotam
 * @type component
 * @path src/components/content/verse.tsx
 * =============================================================================
 */

"use client"

import React, { useMemo, type ReactNode, type JSX } from "react"
import { cn } from "@/lib/utils"

// =============================================================================
// Types
// =============================================================================

export interface VerseProps {
  children?: ReactNode
  content?: string
  className?: string

  // Display mode
  mode?: "inline" | "block" | "concrete"

  // Metadata (optional)
  title?: string
  author?: string
  year?: number

  // Analysis annotations (optional)
  rhymeScheme?: string[]
  meter?: string
  form?: string // "sonnet", "villanelle", "haiku", etc.

  // Layout options
  align?: "left" | "center" | "right"
  numbered?: boolean // line numbers

  // Interaction
  disableHover?: boolean
  disableOrphanPrevention?: boolean
}

interface StanzaProps {
  children: ReactNode
  className?: string
}

interface LineProps {
  children: ReactNode
  className?: string
  lineNumber?: number
  rhyme?: string
  isFirst?: boolean
  isLast?: boolean
}

// =============================================================================
// CSS Variables (inline for portability)
// =============================================================================

const verseStyles = {
  "--verse-font": "'Courier New', monospace",
  "--verse-line-height": "1.6",
  "--verse-stanza-gap": "1.5em",
  "--verse-indent": "2ch",
  "--verse-slash-opacity": "0.4",
  "--verse-caesura-opacity": "0.2",
} as React.CSSProperties

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Prevent orphans by inserting non-breaking space before last word
 */
function preventOrphans(text: string): string {
  const words = text.split(" ")
  if (words.length < 2) return text
  words[words.length - 2] = words[words.length - 2] + "\u00A0"
  return words.slice(0, -1).join(" ") + words[words.length - 1]
}

/**
 * Process caesura marks (/ and ||) into styled spans
 */
function processCaesura(text: string): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = []
  let remaining = text
  let key = 0

  // Process double pipe (||) first - strong caesura
  while (remaining.includes("||")) {
    const idx = remaining.indexOf("||")
    if (idx > 0) parts.push(remaining.slice(0, idx))
    parts.push(
      <span
        key={`caesura-${key++}`}
        className="caesura-mark"
        style={{ opacity: 0.2, letterSpacing: "-0.3em" }}
      >
        ||
      </span>
    )
    remaining = remaining.slice(idx + 2)
  }

  // Process single slash (/) - light caesura
  const finalParts: (string | JSX.Element)[] = []
  for (const part of parts.length > 0 ? parts : [remaining]) {
    if (typeof part !== "string") {
      finalParts.push(part)
      continue
    }

    let str = part
    while (str.includes(" / ")) {
      const idx = str.indexOf(" / ")
      if (idx > 0) finalParts.push(str.slice(0, idx))
      finalParts.push(
        <span
          key={`slash-${key++}`}
          className="slash"
          style={{ opacity: 0.4 }}
        >
          {" / "}
        </span>
      )
      str = str.slice(idx + 3)
    }
    if (str) finalParts.push(str)
  }

  return finalParts.length > 0 ? finalParts : [remaining]
}

/**
 * Parse raw content into stanzas and lines
 */
function parseContent(content: string): string[][] {
  const stanzas: string[][] = []
  const paragraphs = content.split(/\n\s*\n/) // Split on blank lines

  for (const para of paragraphs) {
    const lines = para
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0)
    if (lines.length > 0) {
      stanzas.push(lines)
    }
  }

  return stanzas
}

// =============================================================================
// Sub-components
// =============================================================================

export function VerseStanza({ children, className }: StanzaProps) {
  return (
    <div className={cn("stanza mb-[var(--verse-stanza-gap)] last:mb-0", className)}>
      {children}
    </div>
  )
}

export function VerseLine({
  children,
  className,
  lineNumber,
  rhyme,
  isFirst,
  isLast,
}: LineProps) {
  return (
    <p
      className={cn(
        "line leading-relaxed px-1 transition-colors duration-150 rounded-sm",
        isFirst && "first-line",
        isLast && "last-line",
        className
      )}
      data-line={lineNumber}
      data-rhyme={rhyme}
    >
      {children}
    </p>
  )
}

// =============================================================================
// Main Component
// =============================================================================

export function Verse({
  children,
  content,
  className,
  mode = "block",
  title,
  author,
  year,
  rhymeScheme,
  meter,
  form,
  align = "left",
  numbered = false,
  disableHover = false,
  disableOrphanPrevention = false,
}: VerseProps) {
  // Get content string from children or content prop
  const rawContent = useMemo(() => {
    if (content) return content
    if (typeof children === "string") return children
    // MDX transforms text into React elements (<p> with <br>)
    // Extract the raw text back out
    if (children) {
      const extractText = (node: ReactNode): string => {
        if (typeof node === "string") return node
        if (typeof node === "number") return String(node)
        if (!React.isValidElement(node)) return ""
        const props = node.props as { children?: ReactNode }
        if (node.type === "br") return "\n"
        if (node.type === "p") {
          const inner = React.Children.toArray(props.children).map(extractText).join("")
          return inner + "\n\n"
        }
        if (props.children) {
          return React.Children.toArray(props.children).map(extractText).join("")
        }
        return ""
      }
      const text = React.Children.toArray(children).map(extractText).join("").trim()
      if (text) return text
    }
    return ""
  }, [children, content])

  // Parse content into stanzas
  const stanzas = useMemo(() => parseContent(rawContent), [rawContent])

  // Process lines with caesura and orphan prevention
  const processLine = (line: string): (string | JSX.Element)[] => {
    let processed = line
    if (!disableOrphanPrevention) {
      processed = preventOrphans(processed)
    }
    return processCaesura(processed)
  }

  // =============================================================================
  // Inline Mode
  // =============================================================================

  if (mode === "inline") {
    return (
      <span
        className={cn("verse verse-inline", className)}
        style={{
          fontFamily: "var(--verse-font)",
          ...verseStyles,
        }}
      >
        {processLine(rawContent)}
      </span>
    )
  }

  // =============================================================================
  // Concrete Mode
  // =============================================================================

  if (mode === "concrete") {
    return (
      <div
        className={cn("verse verse-concrete", className)}
        style={{
          fontFamily: "var(--verse-font)",
          whiteSpace: "pre",
          lineHeight: "var(--verse-line-height)",
          ...verseStyles,
        }}
      >
        {rawContent}
      </div>
    )
  }

  // =============================================================================
  // Block Mode (Default)
  // =============================================================================

  let lineCounter = 0

  const verseContent = (
    <div
      className={cn(
        "verse verse-block",
        `text-${align}`,
        numbered && "verse-numbered",
        !disableHover && "verse-hoverable",
        className
      )}
      style={{
        fontFamily: "var(--verse-font)",
        lineHeight: "var(--verse-line-height)",
        ...verseStyles,
      }}
    >
      {stanzas.map((stanza, stanzaIdx) => (
        <VerseStanza key={stanzaIdx}>
          {stanza.map((line, lineIdx) => {
            const currentLineNum = ++lineCounter
            const rhyme = rhymeScheme?.[currentLineNum - 1]
            return (
              <VerseLine
                key={lineIdx}
                lineNumber={numbered ? currentLineNum : undefined}
                rhyme={rhyme}
                isFirst={lineIdx === 0}
                isLast={lineIdx === stanza.length - 1}
                className={cn(
                  !disableHover && "hover:bg-secondary/80 dark:hover:bg-secondary/60 cursor-pointer"
                )}
              >
                {numbered && (
                  <span className="inline-block w-8 text-muted-foreground text-right mr-4 select-none">
                    {currentLineNum}
                  </span>
                )}
                {processLine(line)}
                {rhyme && (
                  <span className="ml-4 text-muted-foreground text-sm select-none">
                    {rhyme}
                  </span>
                )}
              </VerseLine>
            )
          })}
        </VerseStanza>
      ))}
    </div>
  )

  // Wrap in figure if metadata is provided
  if (title || author || meter || form) {
    return (
      <figure className="verse-container">
        {(title || author) && (
          <header className="verse-header mb-4">
            {title && <h3 className="verse-title text-lg font-semibold">{title}</h3>}
            {author && (
              <p className="verse-author text-sm text-muted-foreground">
                By {author}
                {year && `, ${year}`}
              </p>
            )}
          </header>
        )}

        {verseContent}

        {(form || meter) && (
          <footer className="verse-footer mt-4 text-sm text-muted-foreground flex gap-4">
            {form && <span className="verse-form">{form}</span>}
            {meter && <span className="verse-meter">{meter}</span>}
          </footer>
        )}
      </figure>
    )
  }

  return verseContent
}

// =============================================================================
// Backward Compatibility Aliases
// =============================================================================

/** PoemBox — handles MDX React children and wraps in the /verse-style frame */

type PoemItem =
  | { type: "line"; content: ReactNode[] }
  | { type: "stanza" }

function extractItems(children: ReactNode): PoemItem[] {
  const items: PoemItem[] = []
  const nodes = React.Children.toArray(children)

  nodes.forEach((node, idx) => {
    if (React.isValidElement<{ children?: ReactNode }>(node) && node.type === "p") {
      const inline = React.Children.toArray(node.props.children)
      let current: ReactNode[] = []
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

interface PoemBoxProps {
  children: ReactNode
  className?: string
  disableHover?: boolean
  author?: string
  title?: string
}

export function PoemBox({ children, className, disableHover = false, author, title }: PoemBoxProps) {
  const items = extractItems(children)
  const lineClass = disableHover
    ? "px-1 transition-colors"
    : "px-1 transition-colors hover:bg-secondary/80 dark:hover:bg-secondary/60 cursor-pointer"

  return (
    <div className={cn(
      "p-6 my-6 rounded-none bg-muted/50 dark:bg-[hsl(var(--popover))] space-y-1",
      className
    )}>
      {(title || author) && (
        <div className="text-center mb-6 pb-4 border-b border-[hsl(var(--border))]">
          {title && (
            <h3 className="text-lg font-medium font-serif m-0 mb-2 p-0 text-center">{title}</h3>
          )}
          {author && (
            <p className="text-sm text-muted-foreground italic m-0 p-0 text-center">
              By {author}
            </p>
          )}
        </div>
      )}

      {items.map((item, idx) => {
        if (item.type === "stanza") {
          return (
            <React.Fragment key={idx}>
              <div className={lineClass} style={{ height: "1.5rem" }}>&nbsp;</div>
            </React.Fragment>
          )
        }
        return (
          <div key={idx} className={lineClass}>
            {item.content}
          </div>
        )
      })}
    </div>
  )
}

export { Verse as Poem }

// =============================================================================
// VerseBox — compact verse for embedding in posts (not /verse route)
// =============================================================================

interface VerseBoxProps {
  children: ReactNode
  className?: string
  author?: string
  title?: string
}

/** VerseBox — compact post-embedded verse with tight line spacing, no hover */
export function VerseBox({ children, className, author, title }: VerseBoxProps) {
  const items = extractItems(children)

  return (
    <div className={cn(
      "px-6 py-4 my-6 rounded-none bg-muted/50 dark:bg-[hsl(var(--popover))]",
      className
    )}>
      {(title || author) && (
        <div className="text-center mb-4 pb-3 border-b border-[hsl(var(--border))]">
          {title && (
            <h3 className="text-base font-medium font-serif m-0 mb-1 p-0 text-center">{title}</h3>
          )}
          {author && (
            <p className="text-sm text-muted-foreground italic m-0 p-0 text-center">
              {author}
            </p>
          )}
        </div>
      )}

      <div style={{ lineHeight: "1.35", fontSize: "0.92em" }}>
        {items.map((item, idx) => {
          if (item.type === "stanza") {
            return <div key={idx} style={{ height: "0.75em" }} />
          }
          return (
            <div key={idx} className="py-[1px]">
              {item.content}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// =============================================================================
// Display Component (for poem pages)
// =============================================================================

export interface VerseDisplayProps {
  content: string
  className?: string
  isLoading?: boolean
  error?: string | null
}

/**
 * VerseDisplay - Wrapper for displaying poem content on poem pages.
 * Handles loading states and errors, expands to full height (no scrolling).
 */
export function VerseDisplay({
  content,
  className,
  isLoading = false,
  error = null,
}: VerseDisplayProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          "p-6 my-6 rounded-none bg-muted/50 dark:bg-[hsl(var(--popover))]",
          className
        )}
      >
        <div className="flex items-center justify-center py-8">
          <div className="text-muted-foreground animate-pulse">Loading...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div
        className={cn(
          "p-6 my-6 rounded-none bg-muted/50 dark:bg-[hsl(var(--popover))]",
          className
        )}
      >
        <div className="text-red-500 py-4 text-center">{error}</div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "p-6 my-6 rounded-none bg-muted/50 dark:bg-[hsl(var(--popover))]",
        className
      )}
    >
      <Verse content={content} />
    </div>
  )
}
