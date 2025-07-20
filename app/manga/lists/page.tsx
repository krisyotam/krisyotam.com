import { Metadata } from "next"
import MangaListsClientPage from "./manga-lists-client-page"
import { staticMetadata } from "@/lib/staticMetadata"

export const metadata: Metadata = staticMetadata.manga

export default function MangaListsPage() {
  return <MangaListsClientPage />
}
