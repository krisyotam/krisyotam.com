import { NextRequest, NextResponse } from "next/server"
import { getPostBySlug } from "@/lib/posts"
import fs from "fs"
import path from "path"

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const year = searchParams.get("year")
  const slug = searchParams.get("slug")
  
  if (!year || !slug) {
    return new NextResponse("Missing year or slug", { status: 400 })
  }

  // Fetch the post data
  const post = await getPostBySlug(slug)

  // If post doesn't exist, return 404
  if (!post) {
    return new NextResponse("Post not found", { status: 404 })
  }

  // Get the actual post file path
  const postPath = path.join(process.cwd(), "blog", year, slug, "page.tsx")
  
  if (!fs.existsSync(postPath)) {
    return new NextResponse("Post content not found", { status: 404 })
  }

  // Create a simple HTML wrapper that will load your React components
  // This is a very simplified approach - in a real app, you'd want to properly
  // render the React components with all the necessary context providers
  return new NextResponse(
    `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${post.title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="stylesheet" href="/styles/globals.css" />
      <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
      <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    </head>
    <body>
      <div id="root"></div>
      <script>
        // Load the post content
        fetch('/blog/${year}/${slug}/content')
          .then(response => response.text())
          .then(html => {
            document.getElementById('root').innerHTML = html;
          });
      </script>
    </body>
    </html>
    `,
    {
      headers: {
        "Content-Type": "text/html",
      },
    }
  )
}
