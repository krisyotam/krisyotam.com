import { ArtBase, type ArtworkInfo } from "./art-base"

interface ArtGoldenRatioProps {
  artwork: ArtworkInfo
  className?: string
}

export function ArtGoldenRatio({ artwork, className }: ArtGoldenRatioProps) {
  // The golden ratio is approximately 1.618:1
  return <ArtBase artwork={artwork} aspectRatio="aspect-[1.618/1]" className={className} />
}

