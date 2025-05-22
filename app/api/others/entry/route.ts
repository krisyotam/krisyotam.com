import { type NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"


export const dynamic = 'force-dynamic';
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const slug = searchParams.get("slug")

  if (!slug) {
    return NextResponse.json({ error: "Slug is required" }, { status: 400 })
  }
  try {
    // Try different path resolutions to handle both local and deployment environments
    let fileContent;
    let entries;
    
    try {
      const filePath = path.join(process.cwd(), "data", "others.json")
      if (!fs.existsSync(filePath)) {
        throw new Error("File not found in primary path")
      }
      fileContent = fs.readFileSync(filePath, "utf8")
    } catch (e) {
      // Fallback path for deployment
      const altPath = path.join(process.cwd(), "..", "data", "others.json")
      if (!fs.existsSync(altPath)) {
        return NextResponse.json({ error: "Data file not found in any location" }, { status: 404 })
      }
      fileContent = fs.readFileSync(altPath, "utf8")
    }
    
    entries = JSON.parse(fileContent)

    const entry = entries.find((e: any) => e.slug === slug)

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 })
    }

    return NextResponse.json(entry)  } catch (error) {
    console.error("Error fetching others entry:", error instanceof Error ? error.message : String(error))
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 
