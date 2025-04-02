import fs from "fs"
import path from "path"
import { remark } from "remark"
import remarkMdx from "remark-mdx"
import { visit } from "unist-util-visit"

// Types for headings, margin notes, and bibliography
export interface Heading {
  id: string
  text: string
  level: number
  children?: Heading[]
}

export interface MarginNote {
  id: string
  title: string
  content: string
  index: number
  source?: string
  priority?: number
}

export interface BibliographyEntry {
  id: string
  author: string
  title: string
  year: number
  publisher: string
  url: string
  type: string
}

// Function to extract headings from MDX content
export async function extractHeadingsFromMdx(mdxContent: string): Promise<Heading[]> {
  const headings: Heading[] = []

  const processor = remark().use(remarkMdx)
  const ast = await processor.parse(mdxContent)

  visit(ast, "heading", (node: any) => {
    // Extract text from the heading
    let text = ""
    visit(node, "text", (textNode: any) => {
      text += textNode.value
    })

    // Generate an ID from the text
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

  // Organize headings into a hierarchy
  return organizeHeadings(headings)
}

// Helper function to organize headings into a hierarchy
function organizeHeadings(headings: Heading[]): Heading[] {
  const result: Heading[] = []
  const stack: Heading[] = []

  headings.forEach((heading) => {
    // Pop items from stack if current heading has lower or equal level
    while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
      stack.pop()
    }

    if (stack.length === 0) {
      // This is a top-level heading
      result.push(heading)
      stack.push(heading)
    } else {
      // This is a child heading
      const parent = stack[stack.length - 1]
      if (!parent.children) parent.children = []
      parent.children.push(heading)
      stack.push(heading)
    }
  })

  return result
}

// Function to load margin notes from a JSON file
export async function loadMarginNotes(postDir: string): Promise<MarginNote[]> {
  const marginNotesPath = path.join(postDir, "margin-notes.json")

  console.log(`🔍 MARGIN NOTES: Checking for file at: ${marginNotesPath}`)

  if (!fs.existsSync(marginNotesPath)) {
    console.log(`❌ MARGIN NOTES: File not found at: ${marginNotesPath}`)
    return []
  }

  console.log(`✅ MARGIN NOTES: File found at: ${marginNotesPath}`)

  try {
    // Read the JSON file
    const fileContent = fs.readFileSync(marginNotesPath, "utf8")
    const marginNotes = JSON.parse(fileContent)

    console.log(`✅ MARGIN NOTES: Successfully loaded ${marginNotes.length} margin notes`)
    return marginNotes
  } catch (error) {
    console.error(`❌ MARGIN NOTES: Error loading from ${marginNotesPath}:`, error)
    return []
  }
}

// Function to load bibliography from a JSON file
export async function loadBibliography(postDir: string): Promise<BibliographyEntry[]> {
  const bibliographyPath = path.join(postDir, "bibliography.json")

  console.log(`🔍 BIBLIOGRAPHY: Checking for file at: ${bibliographyPath}`)

  if (!fs.existsSync(bibliographyPath)) {
    console.log(`❌ BIBLIOGRAPHY: File not found at: ${bibliographyPath}`)
    return []
  }

  console.log(`✅ BIBLIOGRAPHY: File found at: ${bibliographyPath}`)

  try {
    // Read the JSON file
    const fileContent = fs.readFileSync(bibliographyPath, "utf8")
    const bibliography = JSON.parse(fileContent)

    console.log(`✅ BIBLIOGRAPHY: Successfully loaded ${bibliography.length} bibliography entries`)
    return bibliography
  } catch (error) {
    console.error(`❌ BIBLIOGRAPHY: Error loading from ${bibliographyPath}:`, error)
    return []
  }
}

// Function to get all post metadata including headings, margin notes, and bibliography
export async function getPostMetadata(
  year: string,
  slug: string,
): Promise<{
  headings: Heading[]
  marginNotes: MarginNote[]
  bibliography: BibliographyEntry[]
}> {
  const postDir = path.join(process.cwd(), "app/blog", year, slug)
  const mdxPath = path.join(postDir, "page.mdx")

  console.log(`\n📄 POST METADATA: Getting metadata for post: ${year}/${slug}`)
  console.log(`📁 POST METADATA: Post directory: ${postDir}`)
  console.log(`📄 POST METADATA: MDX path: ${mdxPath}`)

  let headings: Heading[] = []

  // Extract headings from MDX content if the file exists
  if (fs.existsSync(mdxPath)) {
    console.log(`✅ POST METADATA: MDX file exists at: ${mdxPath}`)
    const mdxContent = fs.readFileSync(mdxPath, "utf8")
    headings = await extractHeadingsFromMdx(mdxContent)
    console.log(`📊 POST METADATA: Extracted ${headings.length} headings from MDX content`)
  } else {
    console.log(`❌ POST METADATA: MDX file does not exist at: ${mdxPath}`)
  }

  // Load margin notes and bibliography from JSON files
  console.log(`\n🔍 POST METADATA: Loading margin notes and bibliography from JSON files`)
  const marginNotes = await loadMarginNotes(postDir)
  const bibliography = await loadBibliography(postDir)

  console.log(`\n📊 POST METADATA: Final metadata loaded:`, {
    headingsCount: headings.length,
    marginNotesCount: marginNotes.length,
    bibliographyCount: bibliography.length,
  })

  return {
    headings,
    marginNotes,
    bibliography,
  }
}

