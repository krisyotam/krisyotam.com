import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Read the JSON file
    const filePath = path.join(process.cwd(), "data", "resources-archives.json")
    const fileContents = fs.readFileSync(filePath, "utf8")
    const resources = JSON.parse(fileContents)

    // Return the data
    return NextResponse.json(resources)
  } catch (error) {
    console.error("Error reading resources:", error)
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 })
  }
}
