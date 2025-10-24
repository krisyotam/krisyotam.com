import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Read from library-notes.json file
    const filePath = path.join(process.cwd(), "data", "library", "library-notes.json")
    const fileData = fs.readFileSync(filePath, "utf8")
    const notesData = JSON.parse(fileData)

    return NextResponse.json(notesData)
  } catch (error) {
    console.error("Error reading library notes:", error)
    return NextResponse.json({ error: "Failed to fetch library notes" }, { status: 500 })
  }
}

