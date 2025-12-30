"use client"

import SiteStickerCarousel from "@/components/site-sticker-carousel"
import otherSitesData from "@/data/about/other-sites.json"

export default function OtherSites() {
  return (
    <div className="py-4">
      <p className="text-lg text-muted-foreground font-light mb-6">
        My Substack, followed by a curated list of other notable publications I read.
        Though I may not align with all—or indeed any—of the perspectives or principal themes espoused therein, 
        I hold firm the conviction that serious inquiry demands the rigorous engagement with opposing worldviews. 
        For those disinclined toward intellectual timidity, I recommend the following with the utmost sincerity. 
      </p>
      <SiteStickerCarousel sites={otherSitesData} />
    </div>
  )
} 