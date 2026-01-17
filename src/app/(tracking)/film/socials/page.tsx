import { FilmTabs } from "@/components/film/film-tabs"
import { FilmSocialsSection } from "@/components/film/film-socials-section"
import { PageHeader } from "@/components/core"
import { Metadata } from "next"
import { staticMetadata } from "@/lib/staticMetadata"

export const metadata: Metadata = staticMetadata.film

export default function FilmSocialsPage() {
  return (
    <div className="py-12">
      <div className="film-page">
        <PageHeader 
          title="Film Socials" 
          preview="My film and TV social media profiles and accounts"
        />
        
        <FilmTabs>
          <FilmSocialsSection />
        </FilmTabs>
      </div>
    </div>
  )
}
