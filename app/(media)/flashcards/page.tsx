import type { Metadata } from "next"
import dynamic from "next/dynamic"
import flashcardsJson from "@/data/flashcards/flashcards.json"
import { PageHeader } from "@/components/core"

// Load client-only components dynamically so this page remains a server component
const FlashcardsClient = dynamic(() => import("./FlashcardsClient"), { ssr: false })
const PageDescription = dynamic(() => import("@/components/core").then(mod => ({ default: mod.PageDescription })), { ssr: false })

export const metadata: Metadata = {
  title: "Flashcards",
  description: "Flashcard sets and collections",
}

export default async function FlashcardsPage() {
  const sets = (flashcardsJson as any)?.flashcards || []

  return (
    <div className="relative min-h-screen bg-background text-foreground dark:bg-[#0d0d0d] dark:text-[#f2f2f2]">
      <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader
          title="Flashcards"
          subtitle="Flashcards — spaced repetition sets and study collections"
          start_date="2023-01-01"
          end_date={new Date().toISOString().split('T')[0]}
          preview="originally created high quality, rigirous, formal definition cards for rote memorization of declarative knowledge across various subjects."
          status="Active"
          confidence="likely"
          importance={4}
        />

        <FlashcardsClient sets={sets} />
      </div>

      <PageDescription
        title="About Flashcards"
        description="Flashcard sets organized by topic. Use the search to find sets and toggle between grid or list views. Clicking a set opens the source link." 
      />
    </div>
  )
}
