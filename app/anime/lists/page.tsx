import { Metadata } from "next"
import AnimeListsClientPage from "./anime-lists-client-page"

export const metadata: Metadata = {
  title: "Anime Lists | Kris Yotam",
  description: "My anime collections and custom lists organized by themes, genres, and preferences.",
  openGraph: {
    title: "Anime Lists | Kris Yotam",
    description: "My anime collections and custom lists organized by themes, genres, and preferences.",
    type: "website",
  },
}

export default function AnimeListsPage() {
  return <AnimeListsClientPage />
}
