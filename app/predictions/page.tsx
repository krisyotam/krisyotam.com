import { PageHeader } from "@/components/page-header"
import { PredictionsClientPage } from "./PredictionsClientPage"
import { PageDescription } from "@/components/posts/typography/page-description"
import { staticMetadata } from "@/lib/staticMetadata"
import type { Metadata } from "next"

export const metadata: Metadata = staticMetadata.predictions

export default function PredictionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-[672px] mx-auto px-4 pt-16 pb-8">
        <PageHeader
          title="Predictions"
          preview="This page contains my personal predictions about various topics, tracked over time to improve forecasting accuracy."
          start_date="2025-01-15"
          status="In Progress"
          confidence="likely"
          importance={7}
        />

        <div className="mt-6">
          <PredictionsClientPage />
        </div>

        <PageDescription
          title="About the Predictions Page"
          description="This section contains my ongoing predictions, rated by confidence and tracked over time. Each prediction includes a confidence rating, category, status, and expiry date (if applicable). Use the search and filter controls above to find specific predictions by topic or category."
        />
      </div>
    </div>
  )
}
