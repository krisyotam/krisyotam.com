// app/api/posts/posts.ts
import { promises as fs } from "fs"
import path from "path"

/**
 * Returns a plain array of posts (unwrapped) for client code
 */
export async function GET(req: Request) {
  const filePath = path.join(process.cwd(), "data", "feed.json")
  const raw = await fs.readFile(filePath, "utf8")
  const data = JSON.parse(raw)

  // If your feed.json is { posts: [...] }, extract it; otherwise assume data is already an array
  const posts = Array.isArray(data) ? data : data.posts

  return new Response(JSON.stringify(posts), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  })
}
