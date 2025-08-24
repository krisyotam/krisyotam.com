import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Read the verse.json file
    const filePath = path.join(process.cwd(), "data", "verse", "verse.json")
    const fileContents = fs.readFileSync(filePath, "utf8")
    const poems = JSON.parse(fileContents)

    return NextResponse.json(poems)
  } catch (error) {
    console.error("Error reading poems:", error)
    return NextResponse.json({ error: "Failed to fetch poems" }, { status: 500 })
  }
}
