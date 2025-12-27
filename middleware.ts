import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import rawFeedData from "./data/essays/essays.json"
import type { Feed } from "./types/feed"

const feedData = rawFeedData as Feed

// Build a map of custom routes from feed data (customPath -> { slug, category })
const CUSTOM_ROUTES_MAP: Record<string, { slug: string; category: string }> = {}
for (const post of feedData.essays) {
  if (post.customPath) CUSTOM_ROUTES_MAP[post.customPath] = { slug: post.slug, category: post.category }
}

const PATTERN_ROUTES = [
  {
    pattern: /^\/research\/([^/]+)$/,
    resolver: (matches: string[]) => {
      const [, slug] = matches
      const post = feedData.essays.find((p) => p.slug === slug)
      if (post) return { targetPath: `/essays/${post.category}/${slug}`, slug, category: post.category }
      return { targetPath: `/essays/philosophy/${slug}`, slug, category: "philosophy" }
    },
  },
]

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const path = url.pathname
  const normalizedPath = path.endsWith("/") && path !== "/" ? path.slice(0, -1) : path

  // Custom routes from feed.json
  if (CUSTOM_ROUTES_MAP[normalizedPath]) {
    const { slug, category } = CUSTOM_ROUTES_MAP[normalizedPath]
    url.pathname = `/essays/${category}/${slug}`
    return NextResponse.rewrite(url)
  }

  // Asset requests for custom routes should be served normally
  const customRouteKey = Object.keys(CUSTOM_ROUTES_MAP).find((route) =>
    (route !== normalizedPath && normalizedPath.startsWith(`${route}/`)) ||
    (normalizedPath.includes(`/_next/static/`) && normalizedPath.includes(route.replace(/\//g, "")))
  )
  if (customRouteKey && normalizedPath.includes("/_next/static/")) return NextResponse.next()

  // Pattern-based routes
  for (const patternRoute of PATTERN_ROUTES) {
    const matches = normalizedPath.match(patternRoute.pattern)
    if (matches) {
      const { targetPath } = patternRoute.resolver(matches)
      url.pathname = targetPath
      return NextResponse.rewrite(url)
    }
  }

  // Legacy /post/ redirects
  if (normalizedPath.startsWith("/post/")) {
    const slug = normalizedPath.replace("/post/", "")
    const post = feedData.essays.find((p) => p.slug === slug)
    if (post) return NextResponse.redirect(new URL(`/essays/${post.category}/${post.slug}`, request.url))
  }

  // Simple redirects
  if (normalizedPath === "/wishlist") return NextResponse.redirect("https://www.amazon.com/hz/wishlist/ls/1ID8ZRMZ7CMDI?ref_=wl_share")
  if (normalizedPath === "/memory") return NextResponse.redirect("https://www.are.na/kris-yotam/channels")

  // If this looks like an essays post, let the app handle it
  const essayPostMatch = normalizedPath.match(/^\/essays\/([^/]+)\/([^/]+)$/)
  if (essayPostMatch) {
    const [, category, slug] = essayPostMatch
    const postExists = feedData.essays.some((p) => p.slug === slug && p.category === category)
    if (postExists) return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  // Run middleware for most app routes, but exclude API, next internals, vercel internals, and direct asset requests
  matcher: ["/((?!api|_next|_static|_vercel|[\\w-]+\\.\\w+).*)"],
}

