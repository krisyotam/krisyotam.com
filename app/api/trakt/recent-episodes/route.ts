import { NextResponse } from "next/server"
import fs from "fs"
import path from "path"

// Use static rendering
export const dynamic = 'force-static';

export async function GET() {
  try {
    // Use a fixed limit
    const limit = 10;
    
    // Read from the JSON file instead of API
    // Since we may not have a dedicated episodes JSON, we'll derive from shows
    const filePath = path.join(process.cwd(), "data", "film", "shows.json")
    const fileContents = fs.readFileSync(filePath, "utf8")
    const allShows = JSON.parse(fileContents)
    
    // Create episodes from shows data
    const episodes = [];
    allShows.forEach(show => {
      if (show.seasons) {
        show.seasons.forEach(season => {
          if (season.episodes) {
            season.episodes.forEach(episode => {
              episodes.push({
                show: show.title,
                season: season.number,
                episode: episode.number,
                title: episode.title,
                watched_at: episode.watched_at || show.watched_at,
                rating: episode.rating
              });
            });
          }
        });
      }
    });
    
    // Sort by date to get most recent
    const sortedEpisodes = episodes
      .filter(ep => ep.watched_at) // Only include episodes with watched_at date
      .sort((a, b) => new Date(b.watched_at).getTime() - new Date(a.watched_at).getTime())
      .slice(0, limit);
    
    console.log(`Generated ${sortedEpisodes.length} recent episodes from shows data`);
    return NextResponse.json(sortedEpisodes);
  } catch (error) {
    console.error("Error generating recently watched episodes:", error);
    return NextResponse.json(
      { error: "Failed to generate recently watched episodes" }, 
      { status: 500 }
    );
  }
}

