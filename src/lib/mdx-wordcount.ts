/**
 * TYPES: MDX Word Count
 * File:  mdx-wordcount.ts
 *
 * Contains:
 *   - countMdxWords: strips frontmatter, code blocks, JSX/MDX, imports → counts words
 *   - readingTime: converts word count to "~N min" string
 *
 * Notes:
 *   Server-only (uses fs). Do not import from client components.
 */

import fs from "fs"
import path from "path"

const FRONTMATTER_RE = /^---[\s\S]*?---\n?/
const FENCED_BLOCK_RE = /^(\s*(`{3,}|~{3,}).*)\n[\s\S]*?\n\s*\2\s*$/gm
const IMPORT_EXPORT_RE = /^\s*(import|export)\s+.*$/gm
const SELF_CLOSING_JSX_RE = /<[A-Z][A-Za-z0-9]*\b[^>]*\/>/g
const JSX_TAG_RE = /<\/?[A-Z][A-Za-z0-9]*\b[^>]*>/g
const HTML_TAG_RE = /<\/?[a-z][a-zA-Z]*[^>]*>/g
const WORD_RE = /[A-Za-z0-9]+(?:['\-][A-Za-z0-9]+)*/g

/**
 * Count words in raw MDX content, excluding:
 * - YAML frontmatter
 * - Fenced code blocks
 * - import/export statements
 * - JSX/MDX components (self-closing and wrapped)
 * - HTML tags
 */
export function countMdxWords(raw: string): number {
  let text = raw

  // Strip frontmatter
  text = text.replace(FRONTMATTER_RE, "")

  // Strip fenced code blocks
  text = stripFencedBlocks(text)

  // Strip import/export lines
  text = text.replace(IMPORT_EXPORT_RE, "")

  // Strip self-closing JSX components entirely, strip tags (but keep inner text) for wrapping components
  text = text.replace(SELF_CLOSING_JSX_RE, "")
  text = text.replace(JSX_TAG_RE, "")

  // Strip remaining HTML tags
  text = text.replace(HTML_TAG_RE, "")

  const matches = text.match(WORD_RE)
  return matches ? matches.length : 0
}

/**
 * Strip fenced code blocks line-by-line (handles nested/edge cases better than regex).
 */
function stripFencedBlocks(text: string): string {
  const lines = text.split("\n")
  const output: string[] = []
  let inBlock = false
  let fence: string | null = null

  for (const line of lines) {
    const match = line.match(/^\s*(`{3,}|~{3,})/)
    if (match) {
      if (!inBlock) {
        inBlock = true
        fence = match[1][0] // ` or ~
      } else if (fence && line.trim().startsWith(fence[0].repeat(3))) {
        inBlock = false
        fence = null
      }
      continue
    }
    if (!inBlock) {
      output.push(line)
    }
  }

  return output.join("\n")
}

/**
 * Convert word count to reading time string.
 * Uses 200 wpm average. Shows seconds for very short content (<90 words).
 */
export function readingTime(wordCount: number): string {
  if (wordCount === 0) return "—"
  const totalSeconds = Math.round((wordCount / 200) * 60)
  if (totalSeconds < 60) return `~${totalSeconds}s`
  const minutes = Math.round(wordCount / 200)
  return `~${Math.max(1, minutes)} min`
}

/**
 * Read an MDX file from the content directory and return its word count.
 */
export function getWordCount(contentDir: string, slug: string): number {
  const filePath = path.join(process.cwd(), "src", "content", contentDir, `${slug}.mdx`)
  try {
    const raw = fs.readFileSync(filePath, "utf-8")
    return countMdxWords(raw)
  } catch {
    return 0
  }
}
