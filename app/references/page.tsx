import { PageHeader } from "@/components/page-header"
import { ReferencesClient } from "./references-client"

export const metadata = {
  title: "References | Kris Yotam",
  description: "A collection of research papers, books, and other reference materials",
}

export default function ReferencesPage() {
  return (    <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
      <PageHeader 
        title="References"
        date={new Date().toISOString()}
        preview="A curated collection of research papers, books, and reference materials used across krisyotam.com"
        status="In Progress"
        confidence="certain"
        importance={8}
      />
      <ReferencesClient />
    </div>
  )
} 