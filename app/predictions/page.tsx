import { PageHeader } from "@/components/page-header"
import { PredictionsClientPage } from "./PredictionsClientPage"

export default function PredictionsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader
          title="Predictions"
          preview="This page contains my personal predictions about various topics, tracked over time to improve forecasting accuracy."
          date="2025-01-15"
          status="In Progress"
          confidence="likely"
          importance={7}
        />

        <div className="mt-8">
          <PredictionsClientPage />
        </div>
      </div>
    </div>
  )
}
