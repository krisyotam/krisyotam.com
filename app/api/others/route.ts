import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Try different path resolutions to handle both local and deployment environments
    let fileContent;
    try {
      const filePath = path.join(process.cwd(), "data", "others.json")
      fileContent = fs.readFileSync(filePath, "utf8")
    } catch (e) {
      // Fallback path for deployment
      const altPath = path.join(process.cwd(), "..", "data", "others.json")
      fileContent = fs.readFileSync(altPath, "utf8")
    }
    
    const othersData = JSON.parse(fileContent)

    return NextResponse.json(othersData)
  } catch (error) {
    console.error("Error reading others data:", error)
    return NextResponse.json({ error: "Failed to fetch others data" }, { status: 500 })
  }
} 