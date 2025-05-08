import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import feedData from "./data/feed.json"

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const path = url.pathname

  console.log(`🔍 MIDDLEWARE: Handling request for ${path}`)

  // Skip doc routes entirely - we'll add an exclude in the matcher config
  if (path.startsWith('/doc/')) {
    console.log(`[middleware] Skipping middleware processing for doc route: ${path}`)
    return NextResponse.next()
  }

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
  
  // Redirect wishlist path to Amazon wishlist
  if (path === "/wishlist" || path === "/wishlist/") {
    console.log('🔄 MIDDLEWARE: Redirecting to Amazon wishlist')
    return NextResponse.redirect('https://www.amazon.com/hz/wishlist/ls/1ID8ZRMZ7CMDI?ref_=wl_share')
  }

  // Redirect memory path to Are.na
  if (path === "/memory" || path === "/memory/") {
    console.log('🔄 MIDDLEWARE: Redirecting to Are.na')
    return NextResponse.redirect('https://www.are.na/kris-yotam/channels')
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

// Configure the middleware to run only for certain paths
export const config = {
  matcher: [
    // Match all paths except:
    // 1. /api routes
    // 2. /_next (Next.js internals)
    // 3. /_static (inside /public)
    // 4. all root files inside /public (e.g. /favicon.ico)
    // 5. /doc routes (for document direct access)
    '/((?!api|_next|_static|_vercel|doc|[\\w-]+\\.\\w+).*)',
  ],
}

