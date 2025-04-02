import { notFound } from "next/navigation"
import { PostHeader } from "@/components/post-header"
import { getPostBySlug } from "@/utils/posts"
import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { BlogPostContent } from "./blog-post-content"

export const dynamicParams = true

// Function to extract headings from MDX content
function extractHeadings(content: string) {
  const headings = []
  // Match both Markdown headings (# Title) and JSX headings (<h1>Title</h1>)
  const markdownHeadingRegex = /^(#{1,3})\s+(.+?)(?:\s+\{#([a-zA-Z0-9-]+)\})?$/gm
  const jsxHeadingRegex = /<h([1-3])[^>]*>(.*?)<\/h\1>/g

  // Extract Markdown headings
  let match
  while ((match = markdownHeadingRegex.exec(content)) !== null) {
    const level = match[1].length
    const text = match[2].trim()
    const id = match[3] || text.toLowerCase().replace(/[^\w]+/g, "-")

    headings.push({
      level,
      text,
      id,
    })
  }

  // Extract JSX headings
  while ((match = jsxHeadingRegex.exec(content)) !== null) {
    const level = Number.parseInt(match[1])
    const text = match[2].trim()
    const id = text.toLowerCase().replace(/[^\w]+/g, "-")

    // Check if this heading is already in the list (might have been caught by markdown regex)
    const exists = headings.some((h) => h.text === text && h.level === level)
    if (!exists) {
      headings.push({
        level,
        text,
        id,
      })
    }
  }

  console.log("Extracted headings:", headings)
  return headings
}

// Function to check if an MDX version of the post exists
function isPostMDX(year: string, slug: string): boolean {
  const mdxPath = path.join(process.cwd(), "app/blog", year, slug, "page.mdx")
  return fs.existsSync(mdxPath)
}

export default async function PostPage({
  params,
}: {
  params: { year: string; slug: string }
}) {
  console.log("🔍 DEBUG: [year]/[slug]/page.tsx is rendering with params:", params)

  try {
    const { year, slug } = params

    // Get post data from our posts utility (using feed.json)
    const postData = await getPostBySlug(slug)
    console.log("🔍 DEBUG: Post data retrieved:", postData ? "Found" : "Not found")

    if (!postData) {
      console.log(`Post not found in feed data: ${slug}`)
      notFound()
    }

    // Check if there's an MDX version of the post
    const isMDX = isPostMDX(year, slug)
    console.log(`🔍 DEBUG: Is MDX post:`, isMDX)

    // Prepare data for the client component
    let mdxData = null
    let blogPostExists = false

    // If MDX post exists, read its content
    if (isMDX) {
      const mdxPath = path.join(process.cwd(), "app/blog", year, slug, "page.mdx")
      const mdxSource = fs.readFileSync(mdxPath, "utf8")

      // Parse frontmatter to get headings, margin notes, etc.
      const { content, data } = matter(mdxSource)

      // If no headings in frontmatter, try to extract them from content
      if (!data.headings || data.headings.length === 0) {
        data.headings = extractHeadings(content)
      }

      console.log("Headings for MDX post:", data.headings)

      mdxData = {
        content,
        frontmatter: data,
      }
    } else {
      // Check if there's a corresponding blog post file in the blog directory
      const blogPostPath = path.join(process.cwd(), "app/blog", year, slug, "page.tsx")
      blogPostExists = fs.existsSync(blogPostPath)
      console.log(`🔍 DEBUG: Blog post file exists at ${blogPostPath}:`, blogPostExists)
    }

    return (
      <div className="max-w-3xl mx-auto p-8 md:p-16 lg:p-24">
        <PostHeader title={postData.title} date={postData.date} tags={postData.tags} category={postData.category} />
        <article className="post-content">
          <BlogPostContent year={year} slug={slug} isMDX={isMDX} mdxData={mdxData} blogPostExists={blogPostExists} />
        </article>
      </div>
    )
  } catch (error) {
    console.error("Failed to render post:", error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-3xl mx-auto p-8">
          <h1 className="text-2xl font-bold mb-4">Error Loading Post</h1>
          <p className="text-xl text-muted-foreground mb-4">We encountered an error while trying to load this post.</p>
          <pre className="bg-secondary p-4 rounded-md overflow-auto">
            {error instanceof Error ? error.message : String(error)}
          </pre>
        </div>
      </div>
    )
  }
}

