import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import feedData from "./data/feed.json"

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const path = url.pathname

  console.log(`🔍 MIDDLEWARE: Handling request for ${path}`)

  // Check if the path is for a post (original functionality)
  if (path.startsWith("/post/")) {
    const slug = path.replace("/post/", "")

    // Find the post in the feed
    const post = feedData.posts.find((p) => p.slug === slug)

    // If post exists, redirect to the correct path
    if (post) {
      const year = new Date(post.date).getFullYear().toString()
      // Update to use the new blog path structure
      return NextResponse.redirect(new URL(`/blog/${year}/${post.slug}`, request.url))
    }
  }

  // Handle direct access to blog post files (new functionality)
  const blogPostMatch = path.match(/^\/blog\/(\d{4})\/([^/]+)$/)
  if (blogPostMatch) {
    const [, year, slug] = blogPostMatch
    console.log(`🔍 MIDDLEWARE: Detected blog post URL: ${path} with year: ${year}, slug: ${slug}`)

    // Check if this post exists in our feed data
    const postExists = feedData.posts.some((p) => p.slug === slug)

    if (postExists) {
      // The URL is already in the correct format, ensure it's handled by the app router
      console.log(`🔍 MIDDLEWARE: Confirmed post exists in feed data: ${slug}`)
      return NextResponse.next()
    }
  }

  return NextResponse.next()
}

// Update the matcher to include both original and new paths
export const config = {
  matcher: ["/post/:path*", "/blog/:year/:slug*"],
}

