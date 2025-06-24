import { Metadata } from "next"
import MangaListsClientPage from "./manga-lists-client-page"

export const metadata: Metadata = {
  title: "Manga Lists | Kris Yotam",
  description: "My manga collections and custom lists organized by themes, genres, and preferences.",
  openGraph: {
    title: "Manga Lists | Kris Yotam",
    description: "My manga collections and custom lists organized by themes, genres, and preferences.",
    type: "website",
  },
}

export default function MangaListsPage() {
  return <MangaListsClientPage />
}
