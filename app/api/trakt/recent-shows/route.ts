import { type NextRequest, NextResponse } from "next/server"
import { getRecentlyWatchedShows } from "@/lib/trakt-api"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const limit = Number.parseInt(searchParams.get("limit") || "10", 10)

    const shows = await getRecentlyWatchedShows(limit)
    return NextResponse.json(shows)
  } catch (error) {
    console.error("Error in recent-shows API route:", error)
    return NextResponse.json({ error: "Failed to fetch recently watched shows" }, { status: 500 })
  }
}

