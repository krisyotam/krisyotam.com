// app/api/trakt/recent-shows/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Use static rendering
export const dynamic = 'force-static';

export async function GET() {
  try {
    // Use a fixed limit
    const limit = 10;
    
    // Read from the JSON file instead of API
    const filePath = path.join(process.cwd(), "data", "film", "shows.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const allShows = JSON.parse(fileContents);
    
    // Sort by date to get most recent and limit the results
    const sortedShows = allShows.sort((a, b) => 
      new Date(b.watched_at || b.date).getTime() - new Date(a.watched_at || a.date).getTime()
    );
    const recentShows = sortedShows.slice(0, limit);
    
    console.log(`Retrieved ${recentShows.length} recent shows from JSON file`);
    return NextResponse.json(recentShows);
  } catch (error) {
    console.error("Error in recent-shows API route:", error);
    return NextResponse.json(
      { error: "Failed to fetch recently watched shows" },
      { status: 500 }
    );
  }
}
