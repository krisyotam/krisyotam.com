import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Read the JSON file
    const filePath = path.join(process.cwd(), "data", "links", "links.json")
    const fileContents = fs.readFileSync(filePath, "utf8")
    const links = JSON.parse(fileContents)

    // Return the data
    return NextResponse.json(links)
  } catch (error) {
    console.error("Error reading links:", error)
    return NextResponse.json({ error: "Failed to fetch links" }, { status: 500 })
  }
}
