/* =============================================================================
 * MDX UTILITIES
 * =============================================================================
 *
 * Centralized MDX and Markdown processing for the entire site. All content
 * parsing, heading extraction, and markdown rendering should go through
 * this module for consistency.
 *
 * -----------------------------------------------------------------------------
 * @file        mdx.ts
 * @author      Kris Yotam
 * @created     2026-01-01
 * @modified    2026-01-01
 * @license     MIT
 * -----------------------------------------------------------------------------
 *
 * ARCHITECTURE
 * ------------
 * This module provides a unified interface for:
 *   1. Extracting headings from MDX content (for table of contents)
 *   2. Processing markdown to HTML
 *   3. Handling math expressions via lib/math.ts
 *   4. Reading MDX/MD files from the filesystem
 *
 * CONTENT STRUCTURE
 * -----------------
 * Content is organized under app/(content)/ with this pattern:
 *   - app/(content)/[type]/content/[category]/[slug].mdx
 *   - app/(content)/[type]/content/[slug].mdx (for flat types like til, now)
 *
 * USAGE
 * -----
 * Extract headings for TOC:
 *   import { extractHeadings } from "@/lib/mdx"
 *   const headings = await extractHeadings("essays", "my-essay", "philosophy")
 *
 * Process markdown to HTML:
 *   import { processMarkdown } from "@/lib/mdx"
 *   const html = await processMarkdown(markdownString)
 *
 * Read raw MDX content:
 *   import { readMdxFile } from "@/lib/mdx"
 *   const content = readMdxFile("essays", "my-essay", "philosophy")
 *
 * ============================================================================= */

import type React from "react"
import fs from "fs"
import path from "path"
import { compileMDX } from "next-mdx-remote/rsc"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"
import matter from "gray-matter"
import { remark } from "remark"
import remarkMdx from "remark-mdx"
import remarkMath from "remark-math"
import remarkHtml from "remark-html"
import rehypeRaw from "rehype-raw"
import rehypeHighlight from "rehype-highlight"
import rehypeStringify from "rehype-stringify"
import remarkRehype from "remark-rehype"
import { unified } from "unified"
import remarkParse from "remark-parse"
import { visit } from "unist-util-visit"
import type { Heading as MdastHeading } from "mdast"

import { preprocessMath } from "./math"

/* -----------------------------------------------------------------------------
 * TYPES - FRONTMATTER & CONTENT
 * ----------------------------------------------------------------------------- */

/** Frontmatter metadata for MDX posts */
export interface MDXFrontmatter {
  title: string
  date: string
  tags: string[]
  category: string
  slug: string
  status?: string
  preview?: string
  confidence?: string
  importance?: number
  headings?: TOCHeading[]
  marginNotes?: MarginNote[]
  bibliography?: BibliographyEntry[]
}

/** Heading entry for table of contents */
export interface TOCHeading {
  id: string
  text: string
  level: number
  children?: TOCHeading[]
  number?: string
}

/** Margin note definition */
export interface MarginNote {
  id: string
  title: string
  content: string
  index: number
  source?: string
  priority?: number
}

/** Bibliography/citation entry */
export interface BibliographyEntry {
  id: string
  author: string
  title: string
  year: number
  publisher: string
  url: string
  type: string
}

/** Compiled MDX post with content and metadata */
export interface MDXPost {
  content: React.ReactNode
  frontmatter: MDXFrontmatter
}

/* -----------------------------------------------------------------------------
 * TYPES - TABLE OF CONTENTS
 * ----------------------------------------------------------------------------- */

/** Table of contents item (simplified version of TOCHeading) */
export interface TableOfContentsItem {
  id: string
  text: string
  level: number
}

/** Processed markdown result */
export interface ProcessedMarkdown {
  html: string
  headings: TableOfContentsItem[]
}

/* -----------------------------------------------------------------------------
 * TYPES - CONTENT TYPES
 * ----------------------------------------------------------------------------- */

export type ContentType =
  | "essays"
  | "notes"
  | "blog"
  | "fiction"
  | "papers"
  | "reviews"
  | "news"
  | "ocs"
  | "til"
  | "now"
  | "verse"
  | "proofs"
  | "problems"
  | "lectures"
  | "lab"
  | "dossiers"
  | "cases"
  | "conspiracies"
  | "libers"
  | "shortform"
  | "links"
  | "progymnasmata"

/* -----------------------------------------------------------------------------
 * CONSTANTS
 * ----------------------------------------------------------------------------- */

/** Content types that require a category parameter */
export const CATEGORIZED_CONTENT_TYPES: ContentType[] = [
  "essays",
  "fiction",
  "papers",
  "reviews",
  "news",
  "ocs",
  "dossiers",
  "cases",
  "conspiracies",
  "libers",
  "proofs",
  "problems",
  "lectures",
  "lab",
  "links",
  "progymnasmata",
]

/** Content types that use flat structure (no category) */
export const FLAT_CONTENT_TYPES: ContentType[] = ["til", "now", "shortform"]

/** Content types that optionally use categories */
export const OPTIONAL_CATEGORY_TYPES: ContentType[] = ["notes", "blog", "verse"]

/* -----------------------------------------------------------------------------
 * PATH RESOLUTION
 * ----------------------------------------------------------------------------- */

/**
 * Get the base content directory for a content type.
 */
export function getContentBasePath(contentType: ContentType): string {
  return path.join(process.cwd(), "src", "app", "(content)", contentType, "content")
}

/**
 * Resolve the full path to an MDX file.
 */
export function resolveMdxPath(
  contentType: ContentType,
  slug: string,
  category?: string
): string | null {
  const basePath = getContentBasePath(contentType)

  // Categorized content requires a category
  if (CATEGORIZED_CONTENT_TYPES.includes(contentType)) {
    if (!category) {
      console.error(`Category is required for ${contentType} content type`)
      return null
    }
    return path.join(basePath, category, `${slug}.mdx`)
  }

  // Flat content types
  if (FLAT_CONTENT_TYPES.includes(contentType)) {
    return path.join(basePath, `${slug}.mdx`)
  }

  // Optional category types - try with category first, then without
  if (OPTIONAL_CATEGORY_TYPES.includes(contentType)) {
    if (category) {
      const categoryPath = path.join(basePath, category, `${slug}.mdx`)
      if (fs.existsSync(categoryPath)) {
        return categoryPath
      }
    }
    return path.join(basePath, `${slug}.mdx`)
  }

  console.error(`Unknown content type: ${contentType}`)
  return null
}

/* -----------------------------------------------------------------------------
 * FILE READING
 * ----------------------------------------------------------------------------- */

/**
 * Read raw MDX/MD content from a file.
 */
export function readMdxFile(
  contentType: ContentType,
  slug: string,
  category?: string
): string | null {
  const filePath = resolveMdxPath(contentType, slug, category)
  if (!filePath) return null

  if (!fs.existsSync(filePath)) {
    const mdPath = filePath.replace(/\.mdx$/, ".md")
    if (fs.existsSync(mdPath)) {
      return fs.readFileSync(mdPath, "utf8")
    }
    console.log(`MDX file not found: ${filePath}`)
    return null
  }

  return fs.readFileSync(filePath, "utf8")
}

/**
 * Read raw content from an arbitrary file path.
 */
export function readFile(filePath: string): string | null {
  const fullPath = path.join(process.cwd(), filePath)
  if (!fs.existsSync(fullPath)) {
    console.log(`File not found: ${fullPath}`)
    return null
  }
  return fs.readFileSync(fullPath, "utf8")
}

/* -----------------------------------------------------------------------------
 * HEADING EXTRACTION
 * ----------------------------------------------------------------------------- */

/**
 * Extract headings from MDX content for table of contents.
 * Properly handles math expressions in headings.
 */
export async function extractHeadings(
  contentType: ContentType,
  slug: string,
  category?: string
): Promise<TableOfContentsItem[]> {
  const content = readMdxFile(contentType, slug, category)
  if (!content) return []
  return extractHeadingsFromContent(content)
}

/**
 * Strip custom frontmatter from MDX content.
 * Removes everything between # ===... blocks at the start of the file.
 */
function stripCustomFrontmatter(content: string): string {
  const lines = content.split('\n')
  let contentStartIndex = 0
  let frontmatterBlockCount = 0

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    // Count # ===... delimiter lines
    if (line.startsWith('# ') && line.includes('='.repeat(10))) {
      frontmatterBlockCount++
      // After the fourth delimiter (end of YAML block), content starts
      // Structure: 1) comment header start, 2) comment header end,
      //            3) YAML block start, 4) YAML block end
      if (frontmatterBlockCount >= 4) {
        contentStartIndex = i + 1
        break
      }
    }
  }

  // Skip any empty lines after the frontmatter
  while (contentStartIndex < lines.length && lines[contentStartIndex].trim() === '') {
    contentStartIndex++
  }

  return lines.slice(contentStartIndex).join('\n')
}

/**
 * Extract headings from a raw MDX/MD string.
 */
export async function extractHeadingsFromContent(
  content: string
): Promise<TableOfContentsItem[]> {
  const headings: TableOfContentsItem[] = []

  // Strip custom frontmatter before parsing
  const strippedContent = stripCustomFrontmatter(content)

  try {
    const processor = remark().use(remarkMdx).use(remarkMath)
    const ast = processor.parse(strippedContent)

    visit(ast, "heading", (node: MdastHeading) => {
      let text = ""

      visit(node, (childNode: any) => {
        if (childNode.type === "text") {
          text += childNode.value
        } else if (childNode.type === "inlineMath") {
          text += `$${childNode.value}$`
        } else if (childNode.type === "math") {
          text += `$$${childNode.value}$$`
        }
      })

      if (!text.trim()) return

      const cleanText = text.replace(/\$\$.*?\$\$/g, "").replace(/\$.*?\$/g, "").trim()
      const id =
        cleanText
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") || "heading"

      headings.push({
        id,
        text: text.trim(),
        level: node.depth,
      })
    })

    return headings
  } catch (error) {
    console.error("Error extracting headings:", error)
    return []
  }
}

/* -----------------------------------------------------------------------------
 * MARKDOWN PROCESSING
 * ----------------------------------------------------------------------------- */

/**
 * Process markdown content to HTML.
 * Includes math rendering, syntax highlighting, and GFM support.
 */
export async function processMarkdown(
  content: string,
  options: {
    math?: boolean
    highlight?: boolean
    gfm?: boolean
    allowHtml?: boolean
  } = {}
): Promise<string> {
  const { math = true, highlight = true, gfm = true, allowHtml = true } = options

  let processedContent = content

  if (math) {
    processedContent = preprocessMath(processedContent)
  }

  // Build plugins array dynamically
  const remarkPlugins: any[] = [remarkParse]
  if (gfm) {
    remarkPlugins.push(remarkGfm)
  }

  const rehypePlugins: any[] = []
  if (allowHtml) {
    rehypePlugins.push(rehypeRaw)
  }
  if (highlight) {
    rehypePlugins.push(rehypeHighlight)
  }

  // Create pipeline with all plugins
  const result = await unified()
    .use(remarkParse)
    .use(gfm ? remarkGfm : () => {})
    .use(remarkRehype, { allowDangerousHtml: allowHtml })
    .use(allowHtml ? rehypeRaw : () => {})
    .use(highlight ? rehypeHighlight : () => {})
    .use(rehypeStringify)
    .process(processedContent)

  return String(result)
}

/**
 * Process markdown with heading extraction.
 */
export async function processMarkdownWithHeadings(
  content: string
): Promise<ProcessedMarkdown> {
  const [html, headings] = await Promise.all([
    processMarkdown(content),
    extractHeadingsFromContent(content),
  ])
  return { html, headings }
}

/**
 * Simple markdown to HTML (no math, no highlighting).
 */
export async function processSimpleMarkdown(content: string): Promise<string> {
  const result = await remark().use(remarkHtml).process(content)
  return String(result)
}

/* -----------------------------------------------------------------------------
 * CONTENT UTILITIES
 * ----------------------------------------------------------------------------- */

/** Generate a slug from a string */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

/** Generate an ID for a heading */
export function headingToId(text: string, prefix?: string): string {
  const cleanText = text.replace(/\$\$.*?\$\$/g, "").replace(/\$.*?\$/g, "").trim()
  const baseId = slugify(cleanText) || "heading"
  return prefix ? `${prefix}-${baseId}` : baseId
}

/** Check if a file exists */
export function fileExists(filePath: string): boolean {
  return fs.existsSync(path.join(process.cwd(), filePath))
}

/** List all MDX files in a content directory */
export function listMdxFiles(contentType: ContentType, category?: string): string[] {
  const basePath = getContentBasePath(contentType)
  const dirPath = category ? path.join(basePath, category) : basePath

  if (!fs.existsSync(dirPath)) return []

  const files = fs.readdirSync(dirPath)
  return files
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .map((f) => f.replace(/\.(mdx|md)$/, ""))
}

/* -----------------------------------------------------------------------------
 * LEGACY MDX COMPILATION (for next-mdx-remote)
 * ----------------------------------------------------------------------------- */

/**
 * Get an MDX post by slug (legacy function).
 * @deprecated Use dynamic imports instead
 */
export async function getMDXPost(year: string, slug: string): Promise<MDXPost | null> {
  const filePath = path.join(process.cwd(), "app/essays", year, slug, "page.mdx")

  if (!fs.existsSync(filePath)) {
    return null
  }

  const source = fs.readFileSync(filePath, "utf8")
  const { content, data } = matter(source)

  const { content: mdxContent } = await compileMDX({
    source: content,
    options: {
      parseFrontmatter: false,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
      },
    },
    components: {},
  })

  return {
    content: mdxContent,
    frontmatter: data as MDXFrontmatter,
  }
}

/**
 * Check if an MDX post exists (legacy function).
 * @deprecated Use fileExists instead
 */
export function mdxPostExists(year: string, slug: string): boolean {
  const filePath = path.join(process.cwd(), "app/essays", year, slug, "page.mdx")
  return fs.existsSync(filePath)
}

/* -----------------------------------------------------------------------------
 * LEGACY COMPATIBILITY ALIASES
 * ----------------------------------------------------------------------------- */

/** @deprecated Use extractHeadings instead */
export async function extractHeadingsFromMDX(
  contentType: string,
  slug: string,
  category?: string
): Promise<TableOfContentsItem[]> {
  return extractHeadings(contentType as ContentType, slug, category)
}

/** @deprecated Use processSimpleMarkdown instead */
export async function getMarkdownContent(filePath: string): Promise<string> {
  const content = readFile(filePath)
  if (!content) return "<p>Content not available</p>"
  return processSimpleMarkdown(content)
}

/* -----------------------------------------------------------------------------
 * HIERARCHICAL HEADING EXTRACTION
 * ----------------------------------------------------------------------------- */

/** Heading with children for hierarchical TOC */
export interface HierarchicalHeading {
  id: string
  text: string
  level: number
  children?: HierarchicalHeading[]
}

/**
 * Extract headings from MDX content and organize into hierarchy.
 */
export async function extractHeadingsWithHierarchy(mdxContent: string): Promise<HierarchicalHeading[]> {
  const headings: HierarchicalHeading[] = []

  const processor = remark().use(remarkMdx)
  const ast = processor.parse(mdxContent)

  visit(ast, "heading", (node: MdastHeading) => {
    let text = ""
    visit(node, (childNode: any) => {
      if (childNode.type === "text") {
        text += childNode.value
      }
    })

    const id = text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")

    headings.push({
      id,
      text,
      level: node.depth,
      children: [],
    })
  })

  return organizeHeadings(headings)
}

/** Organize flat headings into a hierarchy */
function organizeHeadings(headings: HierarchicalHeading[]): HierarchicalHeading[] {
  const result: HierarchicalHeading[] = []
  const stack: HierarchicalHeading[] = []

  headings.forEach((heading) => {
    while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
      stack.pop()
    }

    if (stack.length === 0) {
      result.push(heading)
      stack.push(heading)
    } else {
      const parent = stack[stack.length - 1]
      if (!parent.children) parent.children = []
      parent.children.push(heading)
      stack.push(heading)
    }
  })

  return result
}

/* -----------------------------------------------------------------------------
 * MARGIN NOTES & BIBLIOGRAPHY LOADING
 * ----------------------------------------------------------------------------- */

/**
 * Load margin notes from a JSON file in a post directory.
 */
export async function loadMarginNotes(postDir: string): Promise<MarginNote[]> {
  const marginNotesPath = path.join(postDir, "margin-notes.json")

  if (!fs.existsSync(marginNotesPath)) {
    return []
  }

  try {
    const fileContent = fs.readFileSync(marginNotesPath, "utf8")
    return JSON.parse(fileContent)
  } catch (error) {
    console.error(`Error loading margin notes from ${marginNotesPath}:`, error)
    return []
  }
}

/**
 * Load bibliography from a JSON file in a post directory.
 */
export async function loadBibliography(postDir: string): Promise<BibliographyEntry[]> {
  const bibliographyPath = path.join(postDir, "bibliography.json")

  if (!fs.existsSync(bibliographyPath)) {
    return []
  }

  try {
    const fileContent = fs.readFileSync(bibliographyPath, "utf8")
    return JSON.parse(fileContent)
  } catch (error) {
    console.error(`Error loading bibliography from ${bibliographyPath}:`, error)
    return []
  }
}

/**
 * Get all post metadata including headings, margin notes, and bibliography.
 * @deprecated Legacy function for old essay structure
 */
export async function getPostMetadata(
  year: string,
  slug: string,
): Promise<{
  headings: HierarchicalHeading[]
  marginNotes: MarginNote[]
  bibliography: BibliographyEntry[]
}> {
  const postDir = path.join(process.cwd(), "app/essays", year, slug)
  const mdxPath = path.join(postDir, "page.mdx")

  let headings: HierarchicalHeading[] = []

  if (fs.existsSync(mdxPath)) {
    const mdxContent = fs.readFileSync(mdxPath, "utf8")
    headings = await extractHeadingsWithHierarchy(mdxContent)
  }

  const marginNotes = await loadMarginNotes(postDir)
  const bibliography = await loadBibliography(postDir)

  return { headings, marginNotes, bibliography }
}

/** @deprecated Use extractHeadingsWithHierarchy instead */
export const extractHeadingsFromMdx = extractHeadingsWithHierarchy

