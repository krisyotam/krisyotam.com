import type React from "react"
import fs from "fs"
import path from "path"
import { compileMDX } from "next-mdx-remote/rsc"
import rehypeSlug from "rehype-slug"
import remarkGfm from "remark-gfm"
import matter from "gray-matter"

// Define the frontmatter type
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

// Define the heading type for table of contents
export interface TOCHeading {
  id: string
  text: string
  level: number
  children?: TOCHeading[]
  number?: string // Add number property for hierarchical numbering
}

// Define the margin note type
export interface MarginNote {
  id: string
  title: string
  content: string
  index: number
  source?: string
  priority?: number
}

// Define the bibliography entry type
export interface BibliographyEntry {
  id: string
  author: string
  title: string
  year: number
  publisher: string
  url: string
  type: string
}

// Define the MDX post type
export interface MDXPost {
  content: React.ReactNode
  frontmatter: MDXFrontmatter
}

// Function to get an MDX post by slug
export async function getMDXPost(year: string, slug: string): Promise<MDXPost | null> {
  const filePath = path.join(process.cwd(), "app/blog", year, slug, "page.mdx")

  // Check if the MDX file exists
  if (!fs.existsSync(filePath)) {
    return null
  }

  // Read the MDX file
  const source = fs.readFileSync(filePath, "utf8")

  // Parse frontmatter
  const { content, data } = matter(source)

  // Compile the MDX content
  const { content: mdxContent } = await compileMDX({
    source: content,
    options: {
      parseFrontmatter: false, // We already parsed it with gray-matter
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
      },
    },
    components: {
      // Components will be provided by mdx-components.tsx
    },
  })

  return {
    content: mdxContent,
    frontmatter: data as MDXFrontmatter,
  }
}

// Function to check if an MDX post exists
export function mdxPostExists(year: string, slug: string): boolean {
  const filePath = path.join(process.cwd(), "app/blog", year, slug, "page.mdx")
  return fs.existsSync(filePath)
}

