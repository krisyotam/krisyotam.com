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
  // Validate required parameters
  if (!contentType || !slug) {
    console.error('Missing required parameters: contentType and slug are required')
    return []
  }

  let mdxPath: string
  // Determine the path based on content type
  switch (contentType) {
    case 'essays':
      if (!category) {
        console.error('Category is required for essays content type')
        return []
      }
      mdxPath = path.join(process.cwd(), "app/essays/content", category, `${slug}.mdx`)
      break
    case 'notes':
      mdxPath = path.join(process.cwd(), "app/notes/content", `${slug}.mdx`)
      break
    case 'til':
      mdxPath = path.join(process.cwd(), "app/til/content", `${slug}.mdx`)
      break
    case 'blog':
      mdxPath = path.join(process.cwd(), "app/blog/content", `${slug}.mdx`)
      break
    case 'now':
      mdxPath = path.join(process.cwd(), "app/now/content", `${slug}.mdx`)
      break
    case 'fiction':
      if (!category) {
        console.error('Category is required for fiction content type')
        return []
      }
      mdxPath = path.join(process.cwd(), "app/fiction/content", category, `${slug}.mdx`)
      break
    case 'papers':
      if (!category) {
        console.error('Category is required for papers content type')
        return []
      }
      mdxPath = path.join(process.cwd(), "app/papers/content", category, `${slug}.mdx`)
      break
    case 'dossiers':
      if (!category) {
        console.error('Category is required for dossiers content type')
        return []
      }
      mdxPath = path.join(process.cwd(), "app/dossiers/content", category, `${slug}.mdx`)
      break
    case 'cases':
      if (!category) {
        console.error('Category is required for cases content type')
        return []
      }
      mdxPath = path.join(process.cwd(), "app/cases/content", category, `${slug}.mdx`)
      break
    case 'conspiracies':
      if (!category) {
        console.error('Category is required for conspiracies content type')
        return []
      }
      mdxPath = path.join(process.cwd(), "app/conspiracies/content", category, `${slug}.mdx`)
      break
    case 'news':
      if (!category) {
        console.error('Category is required for news content type')
        return []
      }
      mdxPath = path.join(process.cwd(), "app/news/content", category, `${slug}.mdx`)
      break
    case 'libers':
      if (!category) {
        console.error('Category is required for libers content type')
        return []
      }
      mdxPath = path.join(process.cwd(), "app/libers/content", category, `${slug}.mdx`)
      break
    case 'reviews':
      if (!category) {
        console.error('Category is required for reviews content type')
        return []
      }
      mdxPath = path.join(process.cwd(), "app/reviews/content", category, `${slug}.mdx`)
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
