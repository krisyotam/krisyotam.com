import { PageHeader } from "@/components/core"
import { Sitemap } from "@/components/core/sitemap"

export const metadata = {
  title: "Sitemap | Kris Yotam",
  description: "A visual map of all pages available on krisyotam.com",
}

export default function SitemapPage() {
  return (
    <div className="relative min-h-screen bg-background text-foreground">
      <div className="container max-w-[850px] mx-auto px-4 pt-16 pb-8">
        <PageHeader
          title="Sitemap"
          start_date="2025-01-01"
          end_date={new Date().toISOString().split('T')[0]}
          preview="A visual map of all pages available on krisyotam.com, organized by category."
          status="Finished"
          confidence="certain"
          importance={6}
        />

        <div className="mt-8">
          <Sitemap />
        </div>
      </div>
    </div>
  )
}
