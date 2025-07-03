import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
 
// Middleware to log environment information for debugging purposes
export function middleware(request: NextRequest) {
  // Only run on specific routes we want to debug
  if (
    request.nextUrl.pathname.startsWith('/blogroll') || 
    request.nextUrl.pathname.startsWith('/blog') ||
    request.nextUrl.pathname.startsWith('/api/blogroll') ||
    request.nextUrl.pathname.startsWith('/api/blog')
  ) {
    console.log('---DEBUG INFO---');
    console.log(`Request URL: ${request.nextUrl.pathname}`);
    console.log(`Current working directory: ${process.cwd()}`);
    console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
    console.log(`NEXT_PUBLIC_BASE_URL: ${process.env.NEXT_PUBLIC_BASE_URL}`);
    
    // Try to check if key files exist (only server-side)
    try {
      const fs = require('fs');
      const path = require('path');
      
      const blogrollFile = path.join(process.cwd(), 'data', 'blogroll', 'blogroll.json');
      const feedFile = path.join(process.cwd(), 'data', 'blog', 'feed.json');
      
      console.log(`blogroll.json exists: ${fs.existsSync(blogrollFile)}`);
      console.log(`feed.json exists: ${fs.existsSync(feedFile)}`);
      
      // List files in data directory
      const dataDir = path.join(process.cwd(), 'data');      try {
        const files = fs.readdirSync(dataDir);
        console.log(`Files in data directory: ${files.join(', ')}`);
      } catch (e) {
        console.error(`Error listing data directory: ${e instanceof Error ? e.message : String(e)}`);
      }
    } catch (e) {
      console.error(`Error in middleware file checks: ${e instanceof Error ? e.message : String(e)}`);
    }
    console.log('---------------');
  }
  
  return NextResponse.next();
}

// Configure which paths should be processed by the middleware
export const config = {
  matcher: ['/blogroll/:path*', '/blog/:path*', '/api/blogroll/:path*', '/api/blog/:path*'],
};
