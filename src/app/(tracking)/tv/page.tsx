import TvClientPage from "./tv-client-page"
import { PageHeader } from "@/components/core"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "TV | Kris Yotam",
  description: "My TV watching activity, stats, and curated collections",
}

export default function TvPage() {
  return (
    <>
      <PageHeader
        title="TV"
        start_date="2025-01-01"
        end_date={new Date().toISOString().split('T')[0]}
        preview="My TV watching activity, stats, and curated collections"
        status="In Progress"
        confidence="likely"
        importance={6}
      />
      <TvClientPage />
    </>
  )
}
