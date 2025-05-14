import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "others.json")
    const fileContent = fs.readFileSync(filePath, "utf8")
    const othersData = JSON.parse(fileContent)

    return NextResponse.json(othersData)
  } catch (error) {
    console.error("Error reading others data:", error)
    return NextResponse.json({ error: "Failed to fetch others data" }, { status: 500 })
  }
} 