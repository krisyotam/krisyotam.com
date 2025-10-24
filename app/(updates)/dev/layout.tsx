import { PageHeader } from "@/components/page-header";
import "../updates.css";

export default function DevLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen bg-background text-foreground pt-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8 max-w-[672px] mx-auto">
          <PageHeader
            title="Dev Log"
            subtitle="Development Notes & Experiments"
            start_date="2025-01-01"
            end_date={new Date().toISOString().split('T')[0]}
            preview="design, experimnts, and development notes."
            status="In Progress"
            confidence="likely"
            importance={5}
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
