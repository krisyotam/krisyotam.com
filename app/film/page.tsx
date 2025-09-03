import FilmClientPage from "./film-client-page"
import { FilmTabs } from "@/components/film/film-tabs"
import { PageHeader } from "@/components/page-header"
import { staticMetadata } from "@/lib/staticMetadata"
import type { Metadata } from "next"
import "./film.css"

export const metadata: Metadata = staticMetadata.film

export default function FilmPage() {
  return (
    <div className="py-12">
      <div className="film-page">
        <PageHeader 
          title="Film"
          start_date="2025-01-01"
          end_date={new Date().toISOString().split('T')[0]}
          preview="My film and TV watching activity, stats, and curated collections"
          status="Finished"
          confidence="certain"
          importance={7}
        />
        
        <FilmTabs>
          <FilmClientPage />
        </FilmTabs>
      </div>
    </div>
  )
}

