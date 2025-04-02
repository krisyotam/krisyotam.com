import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Read from library.json file
    const filePath = path.join(process.cwd(), "data", "library.json")
    const fileData = fs.readFileSync(filePath, "utf8")
    const libraryData = JSON.parse(fileData)

    return NextResponse.json(libraryData.books)
  } catch (error) {
    console.error("Error reading library catalog:", error)
    return NextResponse.json({ error: "Failed to fetch library catalog" }, { status: 500 })
  }
}

