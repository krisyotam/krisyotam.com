import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const dataDirectory = path.join(process.cwd(), "data", "doc")
    const targetPath = path.join(dataDirectory, "doc.json")

    if (!fs.existsSync(targetPath)) {
      console.error("doc.json not found at", targetPath)
      return NextResponse.json({ error: "Not Found" }, { status: 404 })
    }

    const fileContents = fs.readFileSync(targetPath, "utf8")
    const data = JSON.parse(fileContents)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error reading doc data:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
