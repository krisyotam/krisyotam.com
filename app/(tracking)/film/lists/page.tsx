import { FilmTabs } from "@/components/film/film-tabs"
import { FilmListsSection } from "@/components/film/film-lists-section"
import { PageHeader } from "@/components/core"
import { Metadata } from "next"
import { staticMetadata } from "@/lib/staticMetadata"

export const metadata: Metadata = staticMetadata.film

export default function FilmListsPage() {
  return (
    <div className="py-12">
      <div className="film-page">
        <PageHeader 
          title="Film Lists" 
          preview="My custom movie and TV show lists from Trakt.tv"
        />
        
        <FilmTabs>
          <FilmListsSection />
        </FilmTabs>
      </div>
    </div>
  )
}
