import { ArtBase, type ArtworkInfo } from "./art-base"

interface ArtPortraitProps {
  artwork: ArtworkInfo
  className?: string
}

export function ArtPortrait({ artwork, className }: ArtPortraitProps) {
  return <ArtBase artwork={artwork} aspectRatio="aspect-[2/3]" className={className} />
}

