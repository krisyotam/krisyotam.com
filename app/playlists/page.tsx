import type { Metadata } from "next"
import PlaylistsClientPage from "./PlaylistsClientPage"

export const metadata: Metadata = {
  title: "Playlists | Kris Magnum Opus",
  description: "Browse my curated music playlists across various genres.",
}

export default function PlaylistsPage() {
  return <PlaylistsClientPage />
}

