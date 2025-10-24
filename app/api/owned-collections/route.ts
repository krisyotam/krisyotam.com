import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "local-collections.json")
    const fileData = fs.readFileSync(filePath, "utf8")
    const collectionsData = JSON.parse(fileData)

    return NextResponse.json(collectionsData)
  } catch (error) {
    console.error("Error reading collections:", error)
    return NextResponse.json({ error: "Failed to fetch collections" }, { status: 500 })
  }
}

