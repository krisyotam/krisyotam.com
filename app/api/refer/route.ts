import { NextResponse } from "next/server"
import path from "path"
import fs from "fs"

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data/refer/refer.json")
    const raw = fs.readFileSync(filePath, "utf-8")
    const refer = JSON.parse(raw)

    const categoriesPath = path.join(process.cwd(), "data/refer/categories.json")
    const catRaw = fs.readFileSync(categoriesPath, "utf-8")
    const categories = JSON.parse(catRaw)

    return NextResponse.json({ refer, categories })
  } catch (error) {
    console.error('Error reading refer data', error)
    return NextResponse.json({ refer: [], categories: [] }, { status: 500 })
  }
}
