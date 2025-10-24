import { ArtCard, type ArtworkInfo } from "./art-card"

interface Art7x4Props {
  artwork: ArtworkInfo
  className?: string
}

export function Art7x4({ artwork, className }: Art7x4Props) {
  return <ArtCard artwork={artwork} aspectRatio="7x4" className={className} />
}

