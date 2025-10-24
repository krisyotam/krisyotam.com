import AnimeClientPage from "./anime-client-page"
import "./anime.css"
import { staticMetadata } from "@/lib/staticMetadata"
import type { Metadata } from "next"

export const metadata: Metadata = staticMetadata.anime

export default function AnimePage() {
  return <AnimeClientPage />
}

