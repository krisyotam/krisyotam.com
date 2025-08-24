import { Metadata } from "next"
import AnimeListsClientPage from "./anime-lists-client-page"
import { staticMetadata } from "@/lib/staticMetadata"

export const metadata: Metadata = staticMetadata.anime

export default function AnimeListsPage() {
  return <AnimeListsClientPage />
}
