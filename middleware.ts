import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import rawFeedData from "./data/essays/essays.json"
import type { Feed } from "./types/feed"

const feedData = rawFeedData as Feed

// Dynamically create route mappings from feed.json
// This creates a map where key is the custom path and value contains target slug and category info
const CUSTOM_ROUTES_MAP: Record<string, { slug: string, category: string }> = {};

// Build the custom routes map from feed data
feedData.essays.forEach(post => {
  if (post.customPath) {
    CUSTOM_ROUTES_MAP[post.customPath] = { 
      slug: post.slug,
      category: post.category 
    };
    console.log(`Registered custom route: ${post.customPath} → essays/${post.category}/${post.slug}`);
  }
});

// Pattern-based route mappings for more complex paths
// Each entry uses a regular expression pattern and a resolver function
const PATTERN_ROUTES = [
  {
    // Example: /research/research-title -> essays/philosophy/research-title (if such post exists)
    pattern: /^\/research\/([^/]+)$/,
    resolver: (matches: string[]) => {
      const [, slug] = matches;
      // Find the post in essays to get its category
      const post = feedData.essays.find(p => p.slug === slug);
      if (post) {
        return { 
          targetPath: `/essays/${post.category}/${slug}`,
          slug,
          category: post.category
        };
      }
      // Fallback if post not found
      return {
        targetPath: `/essays/philosophy/${slug}`,
        slug,
        category: 'philosophy'
      };
    }
  },
  // Add more pattern routes as needed
];

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()
  const path = url.pathname
  
  // Normalize path to handle trailing slashes consistently
  const normalizedPath = path.endsWith('/') && path !== '/' ? path.slice(0, -1) : path;

  console.log(`🔍 MIDDLEWARE: Handling request for ${normalizedPath}`)

  // Skip doc routes entirely
  if (normalizedPath.startsWith('/doc/')) {
    console.log(`[middleware] Skipping middleware processing for doc route: ${normalizedPath}`)
    return NextResponse.next()
  }
  // Check if this is a custom route (based on feed.json customPath)
  if (CUSTOM_ROUTES_MAP[normalizedPath]) {
    const { slug, category } = CUSTOM_ROUTES_MAP[normalizedPath];
    const targetPath = `/essays/${category}/${slug}`;
    
    console.log(`🔄 MIDDLEWARE: Custom route matched. Rewriting ${normalizedPath} to ${targetPath}`);
    url.pathname = targetPath;
    return NextResponse.rewrite(url);
  }

  // Handle assets and partial path matches for custom routes
  const customRouteKey = Object.keys(CUSTOM_ROUTES_MAP).find(route => 
    (route !== normalizedPath && normalizedPath.startsWith(`${route}/`)) || 
    // Handle asset paths that might be requested for the custom route
    normalizedPath.includes(`/_next/static/`) && normalizedPath.includes(route.replace(/\//g, ''))
  );

  if (customRouteKey) {
    // If this is an asset request (like CSS or JS)
    if (normalizedPath.includes('/_next/static/')) {
      // We don't need to modify these paths, Next.js will handle them
      return NextResponse.next();
    }
  }

  // Check pattern-based route mappings
  for (const patternRoute of PATTERN_ROUTES) {
    const matches = normalizedPath.match(patternRoute.pattern);
    if (matches) {
      const { targetPath } = patternRoute.resolver(matches);
      
      // For pattern route base paths
      console.log(`🔄 MIDDLEWARE: Pattern route matched. Rewriting ${normalizedPath} to ${targetPath}`);
      url.pathname = targetPath;
      return NextResponse.rewrite(url);
    }
  }

  // Check if the path is for a post (original functionality)
  if (normalizedPath.startsWith("/post/")) {
    const slug = normalizedPath.replace("/post/", "")    // Find the post in the feed
    const post = feedData.essays.find((p) => p.slug === slug)

    // If post exists, redirect to the correct path
    if (post) {
      // Update to use the new essays path structure
      return NextResponse.redirect(new URL(`/essays/${post.category}/${post.slug}`, request.url))
    }
  }
  
  // Redirect wishlist path to Amazon wishlist
  if (normalizedPath === "/wishlist") {
    console.log('🔄 MIDDLEWARE: Redirecting to Amazon wishlist')
    return NextResponse.redirect('https://www.amazon.com/hz/wishlist/ls/1ID8ZRMZ7CMDI?ref_=wl_share')
  }

  // Redirect memory path to Are.na
  if (normalizedPath === "/memory") {
    console.log('🔄 MIDDLEWARE: Redirecting to Are.na')
    return NextResponse.redirect('https://www.are.na/kris-yotam/channels')
  }
  // Handle direct access to essays post files (new functionality)
  const essayPostMatch = normalizedPath.match(/^\/essays\/([^/]+)\/([^/]+)$/)
  if (essayPostMatch) {
    const [, category, slug] = essayPostMatch
    console.log(`🔍 MIDDLEWARE: Detected essays post URL: ${normalizedPath} with category: ${category}, slug: ${slug}`)

    // Check if this post exists in our feed data
    const postExists = feedData.essays.some((p) => p.slug === slug && p.category === category)

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

