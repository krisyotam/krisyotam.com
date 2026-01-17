import { ArtCard, type ArtworkInfo } from "./art-card"

interface Art4x7Props {
  artwork: ArtworkInfo
  className?: string
}

export function Art4x7({ artwork, className }: Art4x7Props) {
  return <ArtCard artwork={artwork} aspectRatio="4x7" className={className} />
}

