import fs from "fs/promises"
import path from "path"

export async function GET() {
  try {
    const file = path.join(process.cwd(), "data", "map", "map.json")
    const raw = await fs.readFile(file, "utf8")
    const data = JSON.parse(raw)
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (err) {
    console.error("/api/map error:", err)
    return new Response(JSON.stringify({ error: "Failed to read map data" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
