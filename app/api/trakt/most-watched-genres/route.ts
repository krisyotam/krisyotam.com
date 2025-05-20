// app/api/trakt/most-watched-genres/route.ts
export const dynamic = 'force-dynamic';

import { getMostWatchedGenres } from "@/lib/trakt-api";
import { NextResponse } from "next/server";

export async function GET() {
  console.log("Fetching most watched genres from API");
  try {
    const genres = await getMostWatchedGenres();
    console.log(`Retrieved ${genres.length} genres`);
    return NextResponse.json(genres);
  } catch (error) {
    console.error("Error fetching most watched genres:", error);
    // Return an empty array instead of an error
    return NextResponse.json([]);
  }
}
