import FilmClientPage from "./film-client-page"
import { FilmTabs } from "@/components/film/film-tabs"
import { PageHeader } from "@/components/page-header"
import "./film.css"

export const metadata = {
  title: "Film | Kris Yotam",
  description: "My film and TV watching activity and favorites",
}

export default function FilmPage() {
  return (
    <div className="py-12">
      <div className="film-page">
        <PageHeader 
          title="Film"
          date="2025-01-01"
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

