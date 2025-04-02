import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    // Read the progymnasmata.json file
    const filePath = path.join(process.cwd(), "data", "progymnasmata.json")
    const fileContents = fs.readFileSync(filePath, "utf8")
    const data = JSON.parse(fileContents)

    // Sort by date (newest first)
    data.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error reading progymnasmata data:", error)
    return NextResponse.json({ error: "Failed to fetch progymnasmata data" }, { status: 500 })
  }
}

