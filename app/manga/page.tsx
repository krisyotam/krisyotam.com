import MangaClientPage from "./manga-client-page"
import "../anime/anime.css"
import { staticMetadata } from "@/lib/staticMetadata"
import type { Metadata } from "next"

export const metadata: Metadata = staticMetadata.manga

export default function MangaPage() {
  return <MangaClientPage />
}
