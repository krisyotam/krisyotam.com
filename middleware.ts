import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import feedData from "./data/feed.json"

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const path = url.pathname

  // Check if the path is for a post
  if (path.startsWith("/post/")) {
    const slug = path.replace("/post/", "")

    // Find the post in the feed
    const post = feedData.posts.find((p) => p.slug === slug)

    // If it's a TSX post, redirect to the correct path
    if (post && post.type === "tsx") {
      const year = new Date(post.date).getFullYear().toString()
      return NextResponse.redirect(new URL(`/posts/${year}/${post.slug}`, request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/post/:path*"],
}

