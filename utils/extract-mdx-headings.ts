import fs from "fs";
import path from "path";
import { remark } from "remark";
import remarkMdx from "remark-mdx";
import remarkMath from "remark-math";
import { visit } from "unist-util-visit";
import type { Heading as MdastHeading, Text } from "mdast";
import type { TableOfContentsItem } from "@/components/typography/table-of-contents";

// Function to extract headings from any MDX content
export async function extractHeadingsFromMDX(
  contentType: string,
  slug: string,
  category?: string
): Promise<TableOfContentsItem[]> {
  // Validate required parameters
  if (!contentType || !slug) {
    console.error('Missing required parameters: contentType and slug are required');
    return [];
  }

  let mdxPath: string;
  // Determine the path based on content type
  switch (contentType) {
    case 'shortform':
      mdxPath = path.join(process.cwd(), "app/shortform/content", `${slug}.mdx`);
      break;
    case 'essays':
      if (!category) {
        console.error('Category is required for essays content type');
        return [];
      }
      mdxPath = path.join(process.cwd(), "app/essays/content", category, `${slug}.mdx`);
      break;
    case 'links':
      if (!category) {
        console.error('Category is required for links content type');
        return [];
      }
      mdxPath = path.join(process.cwd(), "app/links/content", category, `${slug}.mdx`);
      break;
    case 'notes':
      if (category) {
        mdxPath = path.join(process.cwd(), "app/notes/content", category, `${slug}.mdx`);
      } else {
        mdxPath = path.join(process.cwd(), "app/notes/content", `${slug}.mdx`);
      }
      break;
    case 'til':
      mdxPath = path.join(process.cwd(), "app/til/content", `${slug}.mdx`);
      break;
    case 'blog':
      if (category) {
        // Try nested structure first
        mdxPath = path.join(process.cwd(), "app/blog/content", category, `${slug}.mdx`);
        // Check if nested file exists, if not fallback to flat structure
        if (!fs.existsSync(mdxPath)) {
          mdxPath = path.join(process.cwd(), "app/blog/content", `${slug}.mdx`);
        }
      } else {
        // Fallback to flat structure
        mdxPath = path.join(process.cwd(), "app/blog/content", `${slug}.mdx`);
      }
      break;
    case 'now':
      mdxPath = path.join(process.cwd(), "app/now/content", `${slug}.mdx`);
      break;
    case 'fiction':
      if (!category) {
        console.error('Category is required for fiction content type');
        return [];
      }
      mdxPath = path.join(process.cwd(), "app/fiction/content", category, `${slug}.mdx`);
      break;
    case 'papers':
      if (!category) {
        console.error('Category is required for papers content type');
        return [];
      }
      mdxPath = path.join(process.cwd(), "app/papers/content", category, `${slug}.mdx`);
      break;
    case 'dossiers':
      if (!category) {
        console.error('Category is required for dossiers content type');
        return [];
      }
      mdxPath = path.join(process.cwd(), "app/dossiers/content", category, `${slug}.mdx`);
      break;
    case 'cases':
      if (!category) {
        console.error('Category is required for cases content type');
        return [];
      }
      mdxPath = path.join(process.cwd(), "app/cases/content", category, `${slug}.mdx`);
      break;
    case 'conspiracies':
      if (!category) {
        console.error('Category is required for conspiracies content type');
        return [];
      }
      mdxPath = path.join(process.cwd(), "app/conspiracies/content", category, `${slug}.mdx`);
      break;
    case 'news':
      if (!category) {
        console.error('Category is required for news content type');
        return [];
      }
      mdxPath = path.join(process.cwd(), "app/news/content", category, `${slug}.mdx`);
      break;
    case 'libers':
      if (!category) {
        console.error('Category is required for libers content type');
        return [];
      }
      mdxPath = path.join(process.cwd(), "app/libers/content", category, `${slug}.mdx`);
      break;
    case 'reviews':
      if (!category) {
        console.error('Category is required for reviews content type');
        return [];
      }
      mdxPath = path.join(process.cwd(), "app/reviews/content", category, `${slug}.mdx`);
      break;
    case 'proofs':
      if (!category) {
        console.error('Category is required for proofs content type');
        return [];
      }
      mdxPath = path.join(process.cwd(), "app/proofs/content", category, `${slug}.mdx`);
      break;    
    case 'lab':
      if (!category) {
        console.error('Category is required for lab content type');
        return [];
      }
      mdxPath = path.join(process.cwd(), "app/lab/content", category, `${slug}.mdx`);
      break;
    case 'problems':
      if (!category) {
        console.error('Category is required for problems content type');
        return [];
      }
      mdxPath = path.join(process.cwd(), "app/problems/content", category, `${slug}.mdx`);
      break;
    case 'lectures':
      if (!category) {
        console.error('Category is required for lectures content type');
        return [];
      }
      mdxPath = path.join(process.cwd(), "app/lectures/content", category, `${slug}.mdx`);
      break;
    default:
      console.log(`Unknown content type: ${contentType}`);
      return [];
  }
  
  if (!fs.existsSync(mdxPath)) {
    console.log(`MDX file not found: ${mdxPath}`);
    return [];
  }

  const mdxContent = fs.readFileSync(mdxPath, "utf8");
  const headings: TableOfContentsItem[] = [];
  try {
    const processor = remark().use(remarkMdx).use(remarkMath);
    const ast = await processor.parse(mdxContent);
    visit(ast, "heading", (node: MdastHeading) => {
      // Extract text from the heading, including math expressions
      let text = "";
      visit(node, (childNode: any) => {
        if (childNode.type === "text") {
          text += childNode.value;
        } else if (childNode.type === "inlineMath") {
          // Include inline math expressions in the heading text
          text += `$${childNode.value}$`;
        } else if (childNode.type === "math") {
          // Include display math expressions in the heading text
          text += `$$${childNode.value}$$`;
        }
      });

      // Skip empty headings
      if (!text.trim()) return;

      // Generate an ID from the text (removing math expressions for cleaner IDs)
      const cleanText = text.replace(/\$\$.*?\$\$/g, '').replace(/\$.*?\$/g, '').trim();
      const id = cleanText
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      headings.push({
        id: id || "heading",
        text: text.trim(),
        level: node.depth,
      });
    });

    return headings;
  } catch (error) {
    console.error(`Error parsing MDX content for ${contentType}/${slug}:`, error);
    return [];
  }
}
