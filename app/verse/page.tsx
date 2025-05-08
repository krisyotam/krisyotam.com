// app/poetry/page.tsx
import type { Metadata } from "next"
import { VerseClient } from "./verse-client"

export const metadata: Metadata = {
  title: "Verse | Kris Yotam",
  description: "A collection of poems, haikus, and other verse forms.",
}

export default function VersePage() {
  return <VerseClient />
}
