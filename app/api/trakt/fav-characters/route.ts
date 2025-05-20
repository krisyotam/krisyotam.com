import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  console.log("Fetching favorite film characters from JSON")
  try {
    const filePath = path.join(process.cwd(), "data", "film", "fav-film-characters.json")
    const fileContents = fs.readFileSync(filePath, "utf8")
    const data = JSON.parse(fileContents)

    console.log(`Retrieved ${data.length} favorite film characters`)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching favorite film characters:", error)
    return NextResponse.json({ error: "Failed to fetch favorite film characters" }, { status: 500 })
  }
}

