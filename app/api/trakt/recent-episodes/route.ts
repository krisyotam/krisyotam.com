import { getRecentlyWatchedEpisodes } from "@/lib/trakt-api"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const limit = Number.parseInt(searchParams.get("limit") || "10", 10)

  console.log(`Fetching recent episodes with limit ${limit} from API`)
  try {
    const episodes = await getRecentlyWatchedEpisodes(limit)
    console.log(`Retrieved ${episodes.length} recent episodes`)
    return NextResponse.json(episodes)
  } catch (error) {
    console.error("Error fetching recently watched episodes:", error)
    return NextResponse.json({ error: "Failed to fetch recently watched episodes" }, { status: 500 })
  }
}

