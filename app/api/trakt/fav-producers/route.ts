import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  console.log("Fetching favorite producers from JSON")
  try {
    const filePath = path.join(process.cwd(), "data", "film", "fav-producers.json")
    const fileContents = fs.readFileSync(filePath, "utf8")
    const data = JSON.parse(fileContents)

    console.log(`Retrieved ${data.length} favorite producers`)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching favorite producers:", error)
    return NextResponse.json({ error: "Failed to fetch favorite producers" }, { status: 500 })
  }
}

