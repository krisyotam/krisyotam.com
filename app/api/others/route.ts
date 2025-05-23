import { NextResponse } from "next/server"
import othersData from "@/data/others.json"

export async function GET() {
  try {
    // Use imported data directly instead of reading from file system
    // This makes it more reliable in production environments

    return NextResponse.json(othersData)
  } catch (error) {
    console.error("Error reading others data:", error instanceof Error ? error.message : String(error))
    return NextResponse.json({ error: "Failed to fetch others data" }, { status: 500 })
  }
} 