import fs from "fs"
import path from "path"
import { remark } from "remark"
import html from "remark-html"
import { formatDate } from "./date-formatter"

export async function getMarkdownContent(filePath: string) {
  try {
    const fullPath = path.join(process.cwd(), filePath)
    const fileContents = fs.readFileSync(fullPath, "utf8")

    // Use remark to convert markdown into HTML string
    const processedContent = await remark().use(html).process(fileContents)

    const contentHtml = processedContent.toString()

    return contentHtml
  } catch (error) {
    console.error(`Error reading markdown file: ${filePath}`, error)
    return "<p>Content not available</p>"
  }
}

export interface NowPost {
  date: string
  slug: string
  status: "active" | "hidden"
  title: string
  content?: string
}

export async function getNowPosts() {
  try {
    const postsPath = path.join(process.cwd(), "data/now-posts.json")
    const fileContents = fs.readFileSync(postsPath, "utf8")
    const posts: NowPost[] = JSON.parse(fileContents)

    // Sort posts by date (newest first)
    return posts.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  } catch (error) {
    console.error("Error reading now posts data", error)
    return []
  }
}

export async function getNowPostWithContent(slug: string): Promise<NowPost | null> {
  try {
    const posts = await getNowPosts()
    const post = posts.find((p) => p.slug === slug)

    if (!post) return null

    const contentPath = `app/now/posts/${slug}.md`
    const content = await getMarkdownContent(contentPath)

    return {
      ...post,
      content,
    }
  } catch (error) {
    console.error(`Error getting now post: ${slug}`, error)
    return null
  }
}

export async function getActiveNowPost(): Promise<NowPost | null> {
  try {
    const posts = await getNowPosts()
    const activePost = posts.find((p) => p.status === "active")

    if (!activePost) return null

    return getNowPostWithContent(activePost.slug)
  } catch (error) {
    console.error("Error getting active now post", error)
    return null
  }
}

export async function getArchivedNowPosts(): Promise<NowPost[]> {
  try {
    const posts = await getNowPosts()
    const archivedPosts = posts.filter((p) => p.status === "hidden")

    // Get content for each archived post
    const postsWithContent = await Promise.all(
      archivedPosts.map(async (post) => {
        const postWithContent = await getNowPostWithContent(post.slug)
        return postWithContent || post
      }),
    )

    return postsWithContent
  } catch (error) {
    console.error("Error getting archived now posts", error)
    return []
  }
}

export function formatNowDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return formatDate(date)
  } catch (error) {
    return dateString
  }
}

