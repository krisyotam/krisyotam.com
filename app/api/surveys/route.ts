import { NextResponse } from "next/server"
import path from "path"
import { promises as fs } from "fs"

export async function GET() {
  const filePath = path.join(process.cwd(), "data/surveys/surveys.json")
  try {
    const fileContents = await fs.readFile(filePath, "utf-8")
    const data = JSON.parse(fileContents)
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Failed to load surveys" }, { status: 500 })
  }
}
