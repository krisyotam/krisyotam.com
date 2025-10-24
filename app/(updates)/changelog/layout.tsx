import { PageHeader } from "@/components/page-header";
import "../updates.css";

export default function ChangelogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8 max-w-[672px] mx-auto">
          <PageHeader
            title="Changelog"
            subtitle="Site Updates & Changes"
            start_date="2025-01-01"
            end_date={new Date().toISOString().split('T')[0]}
            preview="Monthly chronological list of recent major writings/changes/additions to krisyotam.com (see also the monthly newsletter)"
            status="Finished"
            confidence="certain"
            importance={7}
            backText="Home"
            backHref="/"
          />
        </div>
        <main className="container max-w-[672px] mx-auto px-4">
          <div className="note-content">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
