import fs from "fs"
import path from "path"
import { remark } from "remark"
import remarkMdx from "remark-mdx"
import { visit } from "unist-util-visit"
import type { Heading as MdastHeading, Text } from "mdast"
import type { TableOfContentsItem } from "@/components/typography/table-of-contents"

// Function to extract headings from any MDX content
export async function extractHeadingsFromMDX(
  contentType: string, 
  slug: string,
  category?: string
): Promise<TableOfContentsItem[]> {
  let mdxPath: string

  // Determine the path based on content type
  switch (contentType) {    case 'essays':
      mdxPath = path.join(process.cwd(), "app/essays/content", category!, `${slug}.mdx`)
      break
    case 'notes':
      mdxPath = path.join(process.cwd(), "app/notes/content", `${slug}.mdx`)
      break
    case 'blog':
      mdxPath = path.join(process.cwd(), "app/blog/content", `${slug}.mdx`)
      break
    case 'fiction':
      mdxPath = path.join(process.cwd(), "app/fiction/content", category!, `${slug}.mdx`)
      break
    case 'papers':
      mdxPath = path.join(process.cwd(), "app/papers/content", category!, `${slug}.mdx`)
      break
    case 'dossiers':
      mdxPath = path.join(process.cwd(), "app/dossiers/content", category!, `${slug}.mdx`)
      break
    case 'cases':
      mdxPath = path.join(process.cwd(), "app/cases/content", category!, `${slug}.mdx`)
      break
    case 'conspiracies':
      mdxPath = path.join(process.cwd(), "app/conspiracies/content", category!, `${slug}.mdx`)
      break
    case 'news':
      mdxPath = path.join(process.cwd(), "app/news/content", category!, `${slug}.mdx`)
      break
    case 'libers':
      mdxPath = path.join(process.cwd(), "app/libers/content", category!, `${slug}.mdx`)
      break
    case 'reviews':
      mdxPath = path.join(process.cwd(), "app/reviews/content", category!, `${slug}.mdx`)
      break
    default:
      console.log(`Unknown content type: ${contentType}`)
      return []
  }
  
  if (!fs.existsSync(mdxPath)) {
    console.log(`MDX file not found: ${mdxPath}`)
    return []
  }

  const mdxContent = fs.readFileSync(mdxPath, "utf8")
  const headings: TableOfContentsItem[] = []

  try {
    const processor = remark().use(remarkMdx)
    const ast = await processor.parse(mdxContent)

    visit(ast, "heading", (node: MdastHeading) => {
      // Extract text from the heading
      let text = ""
      visit(node, "text", (textNode: Text) => {
        text += textNode.value
      })

      // Skip empty headings
      if (!text.trim()) return

      // Generate an ID from the text
      const id = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")

      headings.push({
        id,
        text: text.trim(),
        level: node.depth,
      })
    })

    return headings
  } catch (error) {
    console.error(`Error parsing MDX content for ${contentType}/${slug}:`, error)
    return []
  }
}
