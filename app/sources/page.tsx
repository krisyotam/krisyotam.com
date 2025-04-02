import type { Metadata } from "next"
import SourcesClientPage from "./sources-client-page"
import { PageHeader } from "@/components/page-header"

export const metadata: Metadata = {
  title: "Sources | Kris Yotam",
  description: "Messages and communications that have inspired content on this site.",
}

export default function SourcesPage() {
  return (
    <div className="container mx-auto px-4 max-w-4xl pt-12">
      <PageHeader
        title="Sources"
        subtitle="Messages and communications that have inspired content"
        date="2025-03-30"
        preview="A collection of emails, messages, and other communications that have inspired content on this site."
        status="In Progress"
        confidence="likely"
        importance={6}
        className="mb-8"
      />
      <SourcesClientPage />
    </div>
  )
}

