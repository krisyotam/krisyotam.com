import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Read the JSON file
    const filePath = path.join(process.cwd(), "data", "links", "categories.json")
    const fileContents = fs.readFileSync(filePath, "utf8")
    const categories = JSON.parse(fileContents)

    // Return the data
    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error reading link categories:", error)
    return NextResponse.json({ error: "Failed to fetch link categories" }, { status: 500 })
  }
}
