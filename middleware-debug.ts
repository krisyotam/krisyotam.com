import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
 
// Middleware to log environment information for debugging purposes
export function middleware(request: NextRequest) {
  // Only run on specific routes we want to debug
  if (
    request.nextUrl.pathname.startsWith('/others') || 
    request.nextUrl.pathname.startsWith('/blog') ||
    request.nextUrl.pathname.startsWith('/api/others') ||
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
      
      const othersFile = path.join(process.cwd(), 'data', 'others.json');
      const feedFile = path.join(process.cwd(), 'data', 'feed.json');
      
      console.log(`others.json exists: ${fs.existsSync(othersFile)}`);
      console.log(`feed.json exists: ${fs.existsSync(feedFile)}`);
      
      // List files in data directory
      const dataDir = path.join(process.cwd(), 'data');
      try {
        const files = fs.readdirSync(dataDir);
        console.log(`Files in data directory: ${files.join(', ')}`);
      } catch (e) {
        console.error(`Error listing data directory: ${e.message}`);
      }
    } catch (e) {
      console.error(`Error in middleware file checks: ${e.message}`);
    }
    console.log('---------------');
  }
  
  return NextResponse.next();
}

// Configure which paths should be processed by the middleware
export const config = {
  matcher: ['/others/:path*', '/blog/:path*', '/api/others/:path*', '/api/blog/:path*'],
};
