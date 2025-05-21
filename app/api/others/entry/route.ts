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
    const filePath = path.join(process.cwd(), "data", "others.json")
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: "Data file not found" }, { status: 404 })
    }

    const fileContent = fs.readFileSync(filePath, "utf8")
    const entries = JSON.parse(fileContent)

    const entry = entries.find((e: any) => e.slug === slug)

    if (!entry) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 })
    }

    return NextResponse.json(entry)
  } catch (error) {
    console.error("Error fetching others entry:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 
