"use client"

import { NowPageContent } from "@/components/now-page-content"
import { MonthlyArchive } from "@/components/monthly-archive"

export default function NowPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-8 md:p-16 lg:p-24">
        <header className="mb-16">
          <h1 className="text-4xl font-semibold mb-3 text-foreground">Now</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </header>

        <NowPageContent />

        <section className="mt-24">
          <h2 className="text-2xl font-semibold mb-6 text-foreground">Archive</h2>
          <div className="space-y-4">
            <MonthlyArchive month="April 2025" content={<NowPageContent isArchived />} />
            <MonthlyArchive month="Febuary 2025" content={<NowPageContent isArchived />} />
            {/* Additional archived months would be added here */}
          </div>
        </section>
      </div>
    </div>
  )
}

