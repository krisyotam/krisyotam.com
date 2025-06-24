import { FilmTabs } from "@/components/film/film-tabs"
import { FilmSocialsSection } from "@/components/film/film-socials-section"
import { PageHeader } from "@/components/page-header"

export const metadata = {
  title: "Film Socials | Kris Yotam",
  description: "My film and TV social media profiles and accounts",
}

export default function FilmSocialsPage() {
  return (
    <div className="film-page py-12">
      <PageHeader 
        title="Film Socials" 
        preview="My film and TV social media profiles and accounts"
      />
      
      <FilmTabs>
        <FilmSocialsSection />
      </FilmTabs>
    </div>
  )
}
