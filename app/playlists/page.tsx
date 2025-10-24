import type { Metadata } from "next"
import PlaylistsClientPage from "./PlaylistsClientPage"
import { staticMetadata } from "@/lib/staticMetadata"

export const metadata: Metadata = staticMetadata.playlists

export default function PlaylistsPage() {
  return <PlaylistsClientPage />
}

