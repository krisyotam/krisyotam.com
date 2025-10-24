import { PageHeader } from "@/components/page-header"
import { CompaniesGrid } from "@/components/companies-grid"
import { staticMetadata } from "@/lib/staticMetadata"
import type { Metadata } from "next"

export const metadata: Metadata = staticMetadata.companies

export default function CompaniesPage() {
  return (
    <main className="max-w-[850px] mx-auto px-4 py-10">
      <PageHeader
        title="Companies"
        subtitle="Startup Performance Tracking"
        start_date="2025-01-01"
        end_date={new Date().toISOString().split('T')[0]}
        preview="My collection of indie companies and startups, tracking their performance, growth metrics, and business developments over time."
        status="In Progress"
        confidence="likely"
        importance={7}
      />
      <div className="mt-6">
        <CompaniesGrid />
      </div>
    </main>
  )
}