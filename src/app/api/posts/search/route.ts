// app/api/posts/search/route.ts
import { getContentByType } from "@/lib/data"

/**
 * Returns a plain array of blog posts for client code
 */
export async function GET(req: Request) {
  const posts = getContentByType('blog')

  return new Response(JSON.stringify(posts), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}
