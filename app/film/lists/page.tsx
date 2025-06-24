import { FilmTabs } from "@/components/film/film-tabs"
import { FilmListsSection } from "@/components/film/film-lists-section"
import { PageHeader } from "@/components/page-header"

export const metadata = {
  title: "Film Lists | Kris Yotam",
  description: "My custom movie and TV show lists from Trakt.tv",
}

export default function FilmListsPage() {
  return (
    <div className="film-page py-12">
      <PageHeader 
        title="Film Lists" 
        preview="My custom movie and TV show lists from Trakt.tv"
      />
      
      <FilmTabs>
        <FilmListsSection />
      </FilmTabs>
    </div>
  )
}
