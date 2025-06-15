// app/api/conspiracies/route.ts
import { promises as fs } from "fs"
import path from "path"

export async function GET(req: Request) {
  try {
    const filePath = path.join(process.cwd(), "data", "conspiracies", "conspiracies.json")
    const fileContents = await fs.readFile(filePath, "utf8")
    const data = JSON.parse(fileContents)

    return new Response(JSON.stringify(data), { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    })
  } catch (error) {
    console.error("Error loading conspiracies:", error)
    return new Response(
      JSON.stringify({ error: "Error loading conspiracies" }),
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        }
      }
    )
  }
}
