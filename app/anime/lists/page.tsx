import { Metadata } from "next"
import AnimeListsClientPage from "./anime-lists-client-page"
import { staticMetadata } from "@/lib/staticMetadata"

export const metadata: Metadata = {
  title: "Anime Lists | Kris Yotam",
  description: "My anime collections and custom lists organized by themes, genres, and preferences.",
}

export default function AnimeListsPage() {
  return <AnimeListsClientPage />
}
