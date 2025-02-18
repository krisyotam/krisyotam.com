import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

export async function GET() {
  try {
    const dataDirectory = path.join(process.cwd(), "data")
    const fileContents = fs.readFileSync(path.join(dataDirectory, "keynotes.json"), "utf8")
    const data = JSON.parse(fileContents)
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error reading keynotes data:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

