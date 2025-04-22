import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const slug = searchParams.get("slug")

  if (!type || !slug) {
    return NextResponse.json({ error: "Type and slug are required" }, { status: 400 })
  }

  try {
    // Try to find the entry in the appropriate JSON file
    const filePath = path.join(process.cwd(), "data", "progymnasmata", `${type.toLowerCase()}.json`)

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Type not found" }, { status: 404 })
    }

    const fileContent = fs.readFileSync(filePath, "utf8")
    const entries = JSON.parse(fileContent)

    const entry = entries.find((e: any) => e.slug === slug)

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 })
    }

    return NextResponse.json(entry)
  } catch (error) {
    console.error("Error fetching progymnasmata entry:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
