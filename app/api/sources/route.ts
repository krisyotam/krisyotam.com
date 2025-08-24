import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Read the sources data from the JSON file
    const filePath = path.join(process.cwd(), "data", "sources.json")
    const fileContents = fs.readFileSync(filePath, "utf8")
    const data = JSON.parse(fileContents)

    // Return the sources data
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching sources:", error)
    return NextResponse.json({ error: "Failed to fetch sources" }, { status: 500 })
  }
}

