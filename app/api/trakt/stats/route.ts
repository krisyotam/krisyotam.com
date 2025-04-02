import { getWatchedStats } from "@/lib/trakt-api"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const stats = await getWatchedStats()
    return NextResponse.json(stats)
  } catch (error) {
    console.error("Error fetching watched stats:", error)
    return NextResponse.json({ error: "Failed to fetch watched stats" }, { status: 500 })
  }
}

