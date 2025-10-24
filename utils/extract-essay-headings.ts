import fs from "fs"
import path from "path"
import { remark } from "remark"
import remarkMdx from "remark-mdx"
import { visit } from "unist-util-visit"
import type { Heading as MdastHeading, Text } from "mdast"
import type { TableOfContentsItem } from "@/components/typography/table-of-contents"

// Function to extract headings from essay MDX content
export async function extractHeadingsFromEssayMDX(
  category: string, 
  slug: string
): Promise<TableOfContentsItem[]> {
  const essayPath = path.join(process.cwd(), "app/essays/content", category, `${slug}.mdx`)
  
  if (!fs.existsSync(essayPath)) {
    console.log(`Essay MDX file not found: ${essayPath}`)
    return []
  }

  const mdxContent = fs.readFileSync(essayPath, "utf8")
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
    console.error(`Error parsing MDX content for ${category}/${slug}:`, error)
    return []
  }
}
