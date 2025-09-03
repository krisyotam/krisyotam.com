import { ArtCard, type ArtworkInfo } from "./art-card"

interface Art1x1Props {
  artwork: ArtworkInfo
  className?: string
}

export function Art1x1({ artwork, className }: Art1x1Props) {
  return <ArtCard artwork={artwork} aspectRatio="1x1" className={className} />
}

