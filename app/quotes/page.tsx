"use client"

import { useState } from "react"
import { QuoteCard } from "../../components/quote-card"
import quotesData from "../../data/quotes.json"
import { Button } from "@/components/ui/button"
import { HelpCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PageHeader } from "@/components/page-header"

// Add Quotes page metadata after other imports
const quotesPageData = {
  title: "Quotes",
  subtitle: "Notable Sayings and Excerpts",
  date: new Date().toISOString(),
  preview: "A collection of notable quotes and excerpts from my writings, speeches, and other creative works.",
  status: "In Progress" as const,
  confidence: "certain" as const,
  importance: 7,
}

export const dynamic = "force-dynamic"

export default function QuotesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const sortedQuotes = [...quotesData.quotes].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  // In the return statement, add the PageHeader component before the quotes list
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
        {/* Add the PageHeader component */}
        <PageHeader
          title={quotesPageData.title}
          subtitle={quotesPageData.subtitle}
          date={quotesPageData.date}
          preview={quotesPageData.preview}
          status={quotesPageData.status}
          confidence={quotesPageData.confidence}
          importance={quotesPageData.importance}
        />

        <div className="space-y-16">
          {sortedQuotes.map((quote) => (
            <QuoteCard
              key={quote.id}
              text={quote.text}
              date={quote.date}
              category={quote.category}
              source={quote.source || "Uncategorized"}
            />
          ))}
        </div>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed bottom-4 left-4 rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200"
            onClick={() => setIsModalOpen(true)}
          >
            <HelpCircle className="h-5 w-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] bg-background rounded-lg shadow-2xl border-0">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-semibold">About Quotes</DialogTitle>
            <DialogDescription className="text-base leading-relaxed">
              This page features quotes pulled from various forms of my writing including speeches, presentations,
              articles, posts, books, poetry, fiction, and more. These quotes represent key ideas and insights from my
              work across different mediums.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

