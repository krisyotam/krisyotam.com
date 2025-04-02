import { getWatchedStats } from "@/lib/trakt-api"
import { NextResponse } from "next/server"

export async function GET() {
  console.log("Fetching watched counts from API")
  try {
    const stats = await getWatchedStats()
    console.log("Watched counts:", stats)
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching watched counts:", error)
    return NextResponse.json({ error: "Failed to fetch watched counts" }, { status: 500 })
  }
}

