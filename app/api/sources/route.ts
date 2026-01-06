import { NextResponse } from "next/server"
import { getAllSources } from "@/lib/system-db"

export async function GET() {
  try {
    const sources = getAllSources()
    return NextResponse.json({ sources })
  } catch (error) {
    console.error("Error fetching sources:", error)
    return NextResponse.json({ error: "Failed to fetch sources" }, { status: 500 })
  }
}

