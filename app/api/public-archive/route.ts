import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const dataDirectory = path.join(process.cwd(), "data")
    // public-archive maps to the doc-produced archive.json
    const fileContents = fs.readFileSync(path.join(dataDirectory, "doc", "archive.json"), "utf8")
    const data = JSON.parse(fileContents)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error reading public-archive data:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
