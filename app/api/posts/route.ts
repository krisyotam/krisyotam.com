// app/api/posts/route.ts
import { promises as fs } from "fs"
import path from "path"

export async function GET(req: Request) {
  try {
    const filePath = path.join(process.cwd(), "data", "blog", "blog.json")
    const fileContents = await fs.readFile(filePath, "utf8")
    const data = JSON.parse(fileContents)

    return new Response(JSON.stringify(data), { status: 200 })
  } catch (error) {
    console.error("Error loading posts:", error)
    return new Response(
      JSON.stringify({ error: "Error loading posts" }),
      { status: 500 }
    )
  }
}
