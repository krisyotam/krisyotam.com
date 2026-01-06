/**
 * ============================================================================
 * Music Page
 * Author: Kris Yotam
 * Date: 2026-01-05
 * Filename: page.tsx
 * Description: Server component for the music page. Loads playlist data from
 *              media.db and renders the music client component.
 * ============================================================================
 */

import { getMusicPlaylists } from "@/lib/media-db";
import { PageHeader, PageDescription } from "@/components/core";
import MusicClient from "./MusicClient";

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default async function MusicPage() {
  // Load music data from the database (server-side)
  const playlists = getMusicPlaylists();

  // Transform to match the expected client format
  const playlistData = playlists.map((p) => ({
    playlist_name: p.playlist_name,
    slug: p.slug,
    cover_url: p.cover_url,
    amount_of_songs: p.amount_of_songs,
    last_updated: p.last_updated,
    category: p.category,
    tidal: p.tidal,
    qobuz: p.qobuz,
    apple_music: p.apple_music,
    spotify: p.spotify,
    status: p.status,
  }));

  return (
    <div className="relative min-h-screen bg-background text-foreground dark:bg-[#0d0d0d] dark:text-[#f2f2f2]">
      <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader
          title="Music"
          subtitle="Music — reviews, recommendations, and playlists"
          start_date="2023-01-01"
          end_date={new Date().toISOString().split("T")[0]}
          preview="carefully curated playlists from my studies of various genres, artists, and eras"
          status="In Progress"
          confidence="certain"
          importance={6}
        />
        <MusicClient playlists={playlistData} />
      </div>

      <PageDescription
        title="About Music"
        description="A place for music recommendations, reviews, and curated playlist collections. Use the search or filters to explore."
        icons={[
          { slug: "spotify", url: "#" },
          { slug: "apple", url: "#" },
          { slug: "tidal", url: "#" },
          { slug: "qobuz", url: "#" },
        ]}
      />
    </div>
  );
}
