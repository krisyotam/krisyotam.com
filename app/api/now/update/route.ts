import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import { getNowPosts, type NowPost } from "@/utils/markdown"

export async function POST(request: Request) {
  try {
    const { content, slug, title } = await request.json()

    if (!content || !slug || !title) {
      return NextResponse.json(
        {
          error: "Missing required fields: content, slug, or title",
        },
        { status: 400 },
      )
    }

    // Get current posts
    const posts = await getNowPosts()

    // Set all posts to hidden
    const updatedPosts = posts.map((post) => ({
      ...post,
      status: "hidden",
    }))

    // Add new post or update existing
    const existingPostIndex = updatedPosts.findIndex((p) => p.slug === slug)
    const newPost: NowPost = {
      date: new Date().toISOString().split("T")[0],
      slug,
      status: "active",
      title,
    }

    if (existingPostIndex >= 0) {
      updatedPosts[existingPostIndex] = newPost
    } else {
      updatedPosts.unshift(newPost)
    }

    // Save updated posts data
    const postsPath = path.join(process.cwd(), "data/now-posts.json")
    fs.writeFileSync(postsPath, JSON.stringify(updatedPosts, null, 2))

    // Save markdown content
    const contentPath = path.join(process.cwd(), `app/now/posts/${slug}.md`)
    fs.writeFileSync(contentPath, content)

    return NextResponse.json({
      success: true,
      message: `Now page updated with new content: ${title}`,
    })
  } catch (error) {
    console.error("Error updating now page:", error)
    return NextResponse.json({ error: "Failed to update now page" }, { status: 500 })
  }
}

