import { PageHeader } from "@/components/page-header"
import { CompaniesGrid } from "@/components/companies-grid"

export const metadata = {
  title: "Companies | Kris Yotam",
  description: "Track the performance of various indie companies and startups",
}

export default function CompaniesPage() {
  return (
    <main className="max-w-[850px] mx-auto px-4 py-10">
      <PageHeader
        title="Companies"
        subtitle="Startup Performance Tracking"
        date={new Date().toISOString()}
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