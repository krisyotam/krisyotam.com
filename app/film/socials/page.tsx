import { FilmTabs } from "@/components/film/film-tabs"
import { FilmSocialsSection } from "@/components/film/film-socials-section"
import { PageHeader } from "@/components/page-header"
import { Metadata } from "next"
import { staticMetadata } from "@/lib/staticMetadata"

export const metadata: Metadata = staticMetadata.film

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
