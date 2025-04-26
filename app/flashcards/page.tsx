import { PageHeader } from "@/components/page-header"
import MochiClientPage from "./mochi-client"

export const metadata = {
  title: "Flashcards | Kris Yotam",
  description: "Collection of mochi flashcards for learning using spaced repetition",
}

export default function MochiPage() {
  return (
    <main className="max-w-[650px] mx-auto px-4 py-12">
      <PageHeader
        title="Flashcards"
        subtitle="Spaced Repetition Collection"
        date={new Date().toISOString()}
        preview="Collection of Mochi and Anki flashcard decks for spaced repetition learning."
        status="In Progress"
        confidence="certain"
        importance={7}
      />
      <MochiClientPage />
    </main>
  )
}
