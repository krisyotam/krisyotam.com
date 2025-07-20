import { Metadata } from "next"
import MangaListsClientPage from "./manga-lists-client-page"
import { staticMetadata } from "@/lib/staticMetadata"

export const metadata: Metadata = {
  title: "Manga Lists | Kris Yotam",
  description: "My manga collections and custom lists organized by themes, genres, and preferences.",
}

export default function MangaListsPage() {
  return <MangaListsClientPage />
}
