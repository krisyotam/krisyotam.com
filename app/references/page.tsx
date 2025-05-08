import { PageHeader } from "@/components/page-header"
import { ReferencesClient } from "./references-client"

export const metadata = {
  title: "References | Kris Yotam",
  description: "A collection of research papers, books, and other reference materials",
}

export default function ReferencesPage() {
  return (
    <main className="max-w-[650px] mx-auto px-4 py-12">
      <PageHeader 
        title="References"
        date={new Date().toISOString()}
        preview="references used for krisyotam.com & krisyotam.net"
        status="In Progress"
        confidence="certain"
        importance={8}
      />
      <ReferencesClient />
    </main>
  )
} 