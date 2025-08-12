import { NextResponse } from "next/server"
import blogrollData from "@/data/blogroll/blogroll.json"

export async function GET() {
  try {
    // Use imported data directly instead of reading from file system
    // This makes it more reliable in production environments

    return NextResponse.json(blogrollData)
  } catch (error) {
    console.error("Error reading blogroll data:", error instanceof Error ? error.message : String(error))
    return NextResponse.json({ error: "Failed to fetch blogroll data" }, { status: 500 })
  }
}
