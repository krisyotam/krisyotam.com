// app/api/trakt/recent-shows/route.ts
export const dynamic = 'force-dynamic';

import { type NextRequest, NextResponse } from "next/server";
import { getRecentlyWatchedShows } from "@/lib/trakt-api";

export async function GET(request: NextRequest) {
  try {
    const limit = Number.parseInt(request.nextUrl.searchParams.get("limit") || "10", 10);
    const shows = await getRecentlyWatchedShows(limit);
    return NextResponse.json(shows);
  } catch (error) {
    console.error("Error in recent-shows API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch recently watched shows" },
      { status: 500 }
    );
  }
}
