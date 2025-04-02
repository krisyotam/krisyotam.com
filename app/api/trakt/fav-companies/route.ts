import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  console.log("Fetching favorite film companies from JSON")
  try {
    const filePath = path.join(process.cwd(), "data", "fav-film-companies.json")
    const fileContents = fs.readFileSync(filePath, "utf8")
    const data = JSON.parse(fileContents)

    console.log(`Retrieved ${data.length} favorite film companies`)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching favorite film companies:", error)
    return NextResponse.json({ error: "Failed to fetch favorite film companies" }, { status: 500 })
  }
}

