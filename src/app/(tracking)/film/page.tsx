import FilmClientPage from "./film-client-page"
import { PageHeader } from "@/components/core"
import { staticMetadata } from "@/lib/staticMetadata"
import type { Metadata } from "next"

export const metadata: Metadata = staticMetadata.film

export default function FilmPage() {
  return (
    <>
      <PageHeader
        title="Film"
        start_date="2025-01-01"
        end_date={new Date().toISOString().split('T')[0]}
        preview="My film and TV watching activity, stats, and curated collections"
        status="Finished"
        confidence="certain"
        importance={7}
      />
      <FilmClientPage />
    </>
  )
}
